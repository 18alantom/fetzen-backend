const getGoalArray = goalsResponse => {
  const goals = [];
  for (let i in goalsResponse) {
    const goal = {};
    Object.assign(goal, goalsResponse[i]);
    goals.push(goal);
  }
  return goals;
};

module.exports = {
  getGoalArray
};
