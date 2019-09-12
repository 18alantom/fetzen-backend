// Database helpers
const { getConnection } = require("../db-helper/db-connection");
const databaseParameters = {
  host: "localhost",
  user: "fetzen_master",
  password: "fetzen_master",
  database: "fetzen",
  dateStrings: true
};
const connection = getConnection(databaseParameters);
module.exports = connection;