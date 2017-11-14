/*
 * Version		: 0.0.1
 * Description	: All routes for "/login"
 *
 */

"use strict";

var logger = import_utils('logger.js').getLoggerObject(),
    localAuth = import_services('localAuthService.js'),
    githubAuth = import_services('githubAuthService.js'),
    express = require('express'),
    router = express.Router();

router.use(githubAuth.initialize);
router.post('/', localAuth.login);

router.get('/github', githubAuth.authenticate);
router.get('/github/callback', githubAuth.authenticate, localAuth.loginWithoutPassword);

module.exports = router;
