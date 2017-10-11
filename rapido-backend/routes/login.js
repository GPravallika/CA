/*
 * Version		: 0.0.1
 * Description	: All routes for "/login"
 *
 */

"use strict";

var logger = import_utils('logger.js').getLoggerObject(),
    localAuth = import_services('localAuthService.js'),
    express = require('express'),
    router = express.Router();

router.post('/', localAuth.login);

module.exports = router;
