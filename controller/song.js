var router = require("express").Router();
const Song = require("../models/song");
const User = require("../models/user");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const upload = multer({ dest: "D:/BEATSOCKET/public/audio" });

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

router.post("/upload/:uid", upload.single("file"), (req, res) => {
  User.findById(req.params.uid, (err, user) => {
    if (!err) {
      if (req.body.title == null) {
        res.render("song", {
          viewTitle: "Song upload",
          user: user,
          titleError: "Enter title",
        });
      }
      const tempPath = req.file.path;
      const targetPath = path.join(
        `D:/BEATSOCKET/public/audio/${req.body.title}.mp3`
      );
      if (path.extname(req.file.originalname).toLowerCase() == ".mp3") {
        fs.rename(tempPath, targetPath, (err) => {
          if (!err) {
            console.log(req.body.durationm + " mins " + req.body.durations);
            var min = req.body.durationm * 60;
            var duration = parseInt(min) + parseInt(req.body.durations);
            var song = new Song({
              title: req.body.title,
              duration: duration,
              language: req.body.language,
              genre: req.body.genre,
              artist: req.params.uid,
            });
            song.media.data = fs.readFileSync(
              `D:/BEATSOCKET/public/audio/${req.body.title}.mp3`
            );
            song.media.contentType = "audio/mpeg";
            song.save((err) => {
              if (!err) {
                user.update(user.uploads.push({ _id: song._id }));
                User.findByIdAndUpdate(req.params.uid, user, (err) => {
                  if (err) console.log("user not updated with new song");
                  else {
                    Song.find(
                      { _id: { $in: user.uploads } },
                      (err, records) => {
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
                      }
                    );
                  }
                });
              } else console.log(err);
            });
          } else console.log(err);
        });
      } else {
        fs.unlink(tempPath, (err) => {
          if (!err) console.log("Only mp3 files are allowed");
          else console.log(err);
        });
      }
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
              User.findById(song.artist, (err, artist) => {
                res.render("playSong", {
                  viewTitle: user.name,
                  title: "Play Song",
                  song: song,
                  user: user,
                  artist: artist,
                });
              });
            });
          } else console.log(err);
        }
      );
    } else {
      User.findById(req.params.uid, (err, user) => {
        Song.findById(req.params.sid, (err, song) => {
          User.findById(song.artist, (err, artist) => {
            res.render("playSong", {
              viewTitle: user.name,
              title: "Play Song",
              song: song,
              user: user,
              artist: artist,
            });
          });
        });
      });
    }
  });
});

router.get("/calcView/:uid/:sid/:time", (req, res) => {
  Song.findById(req.params.sid, (err, song) => {
    var viewTime = parseInt(song.duration) * 0.3;
    if (req.params.time >= viewTime) {
      song.update(song.views++);
      Song.findByIdAndUpdate(req.params.sid, song, (err) => {
        if (!err) {
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
        } else console.log(err);
      });
    } else {
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
  });
});

module.exports = router;
