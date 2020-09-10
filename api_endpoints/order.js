const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => console.log("Requested orders"));

module.exports = router;
