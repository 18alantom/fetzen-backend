const { noQuote: nq } = require("../crud-helpers/helper-functions");

const queryGoalUpdate = ({ g_id, g_complete, g_date_completed }) => {
  let dateCompleted = `g_date_completed='${g_date_completed}'`;
  if (!g_date_completed) {
    dateCompleted = `g_date_completed=NULL`;
  }
  return `
    update goal
    set g_complete=${g_complete}, ${dateCompleted}
    where g_id='${g_id}'
  `;
};

const queryExerciseUpdate = ({ e_seq, e_id, e_name }) => {
  let setESeq = "";
  if (e_seq != undefined) {
    setESeq = `, e_seq=${e_seq}`;
  }
  return `
    update exercise
    set e_name='${nq(e_name)}' ${setESeq}
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
    enote_setter = `e_note='${nq(e_note)}'`;
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

const queryWorkoutUpdate = ({ w_seq, w_id, w_name, w_days }) => {
  let setWSeq = "";
  if (w_seq != undefined) {
    setWSeq = `, w_seq=${w_seq}`;
  }
  return `
    update workout
    set w_name='${nq(w_name)}', w_days='${w_days}'${setWSeq}
    where w_id='${w_id}'
  `;
};

const queryWorkoutSnapUpdate = ({ w_id, w_date, w_note, w_is_creation }) => {
  return `
    update workout_snap
    set w_note='${nq(w_note)}' 
    where w_id='${w_id}' and w_date='${w_date}' and w_is_creation=${w_is_creation}
  `;
};

module.exports = {
  queryGoalUpdate,
  queryExerciseUpdate,
  queryExerciseSnapUpdate,
  queryCycleSnapUpdate,
  queryWorkoutUpdate,
  queryWorkoutSnapUpdate
};
