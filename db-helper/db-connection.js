const mysql = require("mysql");

const saltRounds = 4;

// Creates a connection with the database
function getConnection(params) {
  return mysql.createConnection(params);
}

module.exports = {
  getConnection
};
