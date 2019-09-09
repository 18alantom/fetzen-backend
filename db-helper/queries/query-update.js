queryUpdateGoal = ({ g_id, g_complete, g_date_completed }) => {
  return `
    update goal
    set g_complete=${g_complete}, g_date_completed='${g_date_completed}'
    where g_id='${g_id}'
  `;
};

module.exports = {
  queryUpdateGoal
}