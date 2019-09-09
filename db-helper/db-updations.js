const { updateTable } = require("./helper-functions");
const { queryUpdateGoal } = require("./queries/query-update");

function updateGoal(connection, goal, successfulUpdation) {
  updateTable(connection, queryUpdateGoal, goal, successfulUpdation);
}

module.exports = {
  updateGoal
};
