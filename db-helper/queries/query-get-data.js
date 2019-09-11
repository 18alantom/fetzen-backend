const queryGetUserData = ({ u_uname }) => {
  return `
    select u_id as "id", u_first_name as "fname", u_last_name as "lname", u_height as "height"
    from user_data where u_uname="${u_uname}"
  `;
};

const queryGetUserWeightLatest = ({ u_id }) => {
  return `
    select u_weight as "weight", u_date_created as "lastWeighed"
    from user_weight
    where u_id="${u_id}"
    order by u_date_created desc
    limit 1
  `;
};

const queryGetGoal = ({ u_id }) => {
  return `
    select g_id as "id", g_title as "title", g_detail as "detail",
    g_deadline as "deadline", g_complete as "complete",
    g_date_completed as "dateCompleted" from goal
    where u_id="${u_id}"
    order by g_complete asc, g_deadline asc
  `;
};

const queryGetWorkout = ({ u_id }) => {
  
};

module.exports = {
  queryGetUserData,
  queryGetUserWeightLatest,
  queryGetGoal
};
