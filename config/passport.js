const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const LocalStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });

        if (!user) {
          return done(null, false, { error_msg: "Username does not exist!" });
        }
        const match = await bcrypt.compare(password, user.password);

        if (match) {
          //login
          return done(null, user, { success_msg: "Login successfully!" });
        } else {
          return done(null, false, { error_msg: "Wrong password!" });
        }
      } catch (err) {
        return done(null, false, err.message);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
