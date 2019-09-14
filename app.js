const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const debug = require("debug")("fetzen-backend:app");

// Importing the routes
const usersRouter = require("./routes/users");
const goalsRouter = require("./routes/goals");
const workoutsRouter = require("./routes/workouts");
const exercisesRouter = require("./routes/exercises");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
app.use(cors());

app.use("/users", usersRouter);
app.use("/goals", goalsRouter);
app.use("/workouts", workoutsRouter);
app.use("/exercises", exercisesRouter);

app.get("/", (req, res) => {
  debug(req.method);
  debug(req.headers);
  res.status(418).json("no coffee");
});

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, _next) => {
  // respond with error only when under development
  const { message } = err;
  const error = req.app.get("env") === "development" ? err : {};

  // send the error
  res.status(err.status || 500).json({ message, error });
});

module.exports = { app };
