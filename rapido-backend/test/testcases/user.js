/*
 * Version		: 0.0.1
 * Description	: Test cases for "/user"
 *
 */

"use strict";

var assert = require('chai').assert,
    path = require('path'),
    promises = require('bluebird'),
    httpRequest = promises.promisifyAll(require('../../utils/httpRequest.js')),
    promises = require('bluebird');

describe('User APIs', function() {
    before(function(done) {
        done();
    });

    var seed = [{
        "email": "test1@test1.com",
        "firstname": "Test1",
        "lastname": "Test1",
        "password": "test1"
    }, {
        "email": "test2@test2.com",
        "firstname": "Test2",
        "lastname": "Test2",
        "password": "test2"
    }];

    seed.forEach(function(user) {
        it('Registering user with email ' + user.email, function(done) {

            var options = {
                'host': "127.0.0.1",
                'port': "9001",
                'path': '/user',
                'method': 'POST',
                'data': {}
            };

            options.data = JSON.stringify(user);

            httpRequest.postAsync(options)
                .then(function(response) {
                    done(null);
                })
                .catch(function(err) {
                    done(err);
                });

        });
    });
    after(function(done) {
        done();
    });

});
