const mysql = require("mysql");
const bcrypt = require("bcrypt");
const { queryUserCredentialInsert, queryUserDataInsert, queryUserWeightInsert, queryGoalInsert } = require("./queries/query-insert");
const { insertIntoTable, checkUserPresence } = require("./helper-functions");

const saltRounds = 4;

// Creates a connection with the database
function getConnection(params) {
  return mysql.createConnection(params);
}

// Inserts user credentials into the database to be called by register
function insertUserCredentials(connection, { u_uname, u_passw }, userPresent, successfulInsertion) {
  checkUserPresence(
    connection,
    u_uname,
    _res => {
      userPresent();
    },
    () => {
      bcrypt.hash(u_passw, saltRounds, (error, hash) => {
        if (error) {
          console.error(error);
        } else {
          const userCredential = { u_uname, u_passw: hash };
          insertIntoTable(connection, queryUserCredentialInsert, userCredential, successfulInsertion);
        }
      });
    }
  );
}

// Registers the user.
function registerUser(connection, data, userPresent, successfulRegistration) {
  insertUserCredentials(connection, data, userPresent, () => {
    insertIntoTable(connection, queryUserDataInsert, data, () => {
      insertIntoTable(connection, queryUserWeightInsert, data, successfulRegistration);
    });
  });
}

// Inserts a goal into the goal table
function insertGoal(connection, goal, successfulInsertion) {
  insertIntoTable(connection, queryGoalInsert, goal, successfulInsertion);
}

// Insert a weight value into the user_weight table
function insertWeight(connection, weight, successfulInsertion) {
  insertIntoTable(connection, queryUserWeightInsert, weight, successfulInsertion);
}

module.exports = {
  getConnection,
  registerUser,
  insertGoal,
  insertWeight
};
