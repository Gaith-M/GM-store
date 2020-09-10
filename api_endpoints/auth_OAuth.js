const router = require("express").Router();
const passport = require("passport");
const { body, check } = require("express-validator");
const { register, login } = require("../controllers/user");

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
// @Path: /api/user/auth
// @Type: Privet
// @Desc: Authenticate and Authorize a user
// =======================
// router.get("/", (req, res, next) => res.json("auth"));

// =========================
// Google Authentication Routes
// =========================
// router.post("/");

// =========================
// Facebook Authentication Routes
// =========================
// router.post("/");

// =========================
// Instagram Authentication Routes
// =========================
// router.post("/");

module.exports = router;
