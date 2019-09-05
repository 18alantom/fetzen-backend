const express = require("express");
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
