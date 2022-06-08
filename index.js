const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

app.use(
  session({
    secret: "This is my secret",
    resave: false,
    saveUninitialized: false,
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
mongoose.connect(
  "mongodb+srv://contactpage:qwaszx78@cluster0.u84yf.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlparser: true }
);
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

const userschema = new mongoose.Schema({
  username: String,
  password: String,
  message: String,
});
userschema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userschema);
app.use(passport.initialize());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/", function (req, res) {
  res.render("home");
});
app.get("/register", function (req, res) {
  res.render("register");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/secrets", function (req, res) {
  if (req.isAuthenticated) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});
app.get("/submit", function (req, res) {
  if (req.isAuthenticated) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});
app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
app.post("/register", function (req, res) {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    }
  );
});

app.post("/submit", function (req, res) {
  const secret = req.body.secret;
  console.log(req.sessionID);
  console.log(secret);
});
app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.email,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) console.log(err);
    else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});
app.listen(3000, function (req, res) {
  console.log("server is working");
});
