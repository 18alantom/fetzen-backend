const express = require("express");
const connection = require("./connection");
const { updateExercise } = require("../db-helper/crud-helpers/db-updations");
const { checkExerciseUpdate } = require("./validators");
const debug = require("debug")("fetzen-backend:exercises")
const router = express.Router();

// Exercises routes

router.put("/update", (req, res) => {
  // Code that updates the Exercise table.
  debug(req.body);
  if (checkExerciseUpdate(req)) {
    updateExercise(
      connection,
      req.body,
      () => {
        res.status(200).json("exercise updated");
      },
      true,
      true
    );
  } else {
    res.status(400).json("invalid data");
  }
});

module.exports = router;
