const { getFromTable } = require("./helper-functions");
const { getGoalArray } = require("./response-creation-helpers");
const { queryGetUserData, queryGetUserWeightLatest, queryGetGoal } = require("../queries/query-get-data");

function getUserData(connection, user, onGetUserData, zeroResultHandler) {
  getFromTable(connection, queryGetUserData, user, onGetUserData, zeroResultHandler);
}

function getUserWeight(connection, user, onGetUserWeight, zeroResultHandler) {
  getFromTable(connection, queryGetUserWeightLatest, user, onGetUserWeight, zeroResultHandler);
}

function getGoals(connection, user, onGetGoals, zeroResultHandler) {
  getFromTable(connection, queryGetGoal, user, onGetGoals, zeroResultHandler);
}

function getWorkout(connection, user, onGetWorkout, zeroResultHandler) {}

function getUser(connection, userCredentials, onGetUser, zeroResultHandler) {
  const user = {};
  const searchObj = {};
  getUserData(
    connection,
    userCredentials,
    userData => {
      Object.assign(user, userData[0]);
      searchObj.u_id = user.id;
      getUserWeight(
        connection,
        searchObj,
        userWeight => {
          Object.assign(user, userWeight[0]);
          getGoals(
            connection,
            searchObj,
            goals => {
              user.goals = getGoalArray(goals);
              console.log(user);
              onGetUser();
              // TODO: Get the users workouts 
              // Convert days to an array, 
              // Add a workouts object and add to that.
            },
            () => {
              // TODO: No goal found
              console.log("no goals found");
            }
          );
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
