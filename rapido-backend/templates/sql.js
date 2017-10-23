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
    "insertIntoTokens": "INSERT INTO tokens(userid,secret) values (?, ?);",
    "deleteFromTokens": "DELETE FROM tokens where userid=? AND secret=?",
    "deleteAllSecretsByUserId": "DELETE FROM tokens where userid=?"
};

exports.project = {
    "getUserProjects": "SELECT id, name, description, createdat, modifiedat FROM projects WHERE userid=?",
    "insert": "INSERT INTO projects(name, description, userid, createdby, vocabulary, treedata, apidetails) VALUES(?, ?, ?, ?, ?, ?, ?) returning id",
    "selectById": "SELECT id, name, description, treedata, vocabulary, apidetails FROM projects WHERE id=?",
    "delete": "DELETE from projects WHERE id=?"
};
