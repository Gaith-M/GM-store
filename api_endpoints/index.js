const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/product", require("./product"));
router.use("/auth", require("./auth_OAuth"));

module.exports = router;
