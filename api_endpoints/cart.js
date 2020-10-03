const router = require("express").Router();
const {
  add_to_cart,
  edit_item,
  delete_item,
  empty_cart,
  change_currency,
} = require("../controllers/cart");
const auth = require("../middlewares/auth");
const User = require("../models/User");
// =======================
// @Path: /api/cart
// @Type: Privet
// @Desc: add an item to the cart
// =======================
router.post("/", auth, add_to_cart, delete_item);

// =======================
// @Path: /api/cart/id
// Fix cart if broken when I'm working on it
// =======================
router.post("/fix/:id", async (req, res, next) => {
  console.log("recieved!");
  try {
    const { id } = req.params;
    const user = await User.findOneAndUpdate(
      { _id: id },
      { "cart.items": [] },
      { new: true, useFindAndModify: false }
    );
    console.log(user);
    res.status(200).json("done");
  } catch (err) {
    next(err);
  }
});

// =======================
// @Path: /api/cart
// @Type: Privet
// @Desc: increase the amount of a product
// =======================
router.patch("/", auth, edit_item);

// =======================
// @Path: /api/cart
// @Type: Privet
// @Desc: update am item in the cart
// =======================
router.delete("/", auth, delete_item);

// =======================
// @Path: /api/cart/all
// @Type: Privet
// @Desc: Empty all items from the cart
// =======================
router.delete("/all", auth, empty_cart);

// =======================
// @Path: /api/cart/all
// @Type: Privet
// @Desc: Empty all items from the cart
// =======================
router.patch("/change_currency", auth, change_currency);

module.exports = router;
