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

module.exports = {
  getGoalArray,
  getWorkoutArray
};
