var router = require("express").Router();
const Song = require("../models/song");
const User = require("../models/user");

router.get("/signUp", (req, res) => {
  res.render("signUp", {
    viewTitle: "Signup",
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    viewTitle: "Login",
  });
});

router.post("/signUp", (req, res) => {
  User.findOne({ userid: req.body.userid }, (err, obj) => {
    if (obj === null) {
      var user = new User({
        role: req.body.role,
        name: req.body.name,
        phone: req.body.phone,
        userid: req.body.userid,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      });
      user.save((err) => {
        if (!err) {
          res.render("dashboard", {
            viewTitle: req.body.name,
            title: "Dashboard",
            name: req.body.name,
          });
        } else console.log("error in Signing up -> " + err);
      });
    } else {
      console.log("Username taken");
      res.render("signUp", { title: "Username taken!" });
    }
  });
});

router.post("/login", (req, res) => {
  User.findOne({ userid: req.body.userid }, (err, obj) => {
    if (!err) {
      if ((req.body.userid == "") | (req.body.password == "")) {
        if ((req.body.userid == "") & (req.body.password == ""))
          res.render("login", {
            viewTitle: "Login",
            uid: "This field is required",
            ups: "This field is required",
          });
        else {
          if (req.body.userid == "")
            res.render("login", {
              viewTitle: "Login",
              uid: "This field is required",
            });
          else if (req.body.password == "")
            res.render("login", {
              viewTitle: "Login",
              ups: "This field is required",
            });
        }
      } else if (obj == null) {
        res.render("login", {
          viewTitle: "Login",
          title: "User does not exist",
        });
      } else if (
        req.body.password != obj.password ||
        req.body.password == null
      ) {
        res.render("login", {
          viewTitle: "Login",
          title: "Incorrect Password",
        });
      } else if (req.body.password == obj.password) {
        Song.find({ _id: { $in: obj.songs } }, (err, records) => {
          if (!err) {
            res.render("dashboard", {
              viewTitle: obj.name,
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

module.exports = router;
