const router = require("express").Router();

// =======================
// @Path: /api/user/
// @Type: Privet
// @Desc: get cart data
// =======================
router.get("/cart", (req, res, next) => res.json("cart data"));

// =======================
// @Path: /api/user/cart
// @Type: Privet
// @Desc: Add an item to the cart (based on id)
// =======================
router.post("/cart/:id", (req, res, next) => res.json("added to cart"));

// =======================
// @Path: /api/user/cart
// @Type: Privet
// @Desc: remove an item to the cart (based on id)
// =======================
router.delete("/cart/:id", (req, res, next) => res.json("deleted from cart"));

// =======================
// @Path: /api/user/cart
// @Type: Privet
// @Desc: update am item in the cart
// =======================
router.patch("/cart/:id", (req, res, next) => res.json("item updated"));

module.exports = router;
