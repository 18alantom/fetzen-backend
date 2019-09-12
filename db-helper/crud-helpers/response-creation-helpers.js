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
    const wid = exerciseRes[e].w_id;
    const exercise = {};
    Object.assign(exercise, exerciseRes[e]);
    if (tempWorkoutObj[wid] === undefined) {
      tempWorkoutObj[wid] = [];
    }
    tempWorkoutObj[wid].push(exercise);
  }
  for (let w in workouts) {
    workouts[w].exercises = tempWorkoutObj[workouts[w].id];
  }
};

module.exports = {
  getGoalArray,
  getWorkoutArray,
  addExerciseToWorkoutObject
};
