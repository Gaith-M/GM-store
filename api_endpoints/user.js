const router = require("express").Router();
const { body } = require("express-validator");
const {
  confirmation_link_generator,
  update_to_confirmed,
  request_password_reset,
  reset_password,
} = require("../controllers/user");
const auth = require("../middlewares/auth");

// =========================
// @Path: /api/user/confirmation
// @Type Privet
// @Desc Send a confirmation mail to the user
// =========================
router.get("/confirmation", auth, confirmation_link_generator);

// =========================
// @Path: /api/user/confirmation
// @Type Privet
// @Desc Send a confirmation mail to the user
// =========================
router.get("/confirmation/:token", auth, update_to_confirmed);

// =========================
// @Path: /api/user/forgot_password
// @Type public
// @Desc request a password reset link if user forgot password
// =========================
router.post(
  "/forgot_password",
  body("email").exists().isEmail().withMessage("A valid email is required"),
  request_password_reset
);

// =========================
// @Path: /api/user/reset_password/:token
// @Type Privet
// @Desc change the password for a user
// =========================
router.post(
  "/reset_password/:token",
  body("password").exists().withMessage("Please, provide a new password"),
  reset_password
);

module.exports = router;
