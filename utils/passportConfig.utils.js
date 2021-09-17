const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const usersModel = require("../models/users.model");
const { validatePass } = require("./password.utils");

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      user = await usersModel.getUserByEmail(username);
      if (!user) {
        return done(null, false, {
          message: req.flash("error", "Email Not Found"),
        });
      }
      if (!validatePass(password, user.hash, user.salt)) {
        return done(null, false, {
          message: req.flash("error", "Incorrect Password"),
        });
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  const user = await usersModel.getUserByEmail(email);
  done(null, user);
});

module.exports = passport;
