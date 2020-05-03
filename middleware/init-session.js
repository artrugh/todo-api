const Cart = require("../models/Todo");

exports.initTodo = (req, res, next) => {
  req.session.Todo = new Cart(req.session.Todo);

  next();
};

exports.setLocals = (req, res, next) => {
  const isLoggedIn = req.isAuthenticated();
  res.locals.isLoggedIn = isLoggedIn;
  res.locals.session = req.session;

  if (isLoggedIn) {
    res.locals.username = req.user.email;
  }

  next();
};