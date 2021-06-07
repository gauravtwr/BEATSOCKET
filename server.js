require("dotenv/config");
const express = require("express");
const path = require("path");
const exphand = require("express-handlebars");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const homeController = require("./controller/home");
const userController = require("./controller/user");
const songController = require("./controller/song");

var app = express();
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(bodyparser.json());
app.use(methodOverride("_method"));

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

// mongoose.connect(
//   process.env.MONGODB_URI,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   },
//   (err) => {
//     if (!err) {
//       console.log("Database connected");
//       // const conn = mongoose.createConnection(process.env.MONGODB_URI);
//       // let gfs;
//       // conn.once("open", () => {
//       //   gfs = Grid(conn.db, mongoose.mongo);
//       //   gfs.collection("uploads");
//       //   console.log("Database connected");
//       // });
//     } else console.log(err);
//   }
// );

// const storage = new GridFsStorage({
//   url: process.env.MONGODB_URI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) return reject(err);
//         const filename = buf.toString("hex") + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: "uploads",
//         };
//         resolve(fileInfo);
//       });
//     });
//   },
// });
// const upload = multer({ storage });

app.use("/", homeController);
app.use("/user", userController);
app.use("/song", songController);
