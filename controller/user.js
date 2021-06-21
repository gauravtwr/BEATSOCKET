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
      });
      if (req.body.password !== req.body.confirmPassword) {
        res.render("signUp", {
          viewTitle: "Signup",
          title: "Passwords does not match",
        });
      } else {
        user.save((err) => {
          if (!err) {
            Song.find((err, songs) => {
              var role = 0;
              if (user.role == "Artist") role = 1;
              res.render("dashboard", {
                viewTitle: req.body.name,
                title: "Dashboard",
                name: req.body.name,
                role: role,
                songs: songs,
                user: user,
              });
            });
          } else console.log("error in Signing up -> " + err);
        });
      }
    } else {
      console.log("Username taken");
      res.render("signUp", { viewTitle: "Signup", title: "Username taken!" });
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
        Song.find({ _id: { $in: obj.uploads } }, (err, records) => {
          if (!err) {
            Song.find((err, songs) => {
              Song.find({ "likes.1": { $exists: true } }, (err, popular) => {
                if (!err) {
                  var role = 0;
                  if (obj.role == "Artist") role = 1;
                  res.render("dashboard", {
                    viewTitle: obj.name,
                    title: "Dashboard",
                    user: obj,
                    uploads: records,
                    songs: songs,
                    role: role,
                    popular,
                  });
                } else console.log(err);
              });
            });
          }
        });
      }
    } else console.log("Error in signing in");
  });
});

router.get("/playlist/:uid/:sid", (req, res) => {
  User.findOne(
    { _id: req.params.uid, playlist: req.params.sid },
    (err, doc) => {
      if (!doc) {
        User.findByIdAndUpdate(
          req.params.uid,
          { $push: { playlist: req.params.sid } },
          (err, user) => {
            Song.find((err, songs) => {
              Song.find({ _id: { $in: user.uploads } }, (err, records) => {
                var role = 0;
                if (user.role == "Artist") role = 1;
                res.render("dashboard", {
                  viewTitle: user.name,
                  title: "Dashboard",
                  user: user,
                  role: role,
                  songs: songs,
                  uploads: records,
                  playlist: 0,
                });
              });
            });
          }
        );
      } else {
        User.findByIdAndUpdate(
          req.params.uid,
          { $pull: { playlist: req.params.sid } },
          (err, user) => {
            Song.find((err, songs) => {
              Song.find({ _id: { $in: user.uploads } }, (err, records) => {
                var role = 0;
                if (user.role == "Artist") role = 1;
                res.render("dashboard", {
                  viewTitle: user.name,
                  title: "Dashboard",
                  user: user,
                  role: role,
                  songs: songs,
                  uploads: records,
                  playlist: 1,
                });
              });
            });
          }
        );
      }
    }
  );
});

module.exports = router;
