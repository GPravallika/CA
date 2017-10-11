/*
 * Name			: index.js
 * Author		: Partha Mallik (parthapratim.mallik@ca.com)
 * Version		: 0.0.1
 * Description	: The http server to serve the SPA
 *
 */

"use strict";

/*
 * Load the configurations and other
 * modules needed for setting up the express server
 */

var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    debounce = require('connect-debounce'),
    timeout = require('connect-timeout'),
    webServer = express();

webServer
    .use(debounce()) // To prevent DOS and DDOS attacks
    .use(cors()) // Enable CORS
    .use(timeout(10000)) // Do't want server to take more than 10 seconds to respond
    .use(bodyParser.json()) // Accepts json body max to 100 kb default
    .use(bodyParser.text()) // Accepts text body max to 100 kb default
    .use(bodyParser.urlencoded({
        'extended': true
    }))
    //.use(express.static(__dirname + '/build'))
    //.use((req,res) => res.sendFile(__dirname + '/build/index.html'));
    .use((req, res) => {
        var resource = 'index.html';

        if(req.originalUrl.includes('.html') || req.originalUrl.includes('.js')
            || req.originalUrl.includes('.woff2') || req.originalUrl.includes('.ttf')
            || req.originalUrl.includes('.eot') || req.originalUrl.includes('.svg')
        ) {
            resource = req.originalUrl.substring(req.originalUrl.lastIndexOf('/'));
        }
        res.sendFile(__dirname + '/build/' + resource);
     }); // Parse urlencoded body with qs library

webServer.listen(process.env.LISTEN_PORT || 8090, function() {
    console.log('Web server listening on ', process.env.LISTEN_PORT || 8090);
});
