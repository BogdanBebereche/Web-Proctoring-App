var express = require("express");
var router = express.Router();
var authController = require("../controllers/AuthController");

REACT_APP_BASEURL = "http://localhost:3000/";

router.get(
  "/prof/login",
  (req, res, next) => {
    req.session.backUrl = req.get("Referrer");
    next();
  },
  authController.passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/prof/callback",
  authController.passport.authenticate("google", {
    scope: ["profile", "email"],
    successRedirect: "/prof/redirect",
    failureRedirect: "/prof/login",
  })
);

router.get("/prof/redirect", (req, res) => {
  res.status(301).redirect(`${REACT_APP_BASEURL}play/checkid`);
});

router.get("/prof/status", (req, res) => {
  if (req.user) {
    res.status(200).end();
  } else {
    res.status(401).end();
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).end();
});

module.exports = router;
