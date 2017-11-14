/*
 * Version		: 0.0.1
 * Description	: All routes for "/team"
 *
 */

"use strict";

var logger = import_utils('logger.js').getLoggerObject(),
    teamService = import_services('teamService.js'),
    authService = import_services('localAuthService.js'),
    express = require('express'),
    router = express.Router();
/*
 * Middleware that is specific to this router
 * Perform authentication etc here.
 */
router.use(authService.initialize());

router.post('/', authService.authenticate, teamService.create); // Create a team
router.get('/', authService.authenticate, teamService.fetch); // get all relavant teams for current user
router.get('/:id', authService.authenticate, teamService.get); // get all details of a perticular team
router.put('/:id', authService.authenticate, teamService.update); // Update team name, description, capacity
router.delete('/:id', authService.authenticate, teamService.delete); // delete a team

router.post('/:id/member', authService.authenticate, teamService.addMember); // Add an user to a team
router.put('/:teamid/member/:userid', authService.authenticate, teamService.updateMember); // Change team member's permission
router.delete('/:teamid/member/:userid', authService.authenticate, teamService.removeMember); // Remove member from a team

module.exports = router;
