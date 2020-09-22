const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

// =======================
// @Path: /api/user/purchase-history
// @Type: Privet
// @Desc: get purchase histroy
// =======================
router.get("/purchase-history", (req, res, next) =>
  res.json("purchase history")
);

module.exports = router;
