const express = require("express");
const connection = require("./connection");
// const {} = require("./validators");
const { insertGoal } = require("../db-helper/crud-helpers/db-insertions");
const { updateGoal } = require("../db-helper/crud-helpers/db-updations");
const { deleteGoal } = require("../db-helper/crud-helpers/db-deletions");
const { checkGoalAdd, checkGoalDelete, checkGoalUpdate } = require("./validators");
const router = express.Router();

// Goals routes

router.post("/add", (req, res) => {
  // Code that adds to the Goal table.
  if (checkGoalAdd(req)) {
    insertGoal(connection, req.body, () => {
      res.status(200).send("goal added");
    });
  } else {
    res.status(400).send("invalid data");
  }
});

router.put("/update", (req, res) => {
  // Code that updates the Goal table.
  if (checkGoalUpdate(req)) {
    updateGoal(connection, req.body, () => {
      res.status(200).send("goal updated");
    });
  } else {
    res.status(400).send("invalid data");
  }
});

router.delete("/delete", (req, res) => {
  // Code that deletes from the Goal table.
  if (checkGoalDelete(req)) {
    deleteGoal(connection, req.body, () => {
      res.status(200).send("goal deleted");
    });
  } else {
    res.status(400).send("invalid data");
  }
});

module.exports = router;
