const queryGoalUpdate = ({ g_id, g_complete, g_date_completed }) => {
  return `
    update goal
    set g_complete=${g_complete}, g_date_completed='${g_date_completed}'
    where g_id='${g_id}'
  `;
};

const queryExerciseUpdate = ({ e_id, e_name }) => {
  return `
    update exercise
    set e_name='${e_name}' 
    where e_id='${e_id}'
  `;
};

const queryExerciseSnapUpdate = ({ e_id, w_date, e_note, e_unit, w_is_creation }) => {
  let eunit_setter = "";
  let enote_setter = "";
  let seperator = "";
  if (e_unit) {
    eunit_setter = `e_unit='${e_unit}'`;
  }
  if (e_note) {
    enote_setter = `e_note='${e_note}'`;
  }
  let a = eunit_setter.length > 0;
  let b = enote_setter.length > 0;
  if (a && b) {
    seperator = ", ";
  }
  if (a || b) {
    return `
      update exercise_snap
      set ${eunit_setter}${seperator}${enote_setter}
      where e_id='${e_id}' and w_date='${w_date}' and w_is_creation=${w_is_creation}
    `;
  } else {
    return "";
  }
};

const queryCycleSnapUpdate = ({ c_id, c_seq, w_date, c_intensity, c_reps, c_rest, w_is_creation }) => {
  return `
    update cycle_snap
    set c_intensity='${c_intensity}', c_reps='${c_reps}', c_rest='${c_rest}', c_seq=${c_seq}
      where c_id='${c_id}' and w_date='${w_date}' and w_is_creation=${w_is_creation}
  `;
};

module.exports = {
  queryGoalUpdate,
  queryExerciseUpdate,
  queryExerciseSnapUpdate,
  queryCycleSnapUpdate
};
