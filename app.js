var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const { default: mongoose } = require("mongoose");

var orchidRouter = require("./routes/orchidRouter");
var userRouter = require("./routes/userRouter");
var categoryRouter = require("./routes/categoryRouter");

var app = express();

require("./config/passport")(passport);
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

const url = "mongodb://127.0.0.1:27017/ass3";
const connect = mongoose.connect(url);
connect.then((data) => {});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(function (req, res, next) {
  res.locals.userLogin = req.user; // Định nghĩa biến user trong locals
  next();
});
app.use("/orchids", orchidRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);

app.use("/home", (req, res) => {
  res.render("home/index");
  return;
});

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
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
