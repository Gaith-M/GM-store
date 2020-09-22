const express = require("express");
const router = express.Router();

router.use("/cart", require("./cart"));
router.use("/wishlist", require("./wishlist"));
router.use("/product", require("./product"));
router.use("/auth", require("./auth_OAuth"));
router.use("/admin", require("./admin"));
router.use("/purchase", require("./purchase"));

module.exports = router;
