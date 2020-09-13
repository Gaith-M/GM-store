const router = require("express").Router();
const passport = require("passport");
const { register } = require("../controllers/user");

// =======================
// @Path: /api/user/cart
// @Type: Privet
// @Desc: get cart data
// =======================
router.get("/cart", passport.authenticate("jwt"), (req, res, next) =>
  res.json("cart data")
);

// =======================
// @Path: /api/user/cart
// @Type: Privet
// @Desc: Add an item to the cart (based on id)
// =======================
router.post("/cart", (req, res, next) => res.json("added to cart"));

// =======================
// @Path: /api/user/cart
// @Type: Privet
// @Desc: remove an item to the cart (based on id)
// =======================
router.delete("/cart", (req, res, next) => res.json("deleted from cart"));

// =======================
// @Path: /api/user/cart
// @Type: Privet
// @Desc: update am item in the cart
// =======================
router.patch("/cart", (req, res, next) => res.json("item updated"));

// =======================
// @Path: /api/user/wishlist
// @Type: Privet
// @Desc: get wishlist data
// =======================
router.get("/wishlist", (req, res, next) => res.json("wishlist"));

// =======================
// @Path: /api/user/wishlist
// @Type: Privet
// @Desc: add wishlist data
// =======================
router.post("/wishlist", (req, res, next) => res.json("added to wishlist"));

// =======================
// @Path: /api/user/wishlist
// @Type: Privet
// @Desc: remove wishlist data
// =======================
router.delete("/", (req, res, next) => res.json("removed from wishlist"));

// =======================
// @Path: /api/user/purchase-history
// @Type: Privet
// @Desc: get purchase histroy
// =======================
router.get("/purchase-history", (req, res, next) =>
  res.json("purchase history")
);

module.exports = router;
