const express = require("express");
const app = express();

const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const port = 5000;
const swiggy = require("./models/swiggy");
const Controller = require("./controllers/controller");     
//inclusing view engine
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//helps in getting req body and send res body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://0.0.0.0:27017/form", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((err) => {
  console.error("MongoDB connection failed:", err);
  process.exit(1);
});

app.get('/', Controller.renderSurveyForm);
app.post('/submit', Controller.submitSurvey);
app.get('/results', Controller.getSurveyResults);

app.listen(port, () => {
    console.log(`The server is up and running on http${port}`);
  });

  