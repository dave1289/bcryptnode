const express = require("express")
const app = express();
const userRoutes = require("./routes/users.js")
const ExpressError = require("./middleware/expressError")
const db = require('./db.js')
const { authenticateJWT } = require('./middleware/auth')

app.use(express.json());
app.use(authenticateJWT);
app.use("/", userRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  return new ExpressError("Not Found", 404);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.message,
  });
});

module.exports = app;