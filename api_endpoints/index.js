const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/product", require("./product"));
router.use("/auth", require("./auth_OAuth"));
router.use("/admin", require("./admin"));
router.use("/purchase", require("./purchase"));

module.exports = router;
