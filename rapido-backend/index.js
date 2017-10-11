/*
 * Name			: index.js
 * Author		: Partha Mallik (parthapratim.mallik@ca.com)
 * Version		: 0.0.1
 * Description	: The http server to handle incoming requests
 *
 */

"use strict";
/*
 * declare import functions for easy require inside the applications.
 */
global.import_services = function(name) {
    return require(__dirname + '/services/' + name)
}

global.import_templates = function(name) {
    return require(__dirname + '/templates/' + name)
}

global.import_utils = function(name) {
    return require(__dirname + '/utils/' + name)
}

/*
 * Other global declarations
 */

global.configurations = import_utils('configLoader.js')();

/*
 * Load the configurations and other
 * modules needed for setting up the express server
 */

var logger = import_utils('logger.js').getLoggerObject(),
    express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    debounce = require('connect-debounce'),
    timeout = require('connect-timeout'),
    apiServer = express(),
    mailer = require('express-mailer'),
    fs = require('fs');

var routes = __dirname + "/routes";

mailer.extend(apiServer, configurations.email);
apiServer.set('view engine', 'ejs');

apiServer
    .use(debounce()) // To prevent DOS and DDOS attacks
    .use(cors()) // Enable CORS
    .use(timeout(10000)) // Do't want server to take more than 10 seconds to respond
    .use(bodyParser.json()) // Accepts json body max to 100 kb default
    .use(bodyParser.text()) // Accepts text body max to 100 kb default
    .use(bodyParser.urlencoded({
        'extended': true
    })); // Parse urlencoded body with qs library

/*
 * Load all the routes
 * Keeping it sync to ensure all routes are loaded before the server starts listening.
 */

apiServer.use(function(req, res, next) {
    if(req.originalUrl == "/echo") {
        res.status(200).send();
    } else {
        logger.debug('\n**************** Incoming Http request ****************',
            '\nRequest method:', req.method,
            '\nRequest path:', req.originalUrl,
            '\nRequest params:', req.params,
            '\nRequest query:', req.query,
            '\nRequest body:', req.body,
            '\n*******************************************************');
        next();
    }
})

fs.readdirSync(routes).forEach(file => {
    var routeName = "/" + file.substr(0, file.length - 3),
        router = routes + "/" + file;
    logger.debug('Loading router router/' + file, 'for route', routeName);
    apiServer.use(routeName, require(router));
});

// apiServer.use("/user", route_user);
// apiServer.use("/users", route_users);

apiServer.listen(configurations['port'], function() {
    logger.info('Server started in', configurations['env'], 'mode.');
    logger.info('Listening on ', configurations['port']);
});
