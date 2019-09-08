const bcrypt = require("bcrypt");
const {
  queryUserCredentialInsert,
  queryUserDataInsert,
  queryUserWeightInsert,
  queryGoalInsert,
  queryWorkoutInsert,
  queryWorkoutSnapInsert,
  queryExerciseInsert,
  queryExerciseSnapInsert,
  queryCycleSnapInsert
} = require("./queries/query-insert");
const { insertIntoTable, checkUserPresence, checkWorkoutSnapPresence } = require("./helper-functions");

// Inserts user credentials into the database to be called by register
function insertUserCredentials(connection, { u_uname, u_passw }, userPresent, successfulInsertion) {
  checkUserPresence(
    connection,
    u_uname,
    _res => {
      userPresent();
    },
    () => {
      bcrypt.hash(u_passw, saltRounds=4, (error, hash) => {
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

// Function that inserts exercises
function insertExerciseHelper(connection, exercise, successfulInsertion) {
  const numberOfCycles = exercise.e_cycles.length;
  insertIntoTable(connection, queryExerciseInsert, exercise, () => {
    insertIntoTable(connection, queryExerciseSnapInsert, exercise, () => {
      for (let i in exercise.e_cycles) {
        const cycle = exercise.e_cycles[i];
        cycle.e_id = exercise.e_id;
        cycle.w_id = exercise.w_id;
        cycle.w_date = exercise.w_date;
        cycle.w_is_creation = exercise.w_is_creation;
        insertIntoTable(connection, queryCycleSnapInsert, cycle, () => {
          if (parseInt(i) === numberOfCycles - 1) {
            successfulInsertion();
          }
        });
      }
    });
  });
}

// Inserts a workout into the table along with its exercises and their cycles
function insertWorkout(connection, workout, successfulInsertion) {
  if (!workout.w_date) {
    workout.w_date = new Date().toISOString().split("T")[0];
  }
  if (!workout.w_is_creation) {
    workout.w_is_creation = 0;
  }
  insertIntoTable(connection, queryWorkoutInsert, workout, () => {
    insertIntoTable(connection, queryWorkoutSnapInsert, workout, () => {
      let numberOfExercises = workout.w_exercises.length;
      for (let i in workout.w_exercises) {
        const exercise = workout.w_exercises[i];
        exercise.w_id = workout.w_id;
        exercise.w_date = workout.w_date;
        exercise.w_is_creation = workout.w_is_creation;

        insertIntoTable(connection, queryExerciseInsert, exercise, () => {
          insertIntoTable(connection, queryExerciseSnapInsert, exercise, () => {
            let numberOfCycles = exercise.e_cycles.length;
            for (let j in exercise.e_cycles) {
              const cycle = exercise.e_cycles[j];
              cycle.e_id = exercise.e_id;
              cycle.w_id = exercise.w_id;
              cycle.w_date = exercise.w_date;
              cycle.w_is_creation = exercise.w_is_creation;

              insertIntoTable(connection, queryCycleSnapInsert, cycle, () => {
                if (parseInt(i) === numberOfExercises - 1 && parseInt(j) === numberOfCycles - 1) {
                  successfulInsertion();
                }
              });
            }
          });
        });
      }
    });
  });
}

// Inserts exercise into db checks if a previous snap is present first.
function insertExercise(connection, exercise, successfulInsertion) {
  if (!exercise.w_date) {
    exercise.w_date = new Date().toISOString().split("T")[0];
  }
  if (!exercise.w_is_creation) {
    exercise.w_is_creation = 0;
  }
  checkWorkoutSnapPresence(
    connection,
    exercise,
    _result => {
      insertExerciseHelper(connection, exercise, successfulInsertion);
    },
    () => {
      exercise.w_note = "";
      insertIntoTable(connection, queryWorkoutSnapInsert, exercise, () => {
        insertExerciseHelper(connection, exercise, successfulInsertion);
      });
    }
  );
}

module.exports = {
  registerUser,
  insertGoal,
  insertWeight,
  insertWorkout,
  insertExercise
};