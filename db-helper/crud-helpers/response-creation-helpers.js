const getGoalArray = goalsResponse => {
  const goals = [];
  for (let i in goalsResponse) {
    const goal = {};
    Object.assign(goal, goalsResponse[i]);
    goals.push(goal);
  }
  return goals;
};

const getWorkoutArray = workoutsResponse => {
  const workouts = [];
  for (let i in workoutsResponse) {
    const workout = {};
    Object.assign(workout, workoutsResponse[i]);
    workout.days = workout.days.split(",").map(d => parseInt(d));
    workouts.push(workout);
  }
  return workouts;
};

const addExerciseToWorkoutObject = (workouts, exerciseRes) => {
  const tempWorkoutObj = {};
  for (let e in exerciseRes) {
    const { w_id: wid, w_date, w_is_creation, ...exercise } = exerciseRes[e];
    if (tempWorkoutObj[wid] === undefined) {
      tempWorkoutObj[wid] = [];
    }
    tempWorkoutObj[wid].push(exercise);
  }
  for (let w in workouts) {
    workouts[w].exercises = tempWorkoutObj[workouts[w].id];
  }
};

const addCyclesToWorkoutObject = (workouts, cycleRes) => {
  const tempWorkoutObj = {};
  for (let c in cycleRes) {
    const { w_id: wid, e_id: eid, ...cycle } = cycleRes[c];
    if (tempWorkoutObj[wid] === undefined) {
      tempWorkoutObj[wid] = {};
    }
    if (tempWorkoutObj[wid][eid] === undefined) {
      tempWorkoutObj[wid][eid] = [];
    }
    tempWorkoutObj[wid][eid].push(cycle);
  }
  for (let w in workouts) {
    for (let e in workouts[w].exercises) {
      workouts[w].exercises[e].sets = tempWorkoutObj[workouts[w].id][workouts[w].exercises[e].id];
    }
  }
};

module.exports = {
  getGoalArray,
  getWorkoutArray,
  addExerciseToWorkoutObject,
  addCyclesToWorkoutObject
};
