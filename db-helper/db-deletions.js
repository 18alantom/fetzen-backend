const bcrypt = require("bcrypt");
const { deleteFromTable, checkUserPresence } = require("./helper-functions");
const { queryUserDelete, queryGoalDelete, queryWorkoutDelete, queryExerciseDelete } = require("./queries/query-delete");

function deleteUser(connection, user, successfulDeletion, invalidPassword) {
  checkUserPresence(
    connection,
    user.u_uname,
    result => {
      const { u_passw } = result[0];
      bcrypt.compare(user.u_passw, u_passw.toString(), (error, same) => {
        if (error) {
          console.error(error);
        } else if (same) {
          deleteFromTable(connection, queryUserDelete, user, successfulDeletion);
        } else {
          invalidPassword();
        }
      });
    },
    () => {
      console.log(`something went wrong in the deletion of ${user.u_uname}`);
    }
  );
}

function deleteGoal(connection, goal, successfulDeletion) {
  deleteFromTable(connection, queryGoalDelete, goal, successfulDeletion);
}

function deleteWorkout(connection, workout, successfulDeletion) {
  deleteFromTable(connection, queryWorkoutDelete, workout, successfulDeletion);
}

function deleteExercise(connection, exercise, successfulDeletion) {
  deleteFromTable(connection, queryExerciseDelete, exercise, successfulDeletion);
}

module.exports = {
  deleteUser,
  deleteGoal,
  deleteWorkout,
  deleteExercise
};
