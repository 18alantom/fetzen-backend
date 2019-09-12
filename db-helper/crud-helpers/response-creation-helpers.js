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

const datesResponseToArray = datesRes => {
  const dates = [];
  for (let d in datesRes) {
    dates.push(datesRes[d].date);
  }
  return dates;
};

const weightsResponseToArray = weightsRes => {
  const weights = [];
  for (let d in weightsRes) {
    const { datetime, weight } = weightsRes[d];
    weights.push({ datetime, weight });
  }
  return weights;
};

const createExerciseStats = cycles => {
  const stats = {};
  const temp = [];
  const dateIndex = {};
  let avgAll = 0;
  let avgMax = 0;
  let index = 0;
  for (let c in cycles) {
    const { intensity, rest, reps, date } = cycles[c];
    avgAll += intensity;
    if (dateIndex[date] === undefined) {
      dateIndex[date] = index++;
      temp[dateIndex[date]] = {};
      temp[dateIndex[date]].date = date;
      temp[dateIndex[date]].intensity = intensity;
      temp[dateIndex[date]].reps = reps;
      temp[dateIndex[date]].rest = rest;
      avgMax += intensity;
    }
    if (temp[dateIndex[date]].intensity < intensity) {
      temp[dateIndex[date]].intensity = intensity;
      temp[dateIndex[date]].reps = reps;
      temp[dateIndex[date]].rest = rest;
      avgMax += intensity;
    }
  }

  avgAll /= cycles.length;
  avgMax /= index;

  stats.allTimeAverage = avgAll;
  stats.averageMax = avgMax;
  stats.maxValues = temp;
  return stats;
};

module.exports = {
  getGoalArray,
  getWorkoutArray,
  addExerciseToWorkoutObject,
  addCyclesToWorkoutObject,
  datesResponseToArray,
  weightsResponseToArray,
  createExerciseStats
};
