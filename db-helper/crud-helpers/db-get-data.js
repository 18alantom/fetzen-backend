const { getFromTable } = require("./helper-functions");
const { queryGetUserData, queryGetUserWeightLatest } = require("../queries/query-get-data");

function getUserData(connection, user, onGetUserData, zeroResultHandler) {
  getFromTable(connection, queryGetUserData, user, onGetUserData, zeroResultHandler);
}

function getUserWeight(connection, user, onGetUserWeight, zeroResultHandler) {
  getFromTable(connection, queryGetUserWeightLatest, user, onGetUserWeight, zeroResultHandler);
}

function 

function getUser(connection, userCredentials, onGetUser, zeroResultHandler) {
  const user = {};
  getUserData(
    connection,
    userCredentials,
    userData => {
      Object.assign(user, userData[0]);
      getUserWeight(
        connection,
        { u_id: user.id },
        userWeight => {
          Object.assign(user, userWeight[0]);

        },
        () => {
          // TODO: No weight found
          console.log("no weights found");
        }
      );
    },
    zeroResultHandler
  );
}

module.exports = { getUser };
