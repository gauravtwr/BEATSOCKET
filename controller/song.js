var router = require("express").Router();
const Song = require("../models/song");
const User = require("../models/user");

router.get("/upload/:uid", (req, res) => {
  User.findById(req.params.uid, (err, user) => {
    if (!err) {
      res.render("song", {
        viewTitle: "Song upload",
        user: user,
      });
    } else console.log(err);
  });
});

router.post("/upload/:uid", (req, res) => {
  User.findById(req.params.uid, (err, user) => {
    if (!err) {
      if (req.body.title == null) {
        res.render("song", {
          viewTitle: "Song upload",
          user: user,
          titleError: "Enter title",
        });
      }
      var song = new Song({
        title: req.body.title,
        duration: req.body.duration,
        language: req.body.language,
        genre: req.body.genre,
        artist: req.params.uid,
      });
      song.save((err) => {
        if (!err) {
        } else console.log(err);
      });
      user.update(user.uploads.push(song._id));
      User.findByIdAndUpdate(req.params.uid, user, (err) => {
        if (err) console.log("user not updated with new song");
        else {
          Song.find({ _id: { $in: user.uploads } }, (err, records) => {
            Song.find((err, songs) => {
              var role = 0;
              if (user.role == "Artist") role = 1;
              res.render("dashboard", {
                viewTitle: user.name,
                title: user.name,
                user: user,
                uploads: records,
                songs: songs,
                role: role,
              });
            });
          });
        }
      });
    } else console.log(err);
  });
});

router.get("/delete/:uid/:sid", (req, res) => {
  User.findById(req.params.uid, (err, user) => {
    if (!err) {
      user.update(user.uploads.pull({ _id: req.params.sid }));
      Song.findByIdAndRemove(req.params.sid, (err) => {
        if (err) console.log(err);
      });
      User.findByIdAndUpdate(req.params.uid, user, (err) => {
        if (err) console.log("user not updated with deleted song");
        else {
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
              });
            });
          });
        }
      });
    }
  });
});

router.get("/like/:uid/:sid", (req, res) => {
  Song.findOne({ _id: req.params.sid, likes: req.params.uid }, (err, doc) => {
    if (!doc) {
      Song.findByIdAndUpdate(
        req.params.sid,
        { $push: { likes: req.params.uid } },
        (err, song) => {
          Song.find((err, songs) => {
            User.findById(req.params.uid, (err, user) => {
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
                });
              });
            });
          });
        }
      );
    } else {
      Song.findByIdAndUpdate(
        req.params.sid,
        { $pull: { likes: req.params.uid } },
        (err, song) => {
          Song.find((err, songs) => {
            User.findById(req.params.uid, (err, user) => {
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
                });
              });
            });
          });
        }
      );
    }
  });
});

router.get("/play/:uid/:sid", (req, res) => {
  User.findOne({ _id: req.params.uid, history: req.params.sid }, (err, doc) => {
    if (!doc) {
      User.findByIdAndUpdate(
        req.params.uid,
        { $push: { history: req.params.sid } },
        (err, user) => {
          if (user) {
            Song.findById(req.params.sid, (err, song) => {
              res.render("playSong", {
                viewTitle: "Play song",
                song: song,
                user: user,
              });
            });
          } else console.log(err);
        }
      );
    } else {
      User.findById(req.params.uid, (err, user) => {
        Song.findById(req.params.sid, (err, song) => {
          res.render("playSong", {
            viewTitle: "Play song",
            song: song,
            user: user,
          });
        });
      });
    }
  });
});

module.exports = router;
