const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { validationResult } = require("express-validator");

// Helpers
const { capitalize } = require("./helpers");

// MODELS
const User = require("./../models/User");

// GLOBAL CONFIG

// configure passport to only save the user ID into session
passport.serializeUser((user, done) => {
  // calls the done middleware to finalize the serialization, first arg is null
  done(null, user.id);
});

// configure passport to get the user back from session
passport.deserializeUser(async (id, done) => {
  try {
    // find the user by ID
    const user = await User.findById(id);
    // Call the done middleware with our user object
    done(null, user);
  } catch (err) {
    // call the error handling middleware
    done(err);
  }
});

// STRATEGIES

const strategyConfig = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true
};

// Define a strategy for signup
passport.use(
  "local.signup",
  new LocalStrategy(strategyConfig, async (req, email, password, done) => {
    const errors = validationResult(req).formatWith(error =>
      capitalize(`${error.param} ${error.msg}`)
    );

    if (!errors.isEmpty()) {
      const messages = errors.array();
      return done(null, false, req.flash("error", messages));
    }

    try {
      // create a new user
      const user = await new User({ email, password }).save();
      // If successful redirect to a success page
      done(null, user);
    } catch (err) {
      // check for unique field error from Mongo
      if (err.name === "MongoError" && err.code === 11000) {
        return done(null, false, { message: `${email} already exists.` });
      }
    }
    return done(err);
  })
);

// define strategy for login
passport.use(
  "local.login",
  new LocalStrategy(strategyConfig, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user || !(await user.authenticate(password))) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

module.exports = passport;