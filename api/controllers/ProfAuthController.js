// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const db = require("../models/database");
// //require("./ProfAuthController");
// require("dotenv").config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID_PROF,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET_PROF,
//       callbackURL: "http://localhost:3002/google/prof/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let [user, created] = await db.Professors.findOrCreate({
//           where: {
//             id: profile._json.sub,
//             email: profile._json.email,
//           },
//         });
//         done(null, user);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     let professor = await db.Professors.findByPk(id);
//     done(null, professor);
//   } catch (error) {
//     done(error);
//   }
// });

// module.exports.checkAuth = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     res.status(401).send("Not authenticated.");
//   }
// };

// module.exports.passport = passport;
