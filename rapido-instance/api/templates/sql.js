exports.user = {
    "insert": "INSERT INTO users(email, password, firstname, lastname, isverified) VALUES (?, ?, ?, ?, ?) returning id",
    "select": "SELECT * FROM users WHERE email=?",
    "getActiveSecrets": "SELECT secret from tokens WHERE userid=?",
    "selectById": "SELECT * FROM users WHERE id=?",
    "setVerified": "UPDATE users SET isverified=? WHERE id=? returning id, firstname, lastname, isverified",
    "insertIntoVerify": "INSERT INTO user_verify(userid, verifytoken) VALUES(?, ?)",
    "selectFromVerify": "SELECT userid FROM user_verify WHERE verifytoken=?",
    "selectFromVerifyByUserId": "SELECT verifytoken FROM user_verify WHERE userid=?",
    "deleteFromVerify": "DELETE FROM user_verify WHERE userid=?",
    "insertIntoTokens": "INSERT INTO tokens(userid,secret) values (?, ?)",
    "deleteFromTokens": "DELETE FROM tokens where userid=? AND secret=?",
    "deleteAllSecretsByUserId": "DELETE FROM tokens where userid=?"
};

exports.project = {
    "insert": "INSERT INTO projects(name, description, createdby, vocabulary, treedata, apidetails) VALUES(?, ?, ?, ?, ?, ?) returning id",
    "select": "SELECT id, name, description, treedata, vocabulary, apidetails FROM projects WHERE id=?",
    "delete": "DELETE from projects WHERE id=?",
    "addTeam": "INSERT INTO team_project (teamid, projectid, access) values (?,?,?)",
    "updateTeam": "UPDATE team_project set access = ? where projectid = ? and teamid = ?",
    "removeTeam": "DELETE FROM team_project where projectid = ? and teamid = ?",
    "removeAllTeams": "DELETE FROM team_project where projectid = ?",
};

exports.team = {
    "insert": "INSERT INTO teams (name,description,createdby,capacity) values(?,?,?,?) returning id",
    "select": "SELECT * FROM teams WHERE id=?",
    "delete": "DELETE from teams WHERE id=?",
    "removeAllProjects" : "DELETE FROM team_project where teamid = ?",
    "addMember": "INSERT INTO user_team (userid, teamid, access) values (?,?,?)",
    "updateMember": "UPDATE user_team set access = ? where teamid = ? and userid = ?",
    "removeMember": "DELETE FROM user_team where teamid = ? and userid = ?",
    "getMembersWithSpecificAcccess": "select U.id, U.email, T.access from users U join user_team T on U.id = T.userid where T.teamid = ? and T.access = ?",
    "getAllMembers": "select U.id, U.email, T.access from users U join user_team T on U.id = T.userid where T.teamid = ?"
};

exports.auth = {
    "myteams": "select id, name, description from teams where createdby=?",
    "teamsImoderate": "select id, name, description from teams where id in (select teamid from user_team where access = 'ADMIN' and userid = ?)",
    "teamsIbelong": "select id, name, description from teams where id in (select teamid from user_team where access = 'MEMBER' and userid = ?)",
    "myProjects": "select id, name, description from projects where createdby=?",
    "projectsIcanEdit": "select id, name, description from projects where id in (select projectid from team_project where access = 'WRITE' and teamid in (select teamid from user_team where userid = ?))",
    "projectsIcanView": "select id, name, description from projects where id in (select projectid from team_project where access = 'READ' and teamid in (select teamid from user_team where userid = ?))"
};
