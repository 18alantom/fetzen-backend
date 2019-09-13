const getUser = u_uname => {
  return `
    select u_uname, u_passw
    from user_credential
    where u_uname='${u_uname}'
  `;
};

const getWorkoutSnap = (w_id, w_date, w_is_creation) => {
  return `
    select w_id
    from workout_snap
    where w_id='${w_id}' and w_date='${w_date}' and w_is_creation=${w_is_creation}
  `;
};

const getExerciseSnap = (e_id, w_date, w_is_creation) => {
  return `
    select e_id
    from exercise_snap
    where e_id='${e_id}' and w_date='${w_date}' and w_is_creation=${w_is_creation}
  `;
};

const getCycleSnap = (e_id, w_date, w_is_creation) => {
  return `
    select c_id
    from cycle_snap
    where c_id='${e_id}' and w_date='${w_date}' and w_is_creation=${w_is_creation}
  `;
};

const getExercise = e_id => {
  return `
    select e_id
    from exercise
    where e_id='${e_id}'
  `;
};

const getDoneDate = (w_id, w_date) => {
  return `
    select w_id
    from done_date
    where w_id='${w_id}' and w_date='${w_date}'
  `;
};

module.exports = {
  getUser,
  getWorkoutSnap,
  getExerciseSnap,
  getCycleSnap,
  getExercise,
  getDoneDate
};
