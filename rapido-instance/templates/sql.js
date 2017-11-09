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
    "getUserProjects": "SELECT id, name, description, createdat, modifiedat FROM projects WHERE createdby=?",
    "insert": "INSERT INTO projects(name, description, createdby, vocabulary, treedata, apidetails) VALUES(?, ?, ?, ?, ?, ?) returning id",
    "selectById": "SELECT id, name, description, treedata, vocabulary, apidetails FROM projects WHERE id=?",
    "delete": "DELETE from projects WHERE id=?",
    "addTeam": "INSERT INTO team_project (teamid, projectid, access) values (?,?,?)",
    "updateTeam": "UPDATE team_project set access = ? where projectid = ? and teamid = ?",
    "removeTeam": "DELETE FROM team_project where projectid = ? and teamid = ?"
};

exports.team = {
    "insert": "INSERT INTO teams (name,description,createdby,capacity) values(?,?,?,?) returning id",
    "getUserTeams": "select T1.teamid, T1.access, T2.name, T2.description, T2.createdby from (SELECT teamid,access from user_team where userid=?) T1 join teams T2 on T1.teamid = T2.id",
    "selectById": "SELECT * FROM teams WHERE id=?",
    "delete": "DELETE from projects WHERE id=?",
    "addMember": "INSERT INTO user_team (userid, teamid, access) values (?,?,?)",
    "updateMember": "UPDATE user_team set access = ? where teamid = ? and userid = ?",
    "removeMember": "DELETE FROM user_team where teamid = ? and userid = ?"
};
