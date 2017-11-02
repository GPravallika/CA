/*
 * Version		: 0.0.1
 * Description	: Authentication service using passport js
 *
 */

"use strict";

var logger = import_utils('logger.js').getLoggerObject(),
    schema = require('async-validator'),
    bcrypt = require('bcrypt'),
    _ = require('lodash'),
    uuidv4 = require('uuid/v4'),
    usermodel = require(__dirname + "/models/user.js"),
    promises = require('bluebird'),
    passport = require("passport"),
    passportJWT = require("passport-jwt"),
    jwt = require("jsonwebtoken"),
    opts = {};

opts.jwtFromRequest = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = configurations.jwt.secret;

passport.use(new passportJWT.Strategy(opts, function(payload, callback) {
    usermodel.getActiveSecretsAsync(payload)
        .then(function(activeSecrets) {
            if(_.map(activeSecrets, 'secret').indexOf(payload.secret) >= 0) {
                return callback(null, payload);
            } else {
                return callback(null, false);
            }
        });
}));

var authService = {
    'initialize': function() {
        return passport.initialize();
    },
    'authenticate': function(request,response,next) {
        passport.authenticate("jwt", {
            "session": false
        }, function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return response.status(401).json({"error":"unauthorized access"});
            }
            request.user = user;
            next();
        })(request, response, next);
    },
    'login': function(request, response, next) {
        var user = {};
        user.email = request.body.email;
        user.password = request.body.password;

        var descriptor = {
            "user": {
                "type": "object",
                "required": true,
                "fields": {
                    "email": {
                        "type": "email",
                        "required": true,
                        "message": "email missing or not valid"
                    },
                    "password": {
                        "required": true,
                        "message": "password missing"
                    }
                }
            }
        };
        var validator = promises.promisifyAll(new schema(descriptor));

        validator.validateAsync({
                "user": user
            })
            .then(function() {
                return usermodel.readAsync(user);
            })
            .then(function(userData) {
                if (userData) {
                    var suppliedpassword = user.password;
                    user = userData;
                    return bcrypt.compare(suppliedpassword, user.password);
                } else {
                    throw new Error("user with email " + user.email + " not resgitered");
                }
            })
            .then(function(validPassword) {
                if(validPassword) {
                    user.secret = uuidv4();
                    return usermodel.addTokenAsync(user);
                } else {
                    throw new Error("incorrect password");
                }
            })
            .then(function() {
                var token = jwt.sign({
                    "id": user.id,
                    "secret": user.secret
                }, configurations.jwt.secret, {
                    "expiresIn": configurations.jwt.expiry
                });
                delete user.password;
                delete user.secret;
                delete user.createdat;
                delete user.modifiedat;
                response.json({
                    "token": token,
                    "user": user
                });
            })
            .catch(function(err) {
                logger.error("Error while login:", err.message);
                response.status(401).json({
                    "message": err.message
                });
            });
    },
};

module.exports = authService;
