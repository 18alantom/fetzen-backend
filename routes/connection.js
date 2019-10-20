// Database helpers
require("dotenv").config();
const { getConnection } = require("../db-helper/db-connection");
const databaseParameters = {
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABSE,
  port: process.env.DB_PORT,
  dateStrings: true
};

const connection = getConnection(databaseParameters);
module.exports = connection;
