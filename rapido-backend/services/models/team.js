/*
 * Version		: 0.0.1
 * Description	: Model for team management
 *
 */

"use strict";

var logger = import_utils('logger.js').getLoggerObject(),
    promises = require('bluebird'),
    db = promises.promisifyAll(import_utils('db.js')()),
    queries = import_templates("sql.js")['team'];


var model = {
    'create': function(team, callback) {
        db.executeAsync(queries.insert, [
                team.name,
                team.description,
                team.createdby,
                team.capacity
            ])
            .then(function(data) {
                if (data.rows && data.rows.length > 0) {
                    team.id = data.rows[0].id;
                    logger.debug("team created with Id", data.rows[0].id);
                    return db.executeAsync(queries.addMember, [team.createdby, team.id, 'OWNER']);
                } else {
                    callback(new Error("Could not create team with name" + team.name));
                    return;
                }
            })
            .then(function(){
                logger.debug("user", team.createdby ,"added to team", team.name, "as admin");
                callback(null, team);
            })
            .catch(function(err) {
                logger.error("Error creating team", err.message);
                callback(err);
            });
    },
    'readByUser': function(team, callback) {
        db.executeAsync(queries.getUserTeams, [team.createdby])
        .then(function(data) {
            logger.debug("Teams for user with id", team.createdby, "retrived.");
            return callback(null, data.rows);
        })
        .catch(function(err) {
            logger.error("Error retrieving teams for user with id ", team.createdby, err.message);
            callback(err);
        });
    },

    'readById': (team, callback) => {
        db.executeAsync(queries.selectById, [team.id])
            .then(function(data) {
                logger.debug("Team with id", team.id, "retrived.");
                return callback(null, data.rows[0]);
            })
            .catch(function(err) {
                logger.error("Error retrieving team with id ", team.id, err.message);
                callback(err);
            });
    },
    'addMember': function(team, user, callback) {
        db.executeAsync(queries.addMember, [user.id, team.id, user.access || 'MEMBER'])
            .then(function(data) {
                logger.debug("User", user.id, "added to team", team.id);
                return callback(null, true);
            })
            .catch(function(err) {
                logger.error("Error adding user to team", team.id, err.message);
                callback(err);
            });
    },
    'updateMember': function(team, user, callback) {
        db.executeAsync(queries.updateMember, [user.access  || 'MEMBER' , team.id, user.id])
            .then(function(data) {
                logger.debug("User role for", user.id, "updated to team", team.id);
                return callback(null, true);
            })
            .catch(function(err) {
                logger.error("Error updating user  role for team", team.id, err.message);
                callback(err);
            });
    },
    'removeMember': function(team, user, callback) {
        db.executeAsync(queries.removeMember, [team.id, user.id])
            .then(function(data) {
                logger.debug("User ", user.id, "removed from team", team.id);
                return callback(null, true);
            })
            .catch(function(err) {
                logger.error("Error removing user for team", team.id, err.message);
                callback(err);
            });
    },
    'update': function(team, callback) {
        var teamid = team.id;
        delete team.id;

        db.connection()('teams')
            .where('id', '=', teamid)
            .update(team)
            .returning('id')
            .then(function(data) {
                if (data) {
                    logger.debug("team updated with id", teamid);
                    team.id = teamid;
                    callback(null, team);
                } else {
                    callback(new Error("Could not update team with id" + teamid));
                }
                return;
            })
            .catch(function(err) {
                logger.error("Error updating team", err.message);
                callback(err);
            });
    }
};

module.exports = promises.promisifyAll(model);
