/*
 * Version		: 0.0.1
 * Description	: Authentication service using passport js
 *
 */

"use strict";

var logger = import_utils('logger.js').getLoggerObject(),
    schema = require('async-validator'),
    bcrypt = require('bcrypt'),
    model = require(__dirname + "/models/user.js"),
    promises = require('bluebird'),
    passport = require("passport"),
    passportJWT = require("passport-jwt"),
    jwt = require("jsonwebtoken"),
    ExtractJwt = passportJWT.ExtractJwt,
    Strategy = passportJWT.Strategy,
    opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = configurations.jwt.secret;

passport.use(new Strategy(opts, function(payload, callback) {
    model.isActiveAsync(payload)
        .then(function(active) {
            if (active) {
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
    'authenticate': function() {
        return passport.authenticate("jwt", {
            "session": false
        });
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
                return model.readAsync(user);
            })
            .then(function(userData) {
                if (userData) {
                    if(userData.isverified) {
                        user.id = userData.id;
                        user.firstname = userData.firstname;
                        user.lastname = userData.lastname;
                        return bcrypt.compare(user.password, userData.password);
                    } else {
                        throw new Error("user with email " +  user.email + " not activated");
                    }

                } else {
                    throw new Error("user with email " + user.email + " not resgitered");
                }
            })
            .then(function(validPassword) {
                if(validPassword) {
                    return model.setActiveAsync(user);
                } else {
                    throw new Error("incorrect password");
                }
            })
            .then(function() {
                var token = jwt.sign({
                    id: user.id
                }, configurations.jwt.secret, {
                    "expiresIn": configurations.jwt.expiry
                });
                delete user.password;
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
