const queryGetUserData = ({ u_uname }) => {
  return `
    select user_data.u_id as "id", u_first_name as "fname", 
    u_last_name as "lname", u_weight as "weight",
    u_height as "height" from user_data join user_weight
    where u_uname = "${u_uname}"
    and user_data.u_id = user_weight.u_id
    order by user_weight.u_date_created desc
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

const queryGetWorkoutId = ({ u_id }) => {
  return `
    select w_id from workout
    where u_id="${u_id}"
    order by w_seq
  `;
};

// Returns the workout and latest workout_snap for all workouts;
const queryGetWorkout = wIdList => {
  const queries = [];
  for (let i in wIdList) {
    const query = `
      (select workout.w_id as "id", w_name as "name", 
      workout.w_date as "last", w_days as "days", w_note as "note" 
      from workout join workout_snap
      where workout.w_id = workout_snap.w_id and workout.w_id="${wIdList[i].w_id}"
      order by workout_snap.w_date desc
      limit 1)
    `;
    queries.push(query);
  }
  return queries.join("\nunion\n");
};

const queryGetExerciseIds = wIdList => {
  const queries = [];
  for (let i in wIdList) {
    const query = `
      (select e_id from 
      exercise join workout
      where workout.w_id = "${wIdList[i].w_id}"
      and exercise.w_id = workout.w_id
      order by e_seq)
    `;
    queries.push(query);
  }
  return queries.join("\nunion\n");
};

const queryGetExercise = eIdList => {
  const queries = [];
  for (let i in eIdList) {
    const query = `
      (select exercise.e_id as "id", exercise.w_id, e_name as "name", w_date,
      e_note as "note", e_unit as "unit" 
      from exercise join exercise_snap
      where exercise.e_id = "${eIdList[i].e_id}"
      and exercise.e_id = exercise_snap.e_id
      order by w_date desc 
      limit 1)
    `;
    queries.push(query);
  }
  return queries.join("\nunion\n");
};

const queryGetCycle = eIdList => {};

module.exports = {
  queryGetUserData,
  queryGetGoal,
  queryGetWorkoutId,
  queryGetWorkout,
  queryGetExerciseIds,
  queryGetExercise,
  queryGetCycle
};
