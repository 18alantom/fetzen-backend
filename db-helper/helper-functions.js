const { getUser, getWorkoutSnap, getExerciseSnap, getCycleSnap } = require("./queries/query-other");

function defaultNoResultHandler(from) {
  return () => {
    console.log(from);
  };
}

// Returns a function that is to be used for the query callback
function queryCallbackNonSelect(resultHandler, noResultHandler) {
  return (_err, _result, _fields) => {
    if (_err) {
      console.error(_err);
    } else if (_result) {
      resultHandler(_result);
    } else {
      noResultHandler();
    }
  };
}

// Returns a function that is to be used for the select query callback where an array is expected as the result
function queryCallbackSelect(resultHandler, zeroResultHandler, undefResultHandler) {
  return (_err, _result, _fields) => {
    if (_err) {
      console.error(_err);
    } else if (_result.length >= 1) {
      resultHandler(_result);
    } else if (_result.length === 0) {
      zeroResultHandler();
    } else {
      undefResultHandler();
    }
  };
}
// Checks if the user is ther and calls the appropriate functions if they are.
function checkUserPresence(connection, username, presentCallback, notPresentCallback) {
  const undefMessage = "check user presence: undefined";
  connection.query(getUser(username), queryCallbackSelect(presentCallback, notPresentCallback, defaultNoResultHandler(undefMessage)));
}

// Checks if the workout snap of a given id and date are present then calls the appropriate functions
function checkWorkoutSnapPresence(connection, { w_id, w_date, w_is_creation }, presentCallback, notPresentCallback) {
  const undefMessage = "check workout snap presence: undefined";
  connection.query(getWorkoutSnap(w_id, w_date, w_is_creation), queryCallbackSelect(presentCallback, notPresentCallback, defaultNoResultHandler(undefMessage)));
}

// Checks if the exercise  snap of a given id and date are present then calls the appropriate functions
function checkExerciseSnapPresence(connection, { e_id, w_date, w_is_creation }, presentCallback, notPresentCallback) {
  const undefMessage = "check exercise snap presence: undefined";
  connection.query(
    getExerciseSnap(e_id, w_date, w_is_creation),
    queryCallbackSelect(presentCallback, notPresentCallback, defaultNoResultHandler(undefMessage))
  );
}

// Checks if the exercise  snap of a given id and date are present then calls the appropriate functions
function checkCycleSnapPresence(connection, { c_id, w_date, w_is_creation }, presentCallback, notPresentCallback) {
  const undefMessage = "check cycle snap presence: undefined";
  connection.query(getCycleSnap(c_id, w_date, w_is_creation), queryCallbackSelect(presentCallback, notPresentCallback, defaultNoResultHandler(undefMessage)));
}

// General function to insert values into a table specified by the queryGetter.
function insertIntoTable(connection, queryGetter, dataToInsert, resultHandler) {
  const noResultMessage = `no result\ninsertion: ${JSON.stringify(dataToInsert)}`;
  connection.query(queryGetter(dataToInsert), queryCallbackNonSelect(resultHandler, defaultNoResultHandler(noResultMessage)));
}

// General function to delete from table.
function deleteFromTable(connection, queryGetter, deletionData, resultHandler) {
  const noResultMessage = `no result\ndeletion: ${JSON.stringify(deletionData)}`;
  connection.query(queryGetter(deletionData), queryCallbackNonSelect(resultHandler, defaultNoResultHandler(noResultMessage)));
}

// General function to update table values
function updateTable(connection, queryGetter, updationData, resultHandler) {
  const noResultMessage = `no result\nupdation: ${JSON.stringify(updationData)}`;
  connection.query(queryGetter(updationData), queryCallbackNonSelect(resultHandler, defaultNoResultHandler(noResultMessage)));
}

module.exports = {
  insertIntoTable,
  checkUserPresence,
  checkWorkoutSnapPresence,
  checkExerciseSnapPresence,
  checkCycleSnapPresence,
  deleteFromTable,
  updateTable
};
