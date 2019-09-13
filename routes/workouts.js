const express = require("express");
const connection = require("./connection");
const { insertWorkout } = require("../db-helper/crud-helpers/db-insertions");
const { updateWorkout, workoutDone } = require("../db-helper/crud-helpers/db-updations");
const { deleteWorkout } = require("../db-helper/crud-helpers/db-deletions");
const { checkWorkoutAdd, checkWorkoutUpdate, checkWorkoutDelete, checkWorkoutDone } = require("./validators");
const router = express.Router();

// Workouts routes

router.post("/add", (req, res) => {
  // Code that adds to the Workout table.
  if (checkWorkoutAdd(req)) {
    insertWorkout(connection, req.body, () => {
      res.status(200).send("workout added");
    });
  } else {
    res.status(400).send("invalid data");
  }
});

router.put("/update", (req, res) => {
  // Code that updates the Workout table.
  if (checkWorkoutUpdate(req)) {
    updateWorkout(connection, req.body, () => {
      res.status(200).send("workout updated");
    });
  } else {
    res.status(400).send("invalid data");
  }
});

router.put("/done", (req, res) => {
  // Code that updates the Workout table.
  if (checkWorkoutDone(req)) {
    workoutDone(connection, req.body, () => {
      res.status(200).send("workout done");
    });
  } else {
    res.status(400).send("invalid data");
  }
});

router.delete("/delete", (req, res) => {
  // Code that deletes from the Workout table.
  if (checkWorkoutDelete(req)) {
    deleteWorkout(connection, req.body, () => {
      res.status(200).send("workout deleted");
    });
  } else {
    res.status(400).send("invalid data");
  }
});

module.exports = router;
