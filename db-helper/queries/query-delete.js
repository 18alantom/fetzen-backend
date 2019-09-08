const queryUserDelete = ({ u_uname, u_passw }) => {
  return `
    delete from user_credential
    where u_uname='${u_uname}' 
  `;
};

const queryGoalDelete = ({ g_id }) => {
  return `
    delete from goal
    where g_id='${g_id}'
  `;
};

const queryWorkoutDelete = ({ w_id }) => {
  return `
    delete from workout
    where w_id='${w_id}'
  `;
};

const queryExerciseDelete = ({ e_id }) => {
  return `
    delete from exercise
    where e_id='${e_id}'
  `;
};

module.exports = {
  queryUserDelete,
  queryGoalDelete,
  queryWorkoutDelete,
  queryExerciseDelete
};
