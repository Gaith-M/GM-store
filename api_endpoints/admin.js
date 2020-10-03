const router = require("express").Router();
const has_role = require("../middlewares/has_role");
const auth = require("../middlewares/auth");
const User = require("../models/User");

// =============================
// @Path /api/admin/dashboard
// @Type: Privet
// @Desc: admin dashboard
// =============================
router.post("/dashboard", auth, has_role("admin"), (req, res, next) => {
  res.status(200).json("Welcome, admin");
});

module.exports = router;
