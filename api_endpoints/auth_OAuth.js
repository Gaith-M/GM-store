const router = require("express").Router();
const passport = require("passport");
const { body } = require("express-validator");
const { register, login } = require("../controllers/user");
const JWT = require("jsonwebtoken");

// =======================
// @Path: /api/auth/register
// @Type: Public
// @Desc: Register a user
// =======================
router.post(
  "/register",
  body("firstName", "first name is required").exists(),
  body("lastName", "last name is required").exists(),
  body("email", "invalid email")
    .exists()
    .withMessage("email is required")
    .isEmail()
    .isLength({ min: 10 }),
  body("password", "password is requried and must be longer than 6 characters")
    .exists()
    .isLength({ min: 6, max: 40 }),
  register
);

// =======================
// @Path: /api/auth
// @Type: Public
// @Desc: login a user in
// =======================
router.post(
  "/",
  body("email", "invalid email")
    .exists()
    .withMessage("email is required")
    .isEmail()
    .isLength({ min: 10 }),
  body("password", "password is requried and must be longer than 6 characters")
    .exists()
    .isLength({ min: 6, max: 40 }),
  login
);

// =======================
// @Path: /api/auth/facebook
// @Type: public
// @Desc: register or login a user using FB
// =======================
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// =========================
// Fackbook callback endpoint
// =========================
router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  async (req, res) => {
    const token = JWT.sign({ email: req.user.email }, process.env.JWT_SECRET, {
      expiresIn: "3hr",
    });
    res.status(200).json({ token, user: req.user });
  }
);

// =========================
// @Path: /api/auth/google
// @Type public
// @Desc register or login a user using Google
// =========================
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// =========================
// Google Callback endpoint
// =========================
router.get(
  "/google/callback",
  passport.authenticate("google"),
  async (req, res) => {
    const token = JWT.sign({ email: req.user.email }, process.env.JWT_SECRET, {
      expiresIn: "3hr",
    });
    res.json({ user: req.user, token });
  }
);

module.exports = router;
