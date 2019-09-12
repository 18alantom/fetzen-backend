const express = require("express");
const connection = require("./connection");
const { checkUserCredendials, checkRegisterData, checkUserWeight, checkUserId } = require("./validators");
const { validateUser } = require("../db-helper/db-connection");
const { getUser, getUserWeights } = require("../db-helper/crud-helpers/db-get-data");
const { registerUser, insertWeight } = require("../db-helper/crud-helpers/db-insertions");
const { deleteUser } = require("../db-helper/crud-helpers/db-deletions");

const router = express.Router();

// Users routes

router.post("/login", (req, res) => {
  // Code that validates and responds with user data.
  if (checkUserCredendials(req)) {
    validateUser(
      connection,
      req.body,
      () => {
        getUser(
          connection,
          req.body,
          user => {
            console.log(user);
            res.status(200).json(user);
          },
          () => {
            res.status(404).send("user data not found");
          }
        );
      },
      () => {
        res.status(404).send("user not found");
      },
      () => {
        res.status(403).send("invalid password");
      }
    );
  } else {
    res.status(400).send("invalid data");
  }
});

router.put("/register", (req, res) => {
  // Code that creates entry for new user.
  if (checkRegisterData(req)) {
    registerUser(
      connection,
      req.body,
      () => {
        res.status(409).send("user already registered");
      },
      () => {
        res.status(200).send("user registered");
      }
    );
  } else {
    res.status(400).send("invalid data");
  }
});

// TODO: Add this route to update user name, first name, last name.
// Create helper functions for this also.
// router.put("/update", (req, res) => {
//   // Code that updates columns in the user table based on received data.
// });

router.put("/weight", (req, res) => {
  // Code that updates columns in the user table based on received data.
  if (checkUserWeight(req)) {
    insertWeight(connection, req.body, () => {
      res.status(200).send("weight recorded");
    });
  } else {
    res.status(400).send("invalid data");
  }
});

router.post("/weight", (req, res) => {
  // Code to get all of the users weights.
  if (checkUserId(req)) {
    getUserWeights(
      connection,
      req.body,
      weights => {
        res.status(200).json(weights);
      },
      () => {
        res.status(404).send("user weights not found");
      }
    );
  } else {
    res.status(400).send("invalid data");
  }
});

router.delete("/delete", (req, res) => {
  // Code that deletes all the users data, changes values in all the tables.
  if (checkUserCredendials(req)) {
    deleteUser(
      connection,
      req.body,
      () => {
        res.status(200).json("user deleted");
      },
      () => {
        res.status(403).send("invalid password");
      },
      () => {
        res.status(404).send("user not found");
      }
    );
  } else {
    res.status(400).send("invalid data");
  }
});

module.exports = router;
