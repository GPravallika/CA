/*
 * Version		: 0.0.1
 * Description	: All routes for "/project"
 *
 */

"use strict";

var logger = import_utils('logger.js').getLoggerObject(),
    projectService = import_services('projectService.js'),
    authenticator = import_services('authenticator.js'),
    express = require('express'),
    router = express.Router();
/*
 * Middleware that is specific to this router
 * Perform authentication etc here.
 */
router.use(authenticator.initialize());
router.post('/', authenticator.authenticate, projectService.create);
router.get('/', authenticator.authenticate, projectService.fetch);   // Get all matching projects from filters
router.get('/:id', authenticator.authenticate, projectService.get);  // Get all detaild of project by Id
router.put('/:id', authenticator.authenticate, projectService.update);
router.delete('/:id', authenticator.authenticate, projectService.delete);

// Share with team functionality
router.post('/:id/team', authenticator.authenticate, projectService.addTeam);
router.put('/:projectid/team/:teamid', authenticator.authenticate, projectService.updateTeam);
router.delete('/:projectid/team/:teamid', authenticator.authenticate, projectService.removeTeam);

// Export functionality
router.get('/:id/export', authenticator.authenticate, projectService.export);

module.exports = router;