var router = require("express").Router();

router.get("/", (req, res) => {
  res.render("home", { viewTitle: "Home" });
});

module.exports = router;
