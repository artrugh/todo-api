const Todo = require("../models/Todo");

// HELPERS
const { fixPrecision } = require("../lib/helpers");

// gets cart from our session
exports.get = (req, res) => {
  const { cart } = req.session;
  const { totalQty, totalPrice } = cart;
  const vat = 19;
  // fixes rounding errors
  const vatPrice = fixPrecision((totalPrice / 100) * vat);

  res.render("shop/cart", {
    title: "Robo Shop | Cart",
    items: cart.toArray(),
    totalQty,
    totalPrice,
    vat,
    vatPrice,
    finalPrice: fixPrecision(totalPrice + vatPrice)
  });
};

exports.add = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Todo.findById(id);
    req.session.cart.add(product.id, product);

    req.flash("cart-info", "Item added to cart!");

    // redirect the request back to where it was made
    res.redirect("back");
  } catch (err) {
    next(err);
  }
};

exports.remove = (req, res) => {
  // get the ID from the route params
  const { id } = req.params;

  // remove product from cart
  req.session.cart.remove(id);
  // redirect the request back to where it was made
  res.redirect("back");
};

exports.removeAll = (req, res) => {
  // get the ID from the route params
  const { id } = req.params;

  // remove entire cart item
  req.session.cart.removeAll(id);

  // redirect the request back to where it was made
  res.redirect("back");
};
