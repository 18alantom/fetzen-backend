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
      (select workout.w_id as "id", w_name as "name", w_seq as "seq",
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
      (select exercise.e_id as "id",e_name as "name", e_note as "note", e_seq as "seq",
      e_unit as "units", exercise.w_id, w_date, w_is_creation
      from exercise join exercise_snap
      where exercise.e_id = "${eIdList[i].e_id}"
      and exercise.e_id = exercise_snap.e_id
      order by w_date desc, w_is_creation asc
      limit 1)
    `;
    queries.push(query);
  }
  return queries.join("\nunion\n");
};

const queryGetCycle = eList => {
  const queries = [];
  for (let i in eList) {
    const { id, w_date, w_is_creation } = eList[i];
    query = `
      (select c_id as "id", c_intensity as "intensity", 
      c_reps as "reps", c_rest as "rest", exercise.e_id, cycle_snap.w_id
      from exercise join cycle_snap 
      where exercise.e_id = "${id}"
      and exercise.e_id = cycle_snap.e_id
      and cycle_snap.w_date = "${w_date}"
      and cycle_snap.w_is_creation = ${w_is_creation}
      order by c_seq asc)
    `;
    queries.push(query);
  }
  return queries.join("\nunion\n");
};

const queryGetWorkoutDates = w_id => {
  return `
    select w_date as "date" 
    from done_date
    where w_id="${w_id}"
    order by w_date desc
  `;
};

const queryGetUserWeights = u_id => {
  return `
    select u_date_created as "datetime", u_weight as "weight"
    from user_weight
    where u_id="${u_id}"
    order by u_date_created desc
  `;
};

const queryGetExerciseStats = e_id => {
  return `
    select c_intensity as "intensity", c_rest as "rest", 
    c_reps as "reps", cycle_snap.w_date as "date"
    from exercise join done_date join cycle_snap
    where exercise.e_id="${e_id}"
    and exercise.w_id = done_date.w_id
    and exercise.e_id = cycle_snap.e_id
    and done_date.w_date = cycle_snap.w_date
    and cycle_snap.w_is_creation=0
    order by cycle_snap.w_date desc, cycle_snap.c_intensity desc, 
    cycle_snap.c_seq desc
  `;
};

module.exports = {
  queryGetUserData,
  queryGetGoal,
  queryGetWorkoutId,
  queryGetWorkout,
  queryGetExerciseIds,
  queryGetExercise,
  queryGetCycle,
  queryGetWorkoutDates,
  queryGetUserWeights,
  queryGetExerciseStats
};
