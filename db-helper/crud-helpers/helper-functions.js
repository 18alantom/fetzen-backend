const { getUser, getWorkoutSnap, getExerciseSnap, getCycleSnap, getExercise, getDoneDate } = require("../queries/query-other");

function defaultNoResultHandler(from) {
  return () => {
    console.log(from);
  };
}

// Returns a function that is to be used for the query callback
function queryCallbackNonSelect(resultHandler, noResultHandler) {
  return (err, result, _fields) => {
    if (err) {
      console.error(err);
    } else if (result) {
      resultHandler(result);
    } else {
      noResultHandler();
    }
  };
}

// Returns a function that is to be used for the select query callback where an array is expected as the result
function queryCallbackSelect(resultHandler, zeroResultHandler, undefResultHandler) {
  return (err, result, _fields) => {
    if (err) {
      console.error(err);
    } else if (result.length >= 1) {
      resultHandler(result);
    } else if (result.length === 0) {
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

// Checks if the exercise of a given id is present then calls the appropriate functions
function checkExercisePresence(connection, { e_id }, presentCallback, notPresentCallback) {
  const undefMessage = "check exercise presence: undefined";
  connection.query(getExercise(e_id), queryCallbackSelect(presentCallback, notPresentCallback, defaultNoResultHandler(undefMessage)));
}

// Checks if the exercise  snap of a given id and date are present then calls the appropriate functions
function checkCycleSnapPresence(connection, { c_id, w_date, w_is_creation }, presentCallback, notPresentCallback) {
  const undefMessage = "check cycle snap presence: undefined";
  connection.query(getCycleSnap(c_id, w_date, w_is_creation), queryCallbackSelect(presentCallback, notPresentCallback, defaultNoResultHandler(undefMessage)));
}

// Checks if the done has been clicked for an exercise for the day.
function checkDoneDatePresence(connection, { w_id, w_date }, presentCallback, notPresentCallback) {
  const undefMessage = "check done date presence: undefined";
  connection.query(getDoneDate(w_id, w_date), queryCallbackSelect(presentCallback, notPresentCallback, defaultNoResultHandler(undefMessage)));
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

// General function to get data from a table
function getFromTable(connection, queryGetter, queryData, resultHandler, zeroResultHandler) {
  const noResultMessage = `no result\nget: ${JSON.stringify(queryData)}`;
  connection.query(queryGetter(queryData), queryCallbackSelect(resultHandler, zeroResultHandler, defaultNoResultHandler(noResultMessage)));
}

function noQuote(str) {
  return str.replace("'", "`");
}

module.exports = {
  noQuote,
  insertIntoTable,
  checkUserPresence,
  checkWorkoutSnapPresence,
  checkExerciseSnapPresence,
  checkExercisePresence,
  checkCycleSnapPresence,
  checkDoneDatePresence,
  deleteFromTable,
  updateTable,
  getFromTable
};
