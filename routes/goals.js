const express = require("express");
const connection = require("./connection");
const { insertGoal } = require("../db-helper/crud-helpers/db-insertions");
const { updateGoal } = require("../db-helper/crud-helpers/db-updations");
const { deleteGoal } = require("../db-helper/crud-helpers/db-deletions");
const { checkGoalAdd, checkGoalDelete, checkGoalUpdate } = require("./validators");
const debug = require("debug")("fetzen-backend:goals");
const router = express.Router();

// Goals routes

router.post("/add", (req, res) => {
  // Code that adds to the Goal table.
  debug(req.body);
  if (checkGoalAdd(req)) {
    insertGoal(connection, req.body, () => {
      res.status(200).json("goal added");
    });
  } else {
    res.status(400).json("invalid data");
  }
});

router.put("/update", (req, res) => {
  // Code that updates the Goal table.
  debug(req.body);
  if (checkGoalUpdate(req)) {
    updateGoal(connection, req.body, () => {
      res.status(200).json("goal updated");
    });
  } else {
    res.status(400).json("invalid data");
  }
});

router.delete("/delete", (req, res) => {
  // Code that deletes from the Goal table.
  debug(req.body);
  if (checkGoalDelete(req)) {
    deleteGoal(connection, req.body, () => {
      res.status(200).json("goal deleted");
    });
  } else {
    res.status(400).json("invalid data");
  }
});

module.exports = router;
