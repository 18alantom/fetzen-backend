const { getFromTable } = require("./helper-functions");
const { getGoalArray, getWorkoutArray, addExerciseToWorkoutObject } = require("./response-creation-helpers");
const { queryGetUserData, queryGetGoal, queryGetWorkoutId, queryGetWorkout, queryGetExercise, queryGetExerciseIds } = require("../queries/query-get-data");

function getUserData(connection, user, onGetUserData, zeroResultHandler) {
  getFromTable(connection, queryGetUserData, user, onGetUserData, zeroResultHandler);
}

function getGoals(connection, user, onGetGoals, zeroResultHandler) {
  getFromTable(connection, queryGetGoal, user, onGetGoals, zeroResultHandler);
}

function getWorkout(connection, user, onGetWorkout, zeroResultHandler) {
  getFromTable(
    connection,
    queryGetWorkoutId,
    user,
    w_ids => {
      getFromTable(
        connection,
        queryGetWorkout,
        w_ids,
        workoutRes => {
          const workouts = getWorkoutArray(workoutRes);
          getFromTable(
            connection,
            queryGetExerciseIds,
            w_ids,
            e_ids => {
              getFromTable(
                connection,
                queryGetExercise,
                e_ids,
                exerciseRes => {
                  addExerciseToWorkoutObject(workouts, exerciseRes);
                  console.log(workouts);
                  getFromTable(
                    connection,
                    queryGetCycle,
                    cycleRes,
                    () => {},
                    () => {
                      // TODO: Handle no cycles returned.
                    }
                  );
                },
                () => {
                  // TODO: Handle no exercises returned.
                }
              );
            },
            () => {
              // TODO: Handle no exercise ids returned.
            }
          );
        },
        () => {
          // TODO: Handle no workouts returned.
        }
      );
    },
    () => {
      // TODO: Handle no workout ids returned.
    }
  );
}

function getExercise(connection, workout, onGetExercise, zeroResultHandler) {
  getFromTable(connection, queryGetExercise, workout, onGetExercise, zeroResultHandler);
}

function getUser(connection, userCredentials, onGetUser, zeroResultHandler) {
  const user = {};
  const searchObj = {};
  getUserData(connection, userCredentials, userData => {
    Object.assign(user, userData[0]);
    searchObj.u_id = user.id;
    getGoals(
      connection,
      searchObj,
      goals => {
        user.goals = getGoalArray(goals);
        getWorkout(
          connection,
          searchObj,
          workouts => {
            // TODO: Handle response
          },
          () => {
            // TODO: No Workouts
          }
        );
      },
      () => {
        // TODO: No goal found
        console.log("no goals found");
      }
    );
    zeroResultHandler;
  });
}

module.exports = { getUser };
