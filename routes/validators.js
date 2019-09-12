const checkUserCredendials = ({ body }) => {
  const { u_uname, u_passw } = body;
  let valid = false;
  switch (u_uname) {
    case undefined:
      return false;
    case "":
      return false;
    default:
      valid = true;
  }
  switch (u_passw) {
    case undefined:
      return false;
    case "":
      return false;
    default:
      valid = true;
  }
  return valid;
};

const checkRegisterData = ({ body }) => {
  const { u_uname, u_passw, u_id, u_first_name, u_last_name, u_height, u_weight, u_date_created } = body;
  const numbers = [u_height, u_weight];
  const strings = [u_uname, u_passw, u_id, u_first_name, u_last_name];
  const date = new Date(u_date_created);

  for (let i in numbers) {
    if (typeof numbers[i] !== "number") {
      return false;
    }
  }
  for (let i in strings) {
    if (typeof strings[i] !== "string" || strings[i] === "") {
      return false;
    }
  }
  if (date.toString() === "Invalid Date") {
    return false;
  }
  return true;
};

checkUserWeight = ({ body }) => {
  const { u_id, u_date_created, u_weight } = body;
  if (typeof u_id !== "string" || u_id === "") {
    return false;
  }
  if (typeof u_weight !== "number") {
    return false;
  }
  if (new Date(u_date_created).toString() === "Invalid Date") {
    return false;
  }
  return true;
};

checkUserId = ({ body }) => {
  const { u_id } = body;
  if (typeof u_id !== "string" || u_id === "") {
    return false;
  }
  return true;
};

module.exports = { checkUserCredendials, checkRegisterData, checkUserWeight, checkUserId };
