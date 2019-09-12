const { getFromTable } = require("./helper-functions");
const { getGoalArray, getWorkoutArray, addExerciseToWorkoutObject, addCyclesToWorkoutObject } = require("./response-creation-helpers");
const {
  queryGetUserData,
  queryGetGoal,
  queryGetWorkoutId,
  queryGetWorkout,
  queryGetExercise,
  queryGetExerciseIds,
  queryGetCycle
} = require("../queries/query-get-data");

function getUserData(connection, user, onGetUserData, zeroResultHandler) {
  getFromTable(connection, queryGetUserData, user, onGetUserData, zeroResultHandler);
}

function getGoals(connection, user, onGetGoals, zeroResultHandler) {
  getFromTable(connection, queryGetGoal, user, onGetGoals, zeroResultHandler);
}

// Also gets the exercises and the cycles associated with a workout.
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
                  getFromTable(
                    connection,
                    queryGetCycle,
                    exerciseRes,
                    cycleRes => {
                      addCyclesToWorkoutObject(workouts, cycleRes);
                      onGetWorkout(workouts);
                    },
                    () => {
                      // Handle no cycles returned.
                      onGetWorkout(workouts);
                    }
                  );
                },
                () => {
                  // Handle no exercises returned.
                  onGetWorkout(workouts);
                }
              );
            },
            () => {
              // Handle no exercise ids returned.
              onGetWorkout(workouts);
            }
          );
        },
        () => {
          // Handle no workouts returned.
          zeroResultHandler();
        }
      );
    },
    () => {
      // Handle no workout ids returned.
      zeroResultHandler();
    }
  );
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
            user.workouts = workouts;
            onGetUser(user);
          },
          () => {
            // No workouts found
            onGetUser(user);
          }
        );
      },
      () => {
        // No goals found
        getWorkout(
          connection,
          searchObj,
          workouts => {
            user.workouts = workouts;
            onGetUser(user);
          },
          () => {
            // No workouts found
            onGetUser(user);
          }
        );
      }
    );
    zeroResultHandler;
  });
}

module.exports = { getUser };
