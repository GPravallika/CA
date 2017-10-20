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

router.post('/', userService.register);
router.get('/verify/:token', userService.verify);

// CRUD user
router.get('/:id', authService.authenticate, userService.get);
router.put('/:id', authService.authenticate, userService.update);
router.delete('/:id', authService.authenticate, userService.delete);

// Password management
router.post('/forgotpassword', userService.forgotpassword);
router.post('/resetpassword', userService.resetpassword);

// security
router.delete('/:id/token/:secret', authService.authenticate, userService.invalidateToken);

module.exports = router;
