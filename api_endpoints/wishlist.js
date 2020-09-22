const router = require("express").Router();

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
router.post("/wishlist/:id", (req, res, next) => res.json("added to wishlist"));

// =======================
// @Path: /api/user/wishlist
// @Type: Privet
// @Desc: remove wishlist data
// =======================
router.delete("/wishlist/:id", (req, res, next) =>
  res.json("removed from wishlist")
);

module.exports = router;
