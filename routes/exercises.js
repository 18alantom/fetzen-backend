const express = require("express");
const router = express.Router();

// Exercises routes

router.post("/add", (req, res) => {
  // Code that adds to the Exercise table.
});

router.put("/update", (req, res) => {
  // Code that updates the Exercise table.
});

router.delete("/delete", (req, res) => {
  // Code that deletes from the Exercise table.
});

module.exports = router;
