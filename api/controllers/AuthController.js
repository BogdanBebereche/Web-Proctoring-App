const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../models/database");
require("./AuthController");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3002/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let [user, created] = await db.Students.findOrCreate({
          where: {
            id: profile._json.sub,
            email: profile._json.email,
          },
        });
        done(null, user);
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let student = await db.Students.findByPk(id);
    done(null, student);
  } catch (error) {
    done(error);
  }
});

module.exports.checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("Not authenticated.");
  }
};

module.exports.passport = passport;
