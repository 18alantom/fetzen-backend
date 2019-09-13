const express = require("express");
const connection = require("./connection");
const { updateExercise } = require("../db-helper/crud-helpers/db-updations");
const { checkExerciseUpdate } = require("./validators");

const router = express.Router();

// Exercises routes

router.put("/update", (req, res) => {
  // Code that updates the Exercise table.
  if (checkExerciseUpdate(req)) {
    updateExercise(
      connection,
      req.body,
      () => {
        res.status(200).send("exercise updated");
      },
      true,
      true
    );
  } else {
    res.status(400).send("invalid data");
  }
});

module.exports = router;
