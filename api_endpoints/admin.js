const router = require("express").Router();
const is_admin = require("../middlewares/is_admin");
const passport = require("passport");
const User = require("../models/user");

// =============================
// @Path /api/admin/dashboard
// @Type: Privet
// @Desc: admin dashboard
// =============================
router.post(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  is_admin("admin"),
  (req, res, next) => {
    console.log(req.headers["x-auth-token"], req.headers["x-refreash-token"]);
    res.status(200).json("Welcome, admin");
  }
);

module.exports = router;
