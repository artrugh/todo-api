exports.login = (req, res, next) => {
    res.render("user/login", {
      // read signup flash message from session
      errors: req.flash("error")
    });
  };
  
  exports.signup = (req, res, next) => {
    res.render("user/signup", {
      errors: req.flash("error")
    });
  };
  
  exports.profile = (req, res, next) => {
    res.render("user/profile");
  };
  
  // Logs out the user
  
  exports.logout = (req, res) => {
    req.logout();
    res.redirect("/");
  };