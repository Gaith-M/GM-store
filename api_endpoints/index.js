const router = require("express").Router();

router.use("/cart", require("./cart"));
router.use("/wishlist", require("./wishlist"));
router.use("/product", require("./product"));
router.use("/auth", require("./auth_OAuth"));
router.use("/admin", require("./admin"));
router.use("/order", require("./order"));

module.exports = router;
