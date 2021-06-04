var router = require("express").Router();
const User = require("../models/user");

router.post("/signUp", (req, res) => {
  User.findOne({ userid: req.body.userid }, (err, obj) => {
    if (obj === null) {
      addUser(req, res);
    } else {
      console.log("Username taken");
      res.render("home", { title: "Username taken!" });
    }
  });
});

router.post("/login", (req, res) => {
  User.findOne({ userid: req.body.userid }, (err, obj) => {
    if (!err) {
      if ((req.body.userid == "") | (req.body.password == "")) {
        if ((req.body.userid == "") & (req.body.password == ""))
          res.render("home", {
            title: "Home",
            uid: "This field is required",
            ups: "This field is required",
          });
        else {
          if (req.body.userid == "")
            res.render("home", { uid: "This field is required" });
          else if (req.body.password == "")
            res.render("home", { ups: "This field is required" });
        }
      } else if (obj == null) {
        res.render("home", {
          viewTitle: "User does not exist",
        });
      } else if (
        req.body.password != obj.password ||
        req.body.password == null
      ) {
        res.render("home", {
          viewTitle: "Incorrect Password",
        });
      } else if (req.body.password == obj.password) {
        Post.find({ _id: { $in: obj.songs } }, (err, records) => {
          if (!err) {
            res.render("dashboard", {
              title: obj.name,
              user: obj,
              songs: records,
            });
          }
        });
      }
    } else console.log("Error in signing in");
  });
});

function addUser(req, res) {
  var user = new User(req.body);
  user.save((err) => {
    if (!err) {
      res.render("dashboard", {
        title: "Dashboard",
        name: req.body.name,
      });
    } else {
      if (err.name == "ValidationError") {
        handleValidationError(err, req.body);
        res.render("home", { user: req.body });
      } else console.log("error in Signing up -> " + err);
    }
  });
}

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "name":
        body["nameError"] = err.errors[field].message;
        break;
      case "phone":
        body["phoneError"] = err.errors[field].message;
        break;
      case "userid":
        body["useridError"] = err.errors[field].message;
        break;
      case "email":
        body["emailError"] = err.errors[field].message;
        break;
      case "password":
        body["passwordError"] = err.errors[field].message;
        break;
      case "confirmPassword":
        body["confirmPasswordError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

module.exports = router;
