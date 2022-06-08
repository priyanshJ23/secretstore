const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log("Middleware 1 called.");
  console.log(req.path);
  next(); // calling next middleware function or handler
});
app.get("/", function (req, res) {
  res.send("Hello pagal");
});
app.listen(3000, function (req, res) {
  console.log("server is working");
});
