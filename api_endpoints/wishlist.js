const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  toggle_item_in_wishlist,
  clear_wishlist,
} = require("../controllers/wishlist");

// =================================
// The Wishlist is a part of the user model and endpoints. however, it has been placed in a different file for easier managment
// =================================

// =======================
// The wish list will be retreived as a part of the user document
// =======================

// =======================
// @Path: /api/wishlist
// @Type: Privet
// @Desc: add wishlist data
// =======================
router.post("/", auth, toggle_item_in_wishlist);

// =======================
// @Path: /api/wishlist
// @Type: Privet
// @Desc: clear  wishlist data
// =======================
router.delete("/", auth, clear_wishlist);

module.exports = router;
