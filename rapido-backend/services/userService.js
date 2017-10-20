/*
 * Version		: 0.0.1
 * Description	: Management of all user related APIs
 *
 */

"use strict";

var logger = import_utils('logger.js').getLoggerObject(),
    schema = require('async-validator'),
    uuidv4 = require('uuid/v4'),
    bcrypt = require('bcrypt'),
    model = require(__dirname + "/models/user.js"),
    promises = require('bluebird');

var userService = {
    'register': function(request, response, next) {
        var user = {};
        user.email = request.body.email;
        user.password = request.body.password;
        user.firstname = request.body.firstname;
        user.lastname = request.body.lastname;
        user.isverified = false;

        var descriptor = {
            "user": {
                "type": "object",
                "required": true,
                "fields": {
                    "email": {
                        "type": "email",
                        "required": true,
                        "message" : "email missing or not proper"
                    },
                    "password": {
                        "required": true,
                        "message": "password missing"
                    },
                    "firstname": {
                        "required": true,
                        "message": "firstname required"
                    },
                    "lastname": {
                        "required": true,
                        "message": "lastname required"
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
                    throw new Error(user.email + " already exists");
                }
                return bcrypt.hash(user.password, 5);
            })
            .then(function(hash) {
                user.password = hash;
                return model.createAsync(user);
            })
            .then(function(id) {
                user.id = id;
                user.token = uuidv4();
                return model.createVerifyRecordAsync({
                    "id": user.id,
                    "token": user.token
                });
            })
            .then(function() {
                response.status(200).json({
                    "id": user.id
                });
            })
            .then(function() {
                var verifyURL = request.body.link + user.token,
                    options = {
                        "to": user.email,
                        "subject": "Email Account Verification",
                        "verifyingURL": verifyURL,
                        "name": user.firstname + " " + user.lastname
                    },
                    mailer = promises.promisifyAll(response.mailer);
                mailer.sendAsync("email", options)
                .catch(function (err) {
                    logger.error("Error while sending mail", err);
                    // Dont send response. Its already sent.
                });
            })
            .catch(function(err) {
                logger.error(err);
                var httpCode = 400;
                if(err instanceof Error) { // 400 for validation error;
                    httpCode = 500;
                    err = {
                        "code": err.code,
                        "message": err.message
                    }
                }
                response.status(httpCode).json(err);
            });
    },
    'verify': function(request, response, next) {
        var validator = promises.promisifyAll(new schema({
            "token": {
                "required": true
            }
        }));
        validator.validateAsync({
                "token": request.params.token
            })
            .then(function() {
                return model.verifyAsync({"token": request.params.token});
            })
            .then(function(userData) {
                response.status(200).json({
                    "id": userData.id,
                    "firstname": userData.firstname,
                    "lastname": userData.lastname
                });
            })
            .catch(function(err) {
                logger.error(err);
                var httpCode = 400;
                if(err instanceof Error) { // 400 for validation error;
                    httpCode = 500;
                    err = {
                        "code": err.code,
                        "message": err.message
                    }
                }
                response.status(httpCode).json(err);
            });
    },
    'get': function(request, response, next) {
        model.readByIdAsync({"id": request.params.id})
        .then(function(data) {
            delete data.password;
            response.status(200).json(data);
        })
        .catch(function(err) {
            response.status(500).json({
                "code": err.code,
                "message": err.message
            });
        });
    },
    'update': function(request, response, next) {
        var user = {};
        user.id = request.params.id;
        if(request.body.email) user.email = request.body.email;
        if(request.body.firstname) user.firstname = request.body.firstname;
        if(request.body.lastname) user.lastname = request.body.lastname;

        var descriptor = {
            "user": {
                "type": "object",
                "required": true,
                "fields": {
                    "email": {
                        "type": "email",
                        "message" : "email not valid"
                    }
                }
            }
        };
        var validator = promises.promisifyAll(new schema(descriptor));

        validator.validateAsync({
                "user": user
            })
            .then(function(){
                return model.updateAsync(user);
            })
            .then(function() {
                response.status(200).json({
                    "id": user.id
                });
            })
            .catch(function(err) {
                logger.error(err);
                var httpCode = 400;
                if(err instanceof Error) { // 400 for validation error;
                    httpCode = 500;
                    err = {
                        "code": err.code,
                        "message": err.message
                    }
                }
                response.status(httpCode).json(err);
            });
    },
    'updateSecurity': function(request, response, next) {
        var user = {};
        user.id = request.params.id;
        user["old-password"] = request.body["old-password"];
        user["new-password"] = request.body["new-password"];

        var descriptor = {
            "user": {
                "type": "object",
                "required": true,
                "fields": {
                    "old-password": {
                        "required": true,
                        "message" : "old-password missing"
                    },
                    "new-password": {
                        "required": true,
                        "message" : "new-password missing"
                    }
                }
            }
        };
        var validator = promises.promisifyAll(new schema(descriptor));

        validator.validateAsync({
                "user": user
            })
            .then(function(){
                return model.readByIdAsync({"id": user.id});
            })
            .then(function(userData){
                var promiseResolutions = [];
                promiseResolutions.push(bcrypt.compare(user["old-password"], userData.password));
                promiseResolutions.push(bcrypt.hash(user["new-password"], 5));

                return promises.all(promiseResolutions);
            })
            .then(function(passwordHashes) {
                if(passwordHashes[0]) {
                    user.password = passwordHashes[1];
                    delete user["old-password"];
                    delete user["new-password"];

                    return model.updateAsync(user);
                } else {
                    throw new Error("invalid current password for user " + user.id);
                }
            })
            .then(function() {
                response.status(200).json({
                    "id": user.id
                });
            })
            .catch(function(err) {
                logger.error(err);
                var httpCode = 400;
                if(err instanceof Error) { // 400 for validation error;
                    httpCode = 500;
                    err = {
                        "code": err.code,
                        "message": err.message
                    }
                }
                response.status(httpCode).json(err);
            });
    },
    'delete': function(request, response, next) {

    },
    'forgotpassword': function(request, response, next) {
        var user = {};
        user.email = request.body.email;
        model.readAsync(user)
        .then(function(userData) {
            if (userData) {
                user.id = userData.id;
                user.firstname = userData.firstname;
                user.lastname = userData.lastname;
                user.token = uuidv4();
                return model.createVerifyRecordAsync({
                    "id": user.id,
                    "token": user.token
                });
            } else {
                throw new Error(user.email + " not registered");
            }
        })
        .then(function(token) {
            user.token = token;
            response.status(200).json({
                "id": user.id
            });
        })
        .then(function() {
            var verifyURL = request.body.link + user.token,
                options = {
                    "to": user.email,
                    "subject": "Password Reset Request",
                    "verifyingURL": verifyURL,
                    "name": user.firstname + " " + user.lastname
                },
                mailer = promises.promisifyAll(response.mailer);
            mailer.sendAsync("forgotpassword", options)
            .catch(function (err) {
                logger.error("Error while sending mail", err);
                // Dont send response. Its already sent.
            });
        })
        .catch(function(err) {
            logger.error(err);
            var httpCode = 400;
            if(err instanceof Error) { // 400 for validation error;
                httpCode = 500;
                err = {
                    "code": err.code,
                    "message": err.message
                }
            }
            response.status(httpCode).json(err);
        });
    },
    'invalidateToken': function(request, response, next) {
        var user = {};
        user.id = request.params.id;
        user.secret =request.params.secret;

        model.deleteFromTokensAsync(user)
        .then(function() {
            response.status(200).json({
                "id": user.id
            });
        })
        .catch(function(err) {
            logger.error(err);
            var httpCode = 400;
            if(err instanceof Error) { // 400 for validation error;
                httpCode = 500;
                err = {
                    "code": err.code,
                    "message": err.message
                }
            }
            response.status(httpCode).json(err);
        });
    },
    'resetpassword': function(request, response, next) {

        var user = {};
        user.token = request.body.token;
        user.password = request.body.password;

        model.verifyAsync({"token": user.token})
            .then(function(userData){
                delete user.token;
                user.id = userData.id;
                return bcrypt.hash(user.password, 5);
            })
            .then(function(pwd) {
                user.password = pwd;
                return model.updateAsync(user);
            })
            .then(function() {
                response.status(200).json({
                    "id": user.id
                });
            })
            .catch(function(err) {
                logger.error(err);
                var httpCode = 400;
                if(err instanceof Error) { // 400 for validation error;
                    httpCode = 500;
                    err = {
                        "code": err.code,
                        "message": err.message
                    }
                }
                response.status(httpCode).json(err);
            });
    }
};

module.exports = userService;
