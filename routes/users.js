const express = require("express");
const router = express.Router();

// Users routes

router.post("/login", (req, res) => {
  // Code that validates and responds with user data.
});

router.put("/register", (req, res) => {
  // Code that creates entry for new user.
});

router.put("/update", (req, res) => {
  // Code that updates columns in the user table based on received data.
});

router.delete("/delete", (req, res) => {
  // Code that deletes all the users data, changes values in all the tables.
});

module.exports = router;
