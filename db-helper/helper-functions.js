const { getUser } = require("./queries/query-other");

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

// General function to insert values into a table specified by the queryGetter
function insertIntoTable(connection, queryGetter, dataToInsert, resultHandler) {
  const noResultMessage = `no result\ninsertion: ${JSON.stringify(dataToInsert)}`;
  connection.query(queryGetter(dataToInsert), queryCallbackNonSelect(resultHandler, defaultNoResultHandler(noResultMessage)));
}

function checkUserPresence(connection, username, presentCallback, notPresentCallback) {
  const undefMessage = "check user presence: undefined";
  connection.query(getUser(username), queryCallbackSelect(presentCallback, notPresentCallback, defaultNoResultHandler(undefMessage)));
}

module.exports = {
  insertIntoTable,
  checkUserPresence
};
