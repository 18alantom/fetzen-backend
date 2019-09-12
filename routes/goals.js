const express = require("express");
const connection = require("./connection");
// const {} = require("./validators");
const { insertGoal } = require("../db-helper/crud-helpers/db-insertions");
const { updateGoal } = require("../db-helper/crud-helpers/db-updations");
const { deleteGoal } = require("../db-helper/crud-helpers/db-deletions");
const router = express.Router();

// Goals routes

router.post("/add", (req, res) => {
  // Code that adds to the Goal table.
});

router.put("/update", (req, res) => {
  // Code that updates the Goal table.
});

router.delete("/delete", (req, res) => {
  // Code that deletes from the Goal table.
});

module.exports = router;
