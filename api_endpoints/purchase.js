const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
router.get("/", auth, (req, res, next) => res.send("success"));

module.exports = router;
