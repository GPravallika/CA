/*
 * Name			: models/user.js
 * Author		: Partha Mallik (parthapratim.mallik@ca.com)
 * Version		: 0.0.1
 * Description	: Model for projects management
 *
 */

"use strict";
var logger = import_utils('logger.js').getLoggerObject(),
    promises = require('bluebird'),
    db = promises.promisifyAll(import_utils('db.js')()),
    queries = import_templates("sql.js")['project'];


var model = {
    'create': (project, callback) => {
        db.executeAsync(queries.insert, [
                project.name,
                project.description,
                project.userid,
                project.createdby,
                project.vocabulary,
                project.treedata,
                project.apidetails
            ])
            .then(function(data) {
                if (data.rows && data.rows.length > 0) {
                    project.id = data.rows[0].id;
                    logger.debug("project created with Id", data.rows[0].id);
                    callback(null, project);
                } else {
                    callback(new Error("Could not create project with name" + project.name));
                }
                return;
            })
            .catch(function(err) {
                logger.error("Error creating project", err.message);
                callback(err);
            });
    },
    'readByUser': (project, callback) => {
        db.executeAsync(queries.getUserProjects, [project.userid])
            .then(function(data) {
                logger.debug("Projects for user with id", project.userid, "retrived.");
                return callback(null, data.rows);
            })
            .catch(function(err) {
                logger.error("Error retrieving projects for user with id ", project.userid, err.message);
                callback(err);
            });
    },
    'readById': (project, callback) => {
        db.executeAsync(queries.selectById, [project.id])
            .then(function(data) {
                logger.debug("Projects with id", project.id, "retrived.");
                return callback(null, data.rows[0]);
            })
            .catch(function(err) {
                logger.error("Error retrieving projects with id ", project.id, err.message);
                callback(err);
            });
    },
    'update': (project, callback) => {
        var projectId = project.id;
        delete project.id;

        db.connection()('projects')
            .where('id', '=', projectId)
            .update(project)
            .returning('id')
            .then(function(data) {
                if (data) {
                    logger.debug("project update with Id", projectId);
                    project.id = projectId;
                    callback(null, project);
                } else {
                    callback(new Error("Could not update project with id" + projectId));
                }
                return;
            })
            .catch(function(err) {
                logger.error("Error updating project", err.message);
                callback(err);
            });
    },
    'delete': (project, callback) => {
        db.executeAsync(queries.delete, [project.id])
            .then(function(data) {
                logger.debug("Projects with id", project.id, "deleted.");
                return callback(null, data.rows);
            })
            .catch(function(err) {
                logger.error("Error deleting projects with id ", project.id, err.message);
                callback(err);
            });
    }
};

module.exports = promises.promisifyAll(model);
