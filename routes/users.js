const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

// Middleware
const { restrictAccess, publicOnly } = require("../middleware/access");

const passport = require("../lib/auth");

const userController = require("../controllers/user");

router.get(
  "/logout",
  restrictAccess({
    failureRedirect: "/user/profile"
  }),
  userController.logout
);

router.get(
  "/profile",
  restrictAccess({
    failureRedirect: "/user/signup"
  }),
  userController.profile
);

router.use(
  publicOnly({
    failureRedirect: "/"
  })
);
router
  .route("/signup")
  .get(userController.signup)
  .post(
    check("email")
      .not()
      .isEmpty()
      .isEmail()
      .withMessage("must be a valid email address"),
    check("password")
      .not()
      .isEmpty()
      .isLength({ min: 8 })
      .withMessage("must be at least 8 characters long")
      .matches(/[a-z]/)
      .withMessage("must contain lowercase letters")
      .matches(/[A-Z]/)
      .withMessage("must contain uppercase letters")
      .matches(/\d/)
      .withMessage("must contain numbers")
      .matches(/[@$!%*?&]/)
      .withMessage("must contain a special character (@, $, !, %, *, ?, &)"),
    passport.authenticate("local.signup", {
      successRedirect: "/user/profile",
      failureRedirect: "/user/signup",
      // enable flash messages
      failureFlash: true
    })
  );

router
  .route("/login")
  .get(userController.login)
  .post(
    check("email")
      .not()
      .isEmpty()
      .isEmail()
      .withMessage("must be a valid email address"),
    check("password")
      .not()
      .isEmpty(),
    passport.authenticate("local.login", {
      successRedirect: "/user/profile",
      failureRedirect: "/user/login",
      // enable flash messages
      failureFlash: true
    })
  );

router.get("/profile", userController.profile);

module.exports = router;