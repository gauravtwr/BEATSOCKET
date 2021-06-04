const express = require("express");
const path = require("path");
const exphand = require("express-handlebars");
const bodyparser = require("body-parser");
const homeController = require("./controller/home");
require("dotenv/config");

var app = express();
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(bodyparser.json());

app.set("views", path.join(__dirname, "/views/"));
app.engine(
  "hbs",
  exphand({
    extname: "hbs",
    defaultLayout: "mainLayout",
    layoutsDir: __dirname + "/views/layouts/",
  })
);
app.set("view engine", "hbs");

app.listen(process.env.PORT, () => {
  console.log("Express server started at port: " + process.env.PORT);
});

app.use("/", homeController);
