/*
 * Version		: 0.0.1
 * Description	: Load all configurations from environment variables
 *
 */

"use strict";

var promises = require('bluebird');

var _init = function() {
    var configurations = {
        'env' : process.env.ENV_TYPE || 'development',
        'port' : process.env.LISTEN_PORT || 9001,
        'database': {
            'pool': {
                'max': process.env.DB_POOL_MAX || 20,
                'min': process.env.DB_POOL_MIN || 1
            },
            'debug': process.env.DB_DEBUG || true,
            'client': 'pg',
            'connection': {
                'host': process.env.DB_HOST || 'localhost',
                'port': process.env.DB_PORT || '5432',
                'user': process.env.DB_USER || 'rapidoadmin',
                'database': process.env.DB_SCHEMA || 'rapido',
                'password': process.env.DB_PASSWORD || 'rapidopass'
            }
        },
        'logger' : {
            'level': process.env.LOG_LEVEL || 'debug',
            'colorize': true,
            'timestamp': true,
            'prettyPrint': true
        },
        'email': {
            'from': process.env.EMAIL_FROM || 'parthapratim.mallik@ca.com',
            'host': 'smtp.office365.com',
            'secure': true,
            'port': 587,
            'auth': {
                'user': process.env.EMAIL_USER || 'malpa07@ca.com',
                'pass': process.env.EMAIL_PASSWORD || '#Aka5hyapC1'
            },
            'tls': { 'ciphers': 'SSLv3' }
        },
        'jwt': {
            'secret': process.env.JWT_SECRET || 'Rap1d0S@cr@t$!c@ntm@k3',
            'expiry': process.env.JWT_EXPIRY || '24h'
        }
    };
    return configurations;
};

module.exports = _init;
