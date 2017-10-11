exports.user = {
    "insert": "INSERT INTO users(email, password, firstname, lastname, isactive, isverified) VALUES (?, ?, ?, ?, ?, ?) returning id",
    "select": "SELECT * FROM users WHERE email=?",
    "isactive": "SELECT isactive from users WHERE id=?",
    "setactive": "UPDATE users SET isactive=? WHERE id=? returning id",
    "selectById": "SELECT * FROM users WHERE id=?",
    "activate": "UPDATE users SET isverified=? WHERE id=? returning id, firstname, lastname",
    "insertIntoVerify": "INSERT INTO user_verify(userid, verifytoken) VALUES(?, ?)",
    "selectFromVerify": "SELECT userid FROM user_verify WHERE verifytoken=?",
    "selectFromVerifyByUserId": "SELECT verifytoken FROM user_verify WHERE userid=?",
    "deleteFromVerify": "DELETE FROM user_verify WHERE userid=?"
};

exports.project = {
    "getUserProjects": "SELECT id, name, description, createdat, modifiedat FROM projects WHERE userid=?",
    "insert": "INSERT INTO projects(name, description, userid, createdby, vocabulary, treedata, apidetails) VALUES(?, ?, ?, ?, ?, ?, ?) returning id",
    "selectById": "SELECT id, name, description, treedata, vocabulary, apidetails FROM projects WHERE id=?",
    "delete": "DELETE from projects WHERE id=?"
};
