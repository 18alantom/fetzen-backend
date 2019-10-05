// Individual validators
const cStn = str => {
  if (typeof str === "string") {
    return true;
  }
  return false;
};

const cStr = str => {
  if (typeof str === "string" && str !== "") {
    return true;
  }
  return false;
};

const cNum = num => {
  if (typeof num === "number") {
    return true;
  }
  return false;
};

const cDte = dte => {
  if (new Date(dte).toString() !== "Invalid Date") {
    return true;
  }
  return false;
};

const cStrs = strings => {
  for (let i in strings) {
    if (!cStr(strings[i])) {
      return false;
    }
  }
  return true;
};

const cNums = numbers => {
  for (let i in numbers) {
    if (!cNum(numbers[i])) {
      return false;
    }
  }
  return true;
};

// USER VALIDATORS

const checkUserCredendials = ({ body }) => {
  const { u_uname, u_passw } = body;
  return cStr(u_uname) && cStr(u_passw);
};

const checkRegisterData = ({ body }) => {
  const { u_uname, u_passw, u_id, u_first_name, u_last_name, u_height, u_weight, u_date_created } = body;
  const numbers = [u_height, u_weight];
  const strings = [u_uname, u_passw, u_id, u_first_name, u_last_name];
  return cStrs(strings) && cNums(numbers) && cDte(u_date_created);
};

const checkUserWeight = ({ body }) => {
  const { u_id, u_date_created, u_weight } = body;
  return cStr(u_id) && cDte(u_date_created) && cNum(u_weight);
};

const checkUserId = ({ body }) => {
  const { u_id } = body;
  return cStr(u_id);
};

// GOAL VALIDATORS

const checkGoalAdd = ({ body }) => {
  const { g_id, u_id, g_title, g_detail, g_deadline } = body;
  const strings = [g_id, u_id, g_title, g_detail];
  return cStrs(strings) && cDte(g_deadline);
};

const checkGoalUpdate = ({ body }) => {
  const { g_id, g_complete, g_date_completed } = body;
  if (!cStr(g_id)) {
    return false;
  }
  if (!cNum(g_complete)) {
    return false;
  }
  if (g_complete === 1 && !cDte(g_date_completed)) {
    return false;
  }
  return true;
};

const checkGoalDelete = ({ body }) => {
  console.log(body);
  const { g_id } = body;
  return cStr(g_id);
};

// CYCLE VALIDATORS

const checkCycleAdd = ({ c_id, c_intensity, c_reps, c_rest }) => {
  const numbers = [c_intensity, c_reps, c_rest];
  return cStr(c_id) && cNums(numbers);
};

// EXERCISE VALIDATORS

const checkExerciseAdd = ({ e_seq, e_id, e_name, e_unit, e_note, e_cycles }) => {
  const strings = [e_id, e_name, e_unit];
  for (let c in e_cycles) {
    if (!checkCycleAdd(e_cycles[c])) {
      return false;
    }
  }
  return cStrs(strings) && cStn(e_note) && cNum(e_seq);
};

const checkExerciseDone = ({ e_id, e_unit, e_note, e_cycles }) => {
  const strings = [e_id, e_unit];
  for (let c in e_cycles) {
    if (!checkCycleAdd(e_cycles[c])) {
      return false;
    }
  }
  return cStrs(strings) && cStn(e_note);
};

const checkExerciseUpdate = ({ body: { w_id, e_id, e_seq, w_date, e_name, e_unit, e_cycles } }) => {
  const strings = [w_id, e_id, e_name, e_unit];
  for (let c in e_cycles) {
    if (!checkCycleAdd(e_cycles[c])) {
      return false;
    }
  }
  return cStrs(strings) && cDte(w_date) && cNum(e_seq);
};

const checkExerciseId = ({ body }) => {
  const { e_id } = body;
  return cStr(e_id);
};

// WORKOUT VALIDATORS

const checkWorkoutAdd = ({ body }) => {
  const { w_id, u_id, w_name, w_seq, w_date, w_days, w_note, w_exercises } = body;
  const strings = [w_id, u_id, w_name, w_days];
  for (let e in w_exercises) {
    if (!checkExerciseAdd(w_exercises[e])) {
      return false;
    }
  }
  return cStrs(strings) && cStn(w_note) && cNum(w_seq) && cDte(w_date);
};

const checkWorkoutUpdate = ({ body }) => {
  const { w_id, w_name, w_seq, w_date, w_days, w_note, w_exercises, w_exercises_deleted } = body;
  const strings = [w_id, w_name, w_days];
  for (let e in w_exercises) {
    if (!checkExerciseAdd(w_exercises[e])) {
      return false;
    }
  }
  if (w_exercises_deleted && w_exercises_deleted.length > 0) {
    if (!cStrs(w_exercises_deleted)) {
      return false;
    }
  }
  return cStrs(strings) && cStn(w_note) && cNum(w_seq) && cDte(w_date);
};

const checkWorkoutDone = ({ body }) => {
  const { w_id, w_date, w_note, w_exercises } = body;
  for (let e in w_exercises) {
    if (!checkExerciseDone(w_exercises[e])) {
      return false;
    }
  }
  return cStr(w_id) && cStn(w_note) && cDte(w_date);
};

const checkWorkoutDelete = ({ body }) => {
  const { w_id } = body;
  return cStr(w_id);
};

const checkWorkoutId = ({ body }) => {
  const { w_id } = body;
  return cStr(w_id);
};


module.exports = {
  checkUserCredendials,
  checkRegisterData,
  checkUserWeight,
  checkUserId,
  checkGoalAdd,
  checkGoalDelete,
  checkGoalUpdate,
  checkWorkoutAdd,
  checkWorkoutUpdate,
  checkWorkoutDelete,
  checkWorkoutDone,
  checkWorkoutId,
  checkExerciseUpdate,
  checkExerciseId
};
