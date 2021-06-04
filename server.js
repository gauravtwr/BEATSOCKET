require("dotenv/config");
const express = require("express");
const path = require("path");
const exphand = require("express-handlebars");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const homeController = require("./controller/home");
const userController = require("./controller/user");

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

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (!err) {
      console.log("Database connected");
    } else console.log(err);
  }
);

app.use("/", homeController);
app.use("/user", userController);
