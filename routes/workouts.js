const express = require("express");
const connection = require("./connection");
const { insertWorkout } = require("../db-helper/crud-helpers/db-insertions");
const { updateWorkout, workoutDone } = require("../db-helper/crud-helpers/db-updations");
const { getWorkoutDates } = require("../db-helper/crud-helpers/db-get-data");
const { deleteWorkout } = require("../db-helper/crud-helpers/db-deletions");
const { checkWorkoutAdd, checkWorkoutUpdate, checkWorkoutDelete, checkWorkoutDone, checkWorkoutId } = require("./validators");
const debug = require("debug")("fetzen-backend:workouts");
const router = express.Router();

// Workouts routes

router.post("/add", (req, res) => {
  // Code that adds to the Workout table.
  debug(req.body);
  if (checkWorkoutAdd(req)) {
    insertWorkout(connection, req.body, () => {
      res.status(200).json("workout added");
    });
  } else {
    res.status(400).json("invalid data");
  }
});

router.put("/update", (req, res) => {
  // Code that updates the Workout table.
  debug(req.body);
  if (checkWorkoutUpdate(req)) {
    updateWorkout(connection, req.body, () => {
      res.status(200).json("workout updated");
    });
  } else {
    res.status(400).json("invalid data");
  }
});

router.put("/done", (req, res) => {
  // Code that updates the Workout table.
  debug(req.body);
  if (checkWorkoutDone(req)) {
    workoutDone(connection, req.body, () => {
      res.status(200).json("workout done");
    });
  } else {
    res.status(400).json("invalid data");
  }
});

router.delete("/delete", (req, res) => {
  // Code that deletes from the Workout table.
  debug(req.body);
  if (checkWorkoutDelete(req)) {
    deleteWorkout(connection, req.body, () => {
      res.status(200).json("workout deleted");
    });
  } else {
    res.status(400).json("invalid data");
  }
});

router.post("/last", (req, res) => {
  // Code to get all of the workout's done dates.
  debug(req.body);
  if (checkWorkoutId(req)) {
    getWorkoutDates(
      connection,
      req.body,
      dates => {
        res.status(200).json(dates);
      },
      () => {
        res.status(404).json("workout dates not found");
      }
    );
  } else {
    res.status(400).json("invalid data");
  }
});

module.exports = router;
