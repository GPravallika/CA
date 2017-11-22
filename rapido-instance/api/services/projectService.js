/*
 * Version		: 0.0.1
 * Description	: Management of all project related APIs
 *
 */

"use strict";

var logger = import_utils('logger.js').getLoggerObject(),
    schema = require('async-validator'),
    _ = require("lodash"),
    bcrypt = require('bcrypt'),
    model = require(__dirname + "/models/project.js"),
    auth = require(__dirname + "/models/authorize.js"),
    promises = require('bluebird'),
    exportJson = import_utils('exportLoader.js');

var projectService = {
    'create': function(request, response, next) {
        var project = {};
        project.name = request.body.name;
        project.description = request.body.description || '';
        project.createdby = request.user.id;
        project.treedata = request.body.treedata || {};
        project.vocabulary = request.body.vocabulary || [];
        project.apidetails = request.body.apidetails || {};

        var descriptor = {
            "project": {
                "type": "object",
                "required": true,
                "fields": {
                    "name": {
                        "required": true,
                        "message": "project requires a name"
                    },
                    "treedata": {
                        "type": "object",
                        "message": "treedata should be an object"
                    },
                    "vocabulary": {
                        "type": "array",
                        "message": "vocabulary should be an array"
                    },
                    "apidetails": {
                        "type": "object",
                        "message": "apidetails should be an object"
                    },
                }
            }
        };
        var validator = promises.promisifyAll(new schema(descriptor));

        validator.validateAsync({
                "project": project
            })
            .then(function() {
                return auth.myProjectsAsync(project.createdby);
            })
            .then(function(results) {
                _.each(results, function(result, index) {
                    if (result.name == project.name) {
                        throw new Error("project " + project.name + " already exists for user " + project.createdby);
                    }
                });

                project.treedata = JSON.stringify(project.treedata);
                project.vocabulary = JSON.stringify(project.vocabulary);
                project.apidetails = JSON.stringify(project.apidetails);

                return model.createAsync(project);
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
                        "message": "Can not create project"
                    }
                }
                response.status(httpCode).json(err);
            });

    },
    'fetch': function(request, response, next) {
        var allProjects = [],
            promiseResolutions = [];

        promiseResolutions.push(auth.myProjectsAsync(request.user.id));
        promiseResolutions.push(auth.projectsIcanEditAsync(request.user.id));
        promiseResolutions.push(auth.projectsIcanViewAsync(request.user.id));

        promises.all(promiseResolutions)
            .then(function(results) {
                _.each(results[0], function(project, index) {
                    project.ownership = 'OWN';
                    allProjects.push(project);
                });
                _.each(results[1], function(project, index) {
                    project.ownership = 'WRITE';
                    allProjects.push(project);
                });
                _.each(results[2], function(project, index) {
                    project.ownership = 'VIEW';
                    allProjects.push(project);
                });
                response.status(200).json(allProjects);
            })
            .catch(function(err) {
                logger.error(err);
                response.status(500).json({
                    "code": err.code,
                    "message": "Can not fetch projects for user " + request.user.id
                });
            });
    },
    'get': function(request, response, next) {

        var allProjectIds = [],
            promiseResolutions = [];

        promiseResolutions.push(auth.myProjectsAsync(request.user.id));
        promiseResolutions.push(auth.projectsIcanEditAsync(request.user.id));
        promiseResolutions.push(auth.projectsIcanViewAsync(request.user.id));

        promises.all(promiseResolutions)
            .then(function(results) {
                _.each(results[0], function(project, index) {
                    allProjectIds.push(project.id.toString());
                });
                _.each(results[1], function(project, index) {
                    allProjectIds.push(project.id.toString());
                });
                _.each(results[2], function(project, index) {
                    allProjectIds.push(project.id.toString());
                });

                if(_.indexOf(allProjectIds, request.params.id) < 0 ) {
                    throw new Error("User " + request.user.id + " does not have access to project" + request.params.id);
                } else {
                    return model.readAsync(request.params.id);
                }
            })
            .then(function(data) {
                response.status(200).json(data);
            })
            .catch(function(err) {
                logger.error(err);
                response.status(500).json({
                    "code": err.code,
                    "message": "Can not retrieve prject with id " + request.params.id
                });
            });

    },
    'update': function(request, response, next) {
        var project = {};
        project.id = request.params.id;

        if (request.body.name) project.name = request.body.name;
        if (request.body.description) project.description = request.body.description;
        project.modifiedby = request.user.id;
        project.modifiedat = "now()"; // database current time

        if (request.body.treedata) project.treedata = request.body.treedata;
        if (request.body.vocabulary) project.vocabulary = request.body.vocabulary;
        if (request.body.apidetails) project.apidetails = request.body.apidetails;

        var descriptor = {
            "project": {
                "type": "object",
                "required": true,
                "fields": {
                    "treedata": {
                        "type": "object",
                        "message": "treedata should be an object"
                    },
                    "vocabulary": {
                        "type": "array",
                        "message": "vocabulary should be an array"
                    },
                    "apidetails": {
                        "type": "object",
                        "message": "apidetails should be an object"
                    },
                }
            }
        };
        var validator = promises.promisifyAll(new schema(descriptor)),
            allProjectIds = [],
            promiseResolutions = [];

        validator.validateAsync({
                "project": project
            })
            .then(function() {

                promiseResolutions.push(auth.myProjectsAsync(request.user.id));
                promiseResolutions.push(auth.projectsIcanEditAsync(request.user.id));

                return promises.all(promiseResolutions);
            })
            .then(function(results) {

                _.each(results[0], function(result, index) {
                    if (result.name == project.name && project.id != result.id) {
                        throw new Error("project " + project.name + " already exists for different project id " + result.id);
                    }
                    allProjectIds.push(result.id.toString());
                });
                _.each(results[1], function(result, index) {
                    allProjectIds.push(result.id.toString());
                });

                if(_.indexOf(allProjectIds, request.params.id) < 0 ) {
                    throw new Error("user " + request.user.id + " does not have permission to update project " + project.id);
                } else {
                    project.treedata = JSON.stringify(project.treedata);
                    project.vocabulary = JSON.stringify(project.vocabulary);
                    project.apidetails = JSON.stringify(project.apidetails);

                    return model.updateAsync(project);
                }
            })
            .then(function(data) {
                response.status(200).json({
                    "id": project.id
                });
            })
            .catch(function(err) {
                logger.error(err);
                var httpCode = 400;
                if (err instanceof Error) { // 400 for validation error;
                    httpCode = 500;
                    err = {
                        "code": err.code,
                        "message": "Can not update project with id " + project.id
                    }
                }
                response.status(httpCode).json(err);
            });
    },
    'delete': function(request, response, next) {

        var allProjectIds = [],
            promiseResolutions = [];

        promiseResolutions.push(auth.myProjectsAsync(request.user.id));
        promiseResolutions.push(auth.projectsIcanEditAsync(request.user.id));

        promises.all(promiseResolutions)
        .then(function(results) {

            _.each(results[0], function(result, index) {
                allProjectIds.push(result.id.toString());
            });
            _.each(results[1], function(result, index) {
                allProjectIds.push(result.id.toString());
            });

            if(_.indexOf(allProjectIds, request.params.id) < 0 ) {
                throw new Error("user " + request.user.id + " does not have permission to delete " + request.params.id);
            } else {
                return model.deleteAsync(request.params.id);
            }
        })
        .then(function(data) {
            response.status(200).json({
                'id': request.params.id
            });
        })
        .catch(function(err) {
            logger.error(err);
            response.status(500).json({
                "code": err.code,
                "message": "Can not delete project with id " + request.params.id
            });
        });

    },
    'addTeam': function(request, response, next) {

        var allProjectIds = [],
            promiseResolutions = [];

        promiseResolutions.push(auth.myProjectsAsync(request.user.id));
        promiseResolutions.push(auth.projectsIcanEditAsync(request.user.id));

        promises.all(promiseResolutions)
        .then(function(results) {

            _.each(results[0], function(result, index) {
                allProjectIds.push(result.id.toString());
            });
            _.each(results[1], function(result, index) {
                allProjectIds.push(result.id.toString());
            });

            if(_.indexOf(allProjectIds, request.params.id) < 0 ) {
                throw new Error("user " + request.user.id + " does not have permission to share " + request.params.id);
            } else {

                var team = {
                    "id": request.body.id,
                    "access": request.body.access
                };
                return model.addTeamAsync(request.params.id, team);
            }
        })
        .then(function(data) {
            response.status(200).json({"id": request.params.id});
        })
        .catch(function(err) {
            logger.error(err);
            response.status(500).json({
                "code": err.code,
                "message": "Can not share project " + request.params.id
            });
        });
    },

    'updateTeam': function(request, response, next) {

        var allProjectIds = [],
            promiseResolutions = [];

        promiseResolutions.push(auth.myProjectsAsync(request.user.id));
        promiseResolutions.push(auth.projectsIcanEditAsync(request.user.id));

        promises.all(promiseResolutions)
        .then(function(results) {

            _.each(results[0], function(result, index) {
                allProjectIds.push(result.id.toString());
            });
            _.each(results[1], function(result, index) {
                allProjectIds.push(result.id.toString());
            });

            if(_.indexOf(allProjectIds, request.params.projectid) < 0 ) {
                throw new Error("user " + request.user.id + " does not have permission to share project " + request.params.projectid);
            } else {

                var team = {
                    "id": request.params.teamid,
                    "access": request.body.access
                };
                return model.updateTeamAsync(request.params.projectid, team);
            }
        })
        .then(function(data) {
            response.status(200).json({"id": request.params.projectid});
        })
        .catch(function(err) {
            logger.error(err);
            response.status(500).json({
                "code": err.code,
                "message": "Can not update the project share details"
            });
        });

    },
    'removeTeam': function(request, response, next) {

        var allProjectIds = [],
            promiseResolutions = [];

        promiseResolutions.push(auth.myProjectsAsync(request.user.id));
        promiseResolutions.push(auth.projectsIcanEditAsync(request.user.id));

        promises.all(promiseResolutions)
        .then(function(results) {

            _.each(results[0], function(result, index) {
                allProjectIds.push(result.id.toString());
            });
            _.each(results[1], function(result, index) {
                allProjectIds.push(result.id.toString());
            });

            if(_.indexOf(allProjectIds, request.params.id) < 0 ) {
                throw new Error("user " + request.user.id + " does not have permission to share " + project.id);
            } else {

                var team = {
                    "id": request.params.teamid,
                    "access": request.body.access
                };
                return model.removeteamAsync(request.params.projectid, request.params.teamid);
            }
        })
        .then(function(data) {
            response.status(200).json({"id": request.params.projectid});
        })
        .catch(function(err) {
            logger.error(err);
            response.status(500).json({
                "code": err.code,
                "message": "Can not remove team " + request.params.teamid + " from the project " + request.params.projectid
            });
        });

    },

    'export': function(request, response, next) {

        if (request.query.type && request.query.type == 'swagger') {
            var project = {};
            var resObj = [];
            project.id = request.params.id;

            model.readAsync(project.id)
                .then(function(project){
                    var apiData = project.apidetails;
                    var swaggerObj = new exportJson();
                    var resultData = swaggerObj.createSwagger(apiData, request.protocol, request.get('host'));
                    if (request.query.download == 'true') {
                        var fileName = project.name + "-swagger.json";
                        response.setHeader('Content-disposition', 'attachment; filename=' + fileName);
                        response.setHeader('Content-type', 'application/json');
                        response.write(JSON.stringify(resultData), function(err) {
                            response.status(200).end();
                        });
                    } else {
                        response.status(200).json(resultData);
                    }
                })
                .catch((err) => {
                    logger.error(err);
                    response.status(500).json({
                        "code": err.code,
                        "message": "Can not export sketch"
                    });
                });

        } else if (request.query.type && request.query.type == 'postman') {

            var project = {};
        	project.id = request.params.id;

            model.readAsync(project.id)
                .then(function(project){
                    var apiData = project.apidetails;
            		var swaggerObj=new exportJson();
            		var baseUrl = request.protocol + '://' + request.get('host');
            		var postmanSpec = swaggerObj.createPostmanCollection(apiData, baseUrl);

            		if (request.query.download == 'true') {
            			var fileName=project.name+"-postman.json";
            			response.setHeader('Content-disposition', 'attachment; filename='+fileName);
            			response.setHeader('Content-type', 'application/json');
            			response.write(JSON.stringify(postmanSpec), function (err) {
            				response.status(200).end();
            			});
            		} else {
            			response.status(200).json(postmanSpec);
            		}
                })
                .catch((err) => {
                    logger.error(err);
                    response.status(500).json({
                        "code": err.code,
                        "message": "Can not export sketch"
                    });
                });
        } else {
            response.status(400).json({
                "message": "export type not specified"
            });
        }
    }
};

module.exports = projectService;