const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");

// Importing the routes
const usersRouter = require("./routes/users");
const goalsRouter = require("./routes/goals");
const workoutsRouter = require("./routes/workouts");
const exercisesRouter = require("./routes/exercises");
const cyclesRouter = require("./routes/cycles");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/goals", goalsRouter);
app.use("/workouts", workoutsRouter);
app.use("/exercises", exercisesRouter);
app.use("/cycles", cyclesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
