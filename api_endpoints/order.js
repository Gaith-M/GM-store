const router = require("express").Router();
const auth = require("../middlewares/auth");
const has_role = require("../middlewares/has_role");

// =======================
// @Path: /api/order
// @Type: Privet
// @Desc: create a new order and add it to history (after a successful checkout)
// =======================
router.post("/", auth, (req, res, next) => res.json("Order"));

// =======================
// @Path: /api/order/admin
// @Type: Privet
// @Desc: get the full history of orders for admins. it allows data aggregation and filteration
// =======================
router.post("/", auth, has_role("admin"), (req, res, next) =>
  res.json("Order")
);

// =======================
// @Path: /api/order/orders-history
// @Type: Privet
// @Desc: get the order histroy for a user
// =======================
router.get("/orders-history", auth, (req, res, next) =>
  res.json("Orders history")
);

module.exports = router;
