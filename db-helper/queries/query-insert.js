const queryUserCredentialInsert = ({ u_uname, u_passw }) => {
  return `
    insert into user_credential 
    values ('${u_uname}', '${u_passw}')
  `;
};

const queryUserDataInsert = ({ u_id, u_uname, u_first_name, u_last_name, u_height }) => {
  return `
    insert into user_data
    values ('${u_id}', '${u_uname}', '${u_first_name}', '${u_last_name}', '${u_helper}')
  `;
};

const queryUserWeightInsert = ({ u_id, u_measure_date, u_weight }) => {
  let insertDate;
  let whichVal;
  if (!u_measure_date) {
    insertDate = "";
    whichVal = `(u_id, u_weight)`;
  } else {
    insertDate = `'${u_measure_date}', `;
    whichVal = "";
  }
  return `
    insert into user_weight ${whichVal}
    values ('${u_id}', ${insertDate} '${u_weight}')
  `;
};

const queryGoalInsert = ({ g_id, u_id, g_title, g_detail, g_deadline }) => {
  return `
    insert into goal (g_id, u_id, g_title, g_detail, g_deadline)
    values ('${g_id}', '${u_id}', '${g_title}', '${g_detail}', ${g_deadline})
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

const queryWorkoutSnapInsert = ({ w_id, w_date, w_note }) => {
  let insertDate;
  let whichVal;
  if (!w_date) {
    insertDate = "";
    whichVal = `(w_id, w_note)`;
  } else {
    insertDate = `'${w_date}', `;
    whichVal = "";
  }
  return `
    insert into workout_snap ${whichVal}
    values ('${w_id}', ${insertDate} '${w_note}')
  `;
};

const queryExerciseSnapInsert = ({ e_id, w_id, w_date, e_note }) => {
  return `
    insert into exercise
    values ('${e_id}', '${w_id}', '${w_date}', '${e_note}')
  `;
};

const queryCycleSnapInsert = ({ c_id, e_id, w_id, w_date, c_intensity, c_reps, c_rest }) => {
  let insertDate;
  let whichVal;
  if (!w_date) {
    insertDate = "";
    whichVal = `(c_id, e_id, w_id, c_intensity, c_reps, c_rest)`;
  } else {
    insertDate = `'${w_date}', `;
    whichVal = "";
  }
  return `
    insert into cycle_snap ${whichVal}
    values ('${c_id}', '${e_id}', '${w_id}', ${insertDate} '${c_intensity}', '${c_reps}', '${c_rest}')
  `;
};
