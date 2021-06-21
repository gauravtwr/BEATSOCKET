var router = require("express").Router();

router.get("/", (req, res) => {
  res.render("landingPage", { viewTitle: "Home" });
});

module.exports = router;
