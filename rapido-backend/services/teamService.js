/*
 * Version		: 0.0.1
 * Description	: Management of all team related APIs
 *
 */

"use strict";

var logger = import_utils('logger.js').getLoggerObject(),
    schema = require('async-validator'),
    _ = require("lodash"),
    bcrypt = require('bcrypt'),
    model = require(__dirname + "/models/team.js"),
    promises = require('bluebird'),
    exportJson = import_utils('exportLoader.js');

var teamService = {
    'create': function(request, response, next) {
        var team = {};
        team.name = request.body.name;
        team.description = request.body.description || '';
        team.capacity = request.body.capacity || configurations.team.size;
        team.createdby = request.user.id;

        var descriptor = {
            "team": {
                "type": "object",
                "required": true,
                "fields": {
                    "name": {
                        "required": true,
                        "message": "team requires a name"
                    }
                }
            }
        };
        var validator = promises.promisifyAll(new schema(descriptor));

        validator.validateAsync({
                "team": team
            })
            .then(function() {
                return model.readByUserAsync(team);
            })
            .then(function(results) {
                _.each(results, function(result, index) {
                    if (result.name == team.name) {
                        throw new Error("team " + team.name + " already exists for user " + team.createdby);
                    }
                });
                return model.createAsync(team);
            })
            .then(function(data) {
                response.status(200).json({
                    "id": data.id
                });
            })
            .catch(function(err) {
                logger.error(err);
                var httpCode = 400;
                if (err instanceof Error) { // 400 for validation error;
                    httpCode = 500;
                    err = {
                        "code": err.code,
                        "message": err.message
                    }
                }
                response.status(httpCode).json(err);
            });

    },
    'fetch': function(request, response, next) {
        model.readByUserAsync({
                'createdby': request.user.id
            })
            .then(function(data) {
                response.status(200).json(data);
            })
            .catch(function(err) {
                logger.error(err);
                response.status(500).json({
                    "code": err.code,
                    "message": err.message
                });
            });
    },
    'get': function(request, response, next) {
        model.readByIdAsync({
                'id': request.params.id
            })
            .then(function(data) {
                response.status(200).json(data);
            })
            .catch(function(err) {
                logger.error(err);
                response.status(500).json({
                    "code": err.code,
                    "message": err.message
                });
            });

    },
    'update': function(request, response, next) {
        var team = {};
        team.createdby = request.user.id;
        team.id = request.params.id;

        if(request.body.name) {
            team.name = request.body.name;
        }
        if(request.body.description) {
            team.description = request.body.description;
        }
        if(request.body.capacity) {
            team.name = request.body.name;
        }
        if(request.body.capacity) {
            team.capacity = request.body.capacity;
        }

        model.readByUserAsync(team)
        .then(function(results) {
            _.each(results, function(result, index) {
                if (result.name == team.name && team.id != result.id) {
                    throw new Error("team " + team.name + " already exists for different team id " + result.id);
                }
            });

            delete team.createdby;
            return model.updateAsync(team);
        })
        .then(function(data) {
            response.status(200).json({
                "id": data.id
            });
        })
        .catch(function(err) {
            logger.error(err);
            var httpCode = 400;
            if (err instanceof Error) { // 400 for validation error;
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
    'addMember': function(request, response, next) {
        var team = {
            "id": request.params.id
        };
        var member = {
            "id": request.body.id,
            "access": request.body.access
        };
        model.addMemberAsync(team, member)
            .then(function(data) {
                response.status(200).json({"id": request.params.id});
            })
            .catch(function(err) {
                logger.error(err);
                response.status(500).json({
                    "code": err.code,
                    "message": err.message
                });
            });
    },
    'updateMember': function(request, response, next) {
        var team = {
            "id": request.params.teamid
        };
        var member = {
            "id": request.params.userid,
            "access": request.body.access
        };
        model.updateMemberAsync(team, member)
            .then(function(data) {
                response.status(200).json({"id": request.params.id});
            })
            .catch(function(err) {
                logger.error(err);
                response.status(500).json({
                    "code": err.code,
                    "message": err.message
                });
            });
    },
    'removeMember': function(request, response, next) {
        var team = {
            "id": request.params.teamid
        };
        var member = {
            "id": request.params.userid
        };
        model.removeMemberAsync(team, member)
            .then(function(data) {
                response.status(200).json({"id": request.params.id});
            })
            .catch(function(err) {
                logger.error(err);
                response.status(500).json({
                    "code": err.code,
                    "message": err.message
                });
            });
    }
};

module.exports = teamService;
