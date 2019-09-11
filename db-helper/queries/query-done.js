const queryWorkoutDone = ({ w_id, w_date }) => {
  return `
    update workout
    set w_date='${w_date}'
    where w_id='${w_id}'
  `;
};

module.exports = {
  queryWorkoutDone
};
