const mysql = require("mysql");
const bcrypt = require("bcrypt");
const { checkUserPresence } = require("./crud-helpers/helper-functions");

// Creates a connection with the database
function getConnection(params) {
  return mysql.createConnection(params);
}

function validateUser(connection, user, onCredentialValidate, onInvalidUserId, onInvalidUserPassword) {
  checkUserPresence(
    connection,
    user.u_uname,
    result => {
      const res_u = result[0];
      bcrypt.compare(user.u_passw, res_u.u_passw.toString(), (error, same) => {
        if (error) {
          console.error(error);
        }
        if (same) {
          onCredentialValidate();
        } else {
          onInvalidUserPassword();
        }
      });
    },
    onInvalidUserId
  );
}

module.exports = {
  getConnection,
  validateUser
};
