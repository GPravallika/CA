/*
 * Version		: 0.0.1
 * Description	: All routes for "/project"
 *
 */

"use strict";

var logger = import_utils('logger.js').getLoggerObject(),
    projectService = import_services('projectService.js'),
    authService = import_services('localAuthService.js'),
    express = require('express'),
    router = express.Router();
/*
 * Middleware that is specific to this router
 * Perform authentication etc here.
 */
router.use(authService.initialize());
router.post('/', authService.authenticate, projectService.create);
router.get('/', authService.authenticate, projectService.fetch);   // Get all matching projects from filters
router.get('/:id', authService.authenticate, projectService.get);  // Get all detaild of project by Id
router.put('/:id', authService.authenticate, projectService.update);
router.delete('/:id', authService.authenticate, projectService.delete);

// Share with team functionality
router.post('/:id/team', authService.authenticate, projectService.addTeam);
router.put('/:projectid/team/:teamid', authService.authenticate, projectService.updateTeam);
router.delete('/:projectid/team/:teamid', authService.authenticate, projectService.removeTeam);

// Export functionality
router.get('/:id/export', authService.authenticate, projectService.export);

module.exports = router;
