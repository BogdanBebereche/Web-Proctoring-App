var express = require("express");
var router = express.Router();
var authController = require("../controllers/AuthController");

REACT_APP_BASEURL = "http://localhost:3000/";

router.get(
  "/login",
  (req, res, next) => {
    // We get the referrer and store it in the user session so we know where
    // to send them back to after authenticating.
    req.session.backUrl = req.get("Referrer");
    next();
  },
  authController.passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// router.get(
//   "/login",

//   authController.passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

//test
router.get("/success", (req, res) => res.send("Success"));
router.get("/failed", (req, res) => res.send("Failed"));

router.get(
  "/google/callback",
  authController.passport.authenticate("google", {
    scope: ["profile", "email"],
    successRedirect: "/redirect",
    failureRedirect: "/login",
  })
);

// //TODO: test, improve? add errors?
router.get("/redirect", (req, res) => {
  res.status(301).redirect(`${REACT_APP_BASEURL}play/quiz`);
});

router.get("/status", (req, res) => {
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
