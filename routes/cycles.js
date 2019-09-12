const express = require("express");
const router = express.Router();

// Cycles routes

router.post("/add", (req, res) => {
  // Code that adds to the Workout table.
});

router.put("/update", (req, res) => {
  // Code that updates the Workout table.
});

router.delete("/delete", (req, res) => {
  // Code that deletes from the Workout table.
});

module.exports = router;
