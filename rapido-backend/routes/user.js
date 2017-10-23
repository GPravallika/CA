/*
 * Version		: 0.0.1
 * Description	: All routes for "/user"
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

// Unprotected routes.

router.post('/', userService.register);  // create new user
router.get('/verify/:token', userService.verify); // activate via email
router.post('/forgotpassword', userService.forgotpassword); // get password recovery email
router.post('/resetpassword', userService.resetpassword); // reset password via token



// CRUD user
router.get('/:id', authService.authenticate, userService.get);
router.put('/:id', authService.authenticate, userService.update);
router.delete('/:id', authService.authenticate, userService.delete);

// security
router.get('/:id/verifyemail', authService.authenticate, userService.verifyemail); // get email with verification link
router.delete('/:id/token/:secret', authService.authenticate, userService.invalidateTokenForUser);

module.exports = router;
