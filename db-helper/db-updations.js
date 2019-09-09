const { checkWorkoutSnapPresence, checkExerciseSnapPresence, checkCycleSnapPresence, insertIntoTable, updateTable } = require("./helper-functions");
const { queryGoalUpdate, queryExerciseUpdate, queryExerciseSnapUpdate, queryCycleSnapUpdate } = require("./queries/query-update");
const { queryWorkoutSnapInsert, queryExerciseSnapInsert, queryCycleSnapInsert } = require("./queries/query-insert");

function updateGoal(connection, goal, successfulUpdation) {
  updateTable(connection, queryGoalUpdate, goal, successfulUpdation);
}

function updateCycleSnap(connection, cycle, successfulUpdation, last, checkPresence) {
  const lastCheckTrigger = () => {
    if (last) {
      successfulUpdation();
    }
  };
  if (checkPresence) {
    checkCycleSnapPresence(
      connection,
      cycle,
      _result => {
        // Update cycle here
        updateTable(connection, queryCycleSnapUpdate, cycle, lastCheckTrigger);
      },
      () => {
        // Create new cycle here
        insertIntoTable(connection, queryCycleSnapInsert, cycle, lastCheckTrigger);
      }
    );
  } else {
    insertIntoTable(connection, queryCycleSnapInsert, cycle, lastCheckTrigger);
  }
}

// Presence is not checked if the snap is sure to not be present.
function updateCycleSnaps(connection, exercise, successfulUpdation, checkPresence = true) {
  let l = exercise.e_cycles.length;
  let last = false;
  for (let c in exercise.e_cycles) {
    const cycle = exercise.e_cycles[c];
    cycle.w_id = exercise.w_id;
    cycle.e_id = exercise.e_id;
    cycle.w_date = exercise.w_date;
    cycle.w_is_creation = exercise.w_is_creation;
    cycle.c_seq = parseInt(c);
    if (parseInt(c) === l - 1) {
      last = true;
    }
    updateCycleSnap(connection, cycle, successfulUpdation, last, checkPresence);
  }
}

function updateExerciseSnap(connection, exercise, successfulUpdation) {
  checkExerciseSnapPresence(
    connection,
    exercise,
    _result => {
      updateTable(connection, queryExerciseSnapUpdate, exercise, () => {
        updateCycleSnaps(connection, exercise, successfulUpdation);
      });
    },
    () => {
      // Create exercise snap here and call updateCycleSnap
      insertIntoTable(connection, queryExerciseSnapInsert, exercise, () => {
        updateCycleSnaps(connection, exercise, successfulUpdation);
      });
    }
  );
}

function updateExercise(connection, exercise, successfulUpdation) {
  if (!exercise.w_date) {
    exercise.w_date = new Date().toISOString().split("T")[0];
  }
  if (!exercise.w_is_creation) {
    exercise.w_is_creation = 0;
  }
  updateTable(connection, queryExerciseUpdate, exercise, () => {
    checkWorkoutSnapPresence(
      connection,
      exercise,
      _result => {
        updateExerciseSnap(connection, exercise, successfulUpdation);
      },
      () => {
        // Create workout snap here and call update exercise snap
        exercise.w_note = "";
        insertIntoTable(connection, queryWorkoutSnapInsert, exercise, () => {
          insertIntoTable(connection, queryExerciseSnapInsert, exercise, () => {
            // Here it doesn't need to check if a cycle snap is present cause it isn't.
            updateCycleSnaps(connection, exercise, successfulUpdation, false);
          });
        });
      }
    );
  });
}

module.exports = {
  updateGoal,
  updateExercise
};
