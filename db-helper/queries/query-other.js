const getUser = u_uname => {
  return `
    select u_uname 
    from user_credential
    where u_uname='${u_uname}'
  `;
};

module.exports = {
  getUser
};
