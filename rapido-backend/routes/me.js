/*
 * Version		: 0.0.1
 * Description	: All routes for "/me"
 *
 */

"use strict";

var logger = import_utils('logger.js').getLoggerObject(),
    userService = import_services('userService.js'),
    authService = import_services('localAuthService.js'),
    express = require('express'),
    router = express.Router();
/*
 * Middleware that is specific to this router
 * Perform authentication etc here.
 */
router.use(authService.initialize());

router.get('/', authService.authenticate, function(request, response, next) {
    request.params.id = request.user.id;
    userService.get(request, response, next);
});

router.put('/', authService.authenticate, function(request, response, next) {
    request.params.id = request.user.id;
    userService.update(request, response, next);
});

router.delete('/', authService.authenticate, function(request, response, next) {
    request.params.id = request.user.id;
    userService.delete(request, response, next);
});

router.get('/verifyemail', authService.authenticate, function(request, response, next) {
    request.params.id = request.user.id;
    userService.verifyemail(request, response, next);
}); // get email with verification link

router.get('/logout', authService.authenticate, function(request, response, next) {
    request.params.id = request.user.id;
    request.params.secret = request.user.secret;
    if (request.query.all) {
        userService.invalidateAllTokenForUser(request, response, next);
    } else {
        userService.invalidateTokenForUser(request, response, next);
    }
});

router.put('/security', authService.authenticate, function(request, response, next) {
    request.params.id = request.user.id;
    userService.updateSecurity(request, response, next);
});

module.exports = router;
