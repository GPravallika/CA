/*
 * Version		: 0.0.1
 * Description	: Authentication service for github using passport js
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
    passportGitHub = require("passport-github2"),
    opts = {};

opts.clientID = configurations.github.clientID;
opts.clientSecret = configurations.github.clientSecret;
opts.callbackURL = "http://34.214.211.27:9001/api/login/github/callback";
opts.scope = [ 'user:email' ];

passport.use(new passportGitHub.Strategy(opts, function(accessToken, refreshToken, profile, callback) {
    callback(null, profile.emails);
}));

var authService = {
    'initialize': passport.initialize(),
    'authenticate': function(request,response,next) {
        passport.authenticate("github", {
            'scope': [ 'user:email' ],
            "session": false
        }, function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user || !Array.isArray(user)) {
                return response.status(401).json({"error":"Either email not available or not authorized"});
            }
            request.user = {'email': user[0].value};
            logger.debug("Github user authenticated, passing to next handler.")
            next();
        })(request, response, next);
    }
};

module.exports = authService;
