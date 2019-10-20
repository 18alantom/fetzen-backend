// Database helpers
require('dotenv').config()
const { getConnection } = require("../db-helper/db-connection");
const databaseParameters = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABSE,
  port: process.env.DB_PORT,
  dateStrings: true
};

const connection = getConnection(databaseParameters);
module.exports = connection;
