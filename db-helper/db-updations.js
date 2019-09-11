const {
  checkWorkoutSnapPresence,
  checkExerciseSnapPresence,
  checkExercisePresence,
  checkCycleSnapPresence,
  checkDoneDatePresence,
  insertIntoTable,
  updateTable
} = require("./helper-functions");
const {
  queryGoalUpdate,
  queryExerciseUpdate,
  queryExerciseSnapUpdate,
  queryCycleSnapUpdate,
  queryWorkoutUpdate,
  queryWorkoutSnapUpdate
} = require("./queries/query-update");
const { queryDoneDateInsert, queryWorkoutSnapInsert, queryExerciseSnapInsert, queryCycleSnapInsert } = require("./queries/query-insert");
const { queryWorkoutDone } = require("./queries/query-done");
const { insertExercise } = require("./db-insertions");
const { deleteExercise } = require("./db-deletions");

function updateGoal(connection, goal, successfulUpdation) {
  updateTable(connection, queryGoalUpdate, goal, successfulUpdation);
}

function updateCycleSnap(connection, cycle, successfulUpdation, lastCycle, checkPresence) {
  const lastCheckTrigger = () => {
    if (lastCycle) {
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
function updateCycleSnaps(connection, exercise, successfulUpdation, lastExercise, checkPresence = true) {
  let l = exercise.e_cycles.length;
  let lastCycle = false;
  for (let c in exercise.e_cycles) {
    const cycle = exercise.e_cycles[c];
    cycle.w_id = exercise.w_id;
    cycle.e_id = exercise.e_id;
    cycle.w_date = exercise.w_date;
    cycle.w_is_creation = exercise.w_is_creation;
    cycle.c_seq = parseInt(c);
    if (parseInt(c) === l - 1) {
      lastCycle = true && lastExercise;
    }
    updateCycleSnap(connection, cycle, successfulUpdation, lastCycle, checkPresence);
  }
}

// Presenece of exercsise snap is not checked if it is sure to not be there.
function updateExerciseSnap(connection, exercise, successfulUpdation, lastExercise, checkPresence) {
  if (checkPresence) {
    checkExerciseSnapPresence(
      connection,
      exercise,
      _result => {
        updateTable(connection, queryExerciseSnapUpdate, exercise, () => {
          updateCycleSnaps(connection, exercise, successfulUpdation, lastExercise);
        });
      },
      () => {
        // Create exercise snap here and call updateCycleSnap
        insertIntoTable(connection, queryExerciseSnapInsert, exercise, () => {
          updateCycleSnaps(connection, exercise, successfulUpdation, lastExercise);
        });
      }
    );
  } else {
    insertIntoTable(connection, queryExerciseSnapInsert, exercise, () => {
      updateCycleSnaps(connection, exercise, successfulUpdation, lastExercise, checkPresence);
    });
  }
}

function updateExercise(connection, exercise, successfulUpdation, lastExercise, checkPresence, cascade = false, onlySnap = false) {
  if (!exercise.w_date) {
    exercise.w_date = new Date().toISOString().split("T")[0];
  }
  if (!exercise.w_is_creation) {
    exercise.w_is_creation = 0;
  }
  const updateSnap = () => {
    if (!cascade) {
      checkWorkoutSnapPresence(
        connection,
        exercise,
        _result => {
          // Needs to check the presence of exercise snap and is the last exercise if not cascade
          updateExerciseSnap(connection, exercise, successfulUpdation, true, true);
        },
        () => {
          // Create workout snap here and call update exercise snap
          exercise.w_note = "";
          insertIntoTable(connection, queryWorkoutSnapInsert, exercise, () => {
            insertIntoTable(connection, queryExerciseSnapInsert, exercise, () => {
              // Here it doesn't need to check if a cycle snap is present cause it isn't.
              updateCycleSnaps(connection, exercise, successfulUpdation, true, false);
            });
          });
        }
      );
    } else {
      updateExerciseSnap(connection, exercise, successfulUpdation, lastExercise, checkPresence);
    }
  };
  if (onlySnap) {
    updateSnap();
  } else {
    updateTable(connection, queryExerciseUpdate, exercise, () => {
      updateSnap();
    });
  }
}

function updateExercises(connection, workout, successfulUpdation, checkPresence = true, onlySnap = false, checkExercise = true) {
  const l = workout.w_exercises.length;
  for (let c in workout.w_exercises) {
    const exercise = workout.w_exercises[c];
    exercise.w_id = workout.w_id;
    exercise.w_date = workout.w_date;
    exercise.w_is_creation = workout.w_is_creation;
    if (checkExercise) {
      checkExercisePresence(
        connection,
        exercise,
        // Last exercise is not stroed in a variable and passed cause
        // the final value was being sent maybe because the queries are asynchronous.
        () => {
          updateExercise(connection, exercise, successfulUpdation, parseInt(c) === l - 1, checkPresence, true, onlySnap);
        },
        () => {
          insertExercise(connection, exercise, () => {
            exercise.w_is_creation = 0;
            updateExercise(connection, exercise, successfulUpdation, parseInt(c) === l - 1, checkPresence, true, onlySnap);
          });
        }
      );
    } else {
      updateExercise(connection, exercise, successfulUpdation, parseInt(c) === l - 1, checkPresence, true, onlySnap);
    }
  }
}

function deleteExercises(connection, workout, successfulDeletion) {
  if (workout.w_exercises_deleted) {
    let l = workout.w_exercises_deleted.length;
    if (l === 0) {
      successfulDeletion();
    } else {
      for (let e in workout.w_exercises_deleted) {
        const e_id = workout.w_exercises_deleted[e];
        deleteExercise(connection, { e_id }, () => {
          if (parseInt(e) === l - 1) {
            successfulDeletion();
          }
        });
      }
    }
  } else {
    successfulDeletion();
  }
}

function updateWorkout(connection, workout, successfulUpdation) {
  if (!workout.w_date) {
    workout.w_date = new Date().toISOString().split("T")[0];
  }
  if (!workout.w_is_creation) {
    workout.w_is_creation = 0;
  }
  updateTable(connection, queryWorkoutUpdate, workout, () => {
    deleteExercises(connection, workout, () => {
      checkWorkoutSnapPresence(
        connection,
        workout,
        _result => {
          updateTable(connectoin, queryWorkoutSnapUpdate, workout, () => {
            updateExercises(connection, workout, successfulUpdation, true);
          });
        },
        () => {
          insertIntoTable(connection, queryWorkoutSnapInsert, workout, () => {
            updateExercises(connection, workout, successfulUpdation, false);
          });
        }
      );
    });
  });
}

function workoutDone(connection, workout, successfulUpdation) {
  if (!workout.w_date) {
    workout.w_date = new Date().toISOString().split("T")[0];
  }
  workout.w_is_creation = 0;
  updateTable(connection, queryWorkoutDone, workout, () => {
    checkWorkoutSnapPresence(
      connection,
      workout,
      () => {
        checkDoneDatePresence(
          connection,
          workout,
          () => {
            updateExercises(connection, workout, successfulUpdation, true, true, false);
          },
          () => {
            insertIntoTable(connection, queryDoneDateInsert, workout, () => {
              updateExercises(connection, workout, successfulUpdation, true, true, false);
            });
          }
        );
      },
      () => {
        insertIntoTable(connection, queryWorkoutSnapInsert, workout, () => {
          insertIntoTable(connection, queryDoneDateInsert, workout, () => {
            updateExercises(connection, workout, successfulUpdation, false, true, false);
          });
        });
      }
    );
  });
}

module.exports = {
  updateGoal,
  updateExercise,
  updateWorkout,
  workoutDone
};
