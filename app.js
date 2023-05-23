const express = require("express");
var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// const bodyParser = require("body-parser");
const session = require("express-session");
const cache = require("node-cache");
const mongoose = require("mongoose");
const multer = require("multer");
const expresslayout = require("express-ejs-layouts");
var db = require("./config/connection");

var usersRouter = require("./routes/user");
var merchantRouter = require("./routes/merchant");
var adminRouter = require("./routes/admin");

const app = express();
const cacheInstance = new cache({ stdTTL: 9000000000000000 * 900000000000 });
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "./layout/layout");
app.use(expresslayout);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({ secret: "Key", cookie: { maxAge: 600000000 * 60000000000 } })
);
db.connect((err) => {
  if (err) console.log("Connection Error" + err);
});
app.use(function (req, res, next) {
  req.cache = cacheInstance;
  next();
});

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use("/", usersRouter);
app.use("/merchant/", merchantRouter);
app.use("/admin/", adminRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500 || 400);
  // res.render("admin/404");
  res.render("error");
});

module.exports = app;
