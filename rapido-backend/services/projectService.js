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
    promises = require('bluebird'),
    exportJson = import_utils('exportLoader.js');

var projectService = {
    'create': function(request, response, next) {
        var project = {};
        project.name = request.body.name;
        project.description = request.body.description || '';
        project.userid = request.user.id;
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

                project.treedata = JSON.stringify(project.treedata);
                project.vocabulary = JSON.stringify(project.vocabulary);
                project.apidetails = JSON.stringify(project.apidetails);

                return model.readByUserAsync(project);
            })
            .then(function(results) {
                _.each(results, function(result, index) {
                    if (result.name == project.name) {
                        throw new Error("project " + project.name + " already exists for user " + project.userid);
                    }
                });
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
                        "message": err.message
                    }
                }
                response.status(httpCode).json(err);
            });

    },
    'fetch': function(request, response, next) {
        model.readByUserAsync({
                'userid': request.user.id
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
        var project = {};
        project.id = request.params.id;
        project.userid = request.user.id;

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
        var validator = promises.promisifyAll(new schema(descriptor));

        validator.validateAsync({
                "project": project
            })
            .then(function() {
                return model.readByUserAsync(project);
            })
            .then(function(results) {
                _.each(results, function(result, index) {
                    if (result.name == project.name && project.id != result.id) {
                        throw new Error("project " + project.name + " already exists for different project id " + result.id);
                    }
                });

                project.treedata = JSON.stringify(project.treedata);
                project.vocabulary = JSON.stringify(project.vocabulary);
                project.apidetails = JSON.stringify(project.apidetails);

                delete project.userid;
                return model.updateAsync(project);
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
                        "message": err.message
                    }
                }
                response.status(httpCode).json(err);
            });
    },
    'delete': function(request, response, next) {
        model.deleteAsync({
                'id': request.params.id
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
                    "message": err.message
                });
            });
    },
    'export': function(request, response, next) {

        if (request.query.type && request.query.type == 'swagger') {
            var project = {};
            var resObj = [];
            project.id = request.params.id;

            model.readByIdAsync({
                    'id': project.id
                })
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
                        "message": err.message
                    });
                });

        } else if (request.query.type && request.query.type == 'postman') {

            var project = {};
        	project.id = request.params.id;

            model.readByIdAsync({
                    'id': project.id
                })
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
                        "message": err.message
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
