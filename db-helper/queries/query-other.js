const getUser = u_uname => {
  return `
    select u_uname, u_passw
    from user_credential
    where u_uname='${u_uname}'
  `;
};

const getWorkoutSnap = (w_id, w_date, w_is_creation) => {
  return `
    select w_id
    from workout_snap
    where w_id='${w_id}' and w_date='${w_date}' and w_is_creation=${w_is_creation}
  `;
};

module.exports = {
  getUser,
  getWorkoutSnap
};
