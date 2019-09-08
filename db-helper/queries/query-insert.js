const queryUserCredentialInsert = ({ u_uname, u_passw }) => {
  return `
    insert into user_credential 
    values ('${u_uname}', '${u_passw}')
  `;
};

const queryUserDataInsert = ({ u_id, u_uname, u_first_name, u_last_name, u_date_created, u_height }) => {
  return `
    insert into user_data
    values ('${u_id}', '${u_uname}', '${u_first_name}', '${u_last_name}', '${u_date_created}', ${u_height})
  `;
};

const queryUserWeightInsert = ({ u_id, u_date_created, u_weight }) => {
  return `
    insert into user_weight
    values ('${u_id}', '${u_date_created}', ${u_weight})
  `;
};

const queryGoalInsert = ({ g_id, u_id, g_title, g_detail, g_deadline }) => {
  return `
    insert into goal (g_id, u_id, g_title, g_detail, g_deadline)
    values ('${g_id}', '${u_id}', '${g_title}', '${g_detail}', '${g_deadline}')
  `;
};

const queryWorkoutInsert = ({ w_id, u_id, w_name, w_days }) => {
  return `
    insert into workout (w_id, u_id, w_name, w_days)
    values ('${w_id}', '${u_id}', '${w_name}', '${w_days}')
  `;
};

const queryExerciseInsert = ({ e_id, w_id, e_name, e_unit }) => {
  return `
    insert into exercise
    values ('${e_id}', '${w_id}', '${e_name}', '${e_unit}')
  `;
};

const queryWorkoutSnapInsert = ({ w_id, w_date, w_note, w_is_creation }) => {
  return `
    insert into workout_snap
    values ('${w_id}', '${w_date}', '${w_note}', ${w_is_creation})
  `;
};

const queryExerciseSnapInsert = ({ e_id, w_id, w_date, e_note, w_is_creation }) => {
  return `
    insert into exercise_snap
    values ('${e_id}', '${w_id}', '${w_date}', '${e_note}', ${w_is_creation})
  `;
};

const queryCycleSnapInsert = ({ c_id, e_id, w_id, w_date, c_intensity, c_reps, c_rest, w_is_creation }) => {
  return `
    insert into cycle_snap
    values ('${c_id}', '${e_id}', '${w_id}', '${w_date}', '${c_intensity}', '${c_reps}', '${c_rest}', ${w_is_creation})
  `;
};

module.exports = {
  queryUserCredentialInsert,
  queryUserDataInsert,
  queryUserWeightInsert,
  queryGoalInsert,
  queryWorkoutInsert,
  queryExerciseInsert,
  queryWorkoutSnapInsert,
  queryExerciseSnapInsert,
  queryCycleSnapInsert
};
