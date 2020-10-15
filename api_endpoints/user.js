const router = require("express").Router();
const {
  confirmation_link_generator,
  update_to_confirmed,
} = require("../controllers/user");
const auth = require("../middlewares/auth");

// =========================
// @Path: /api/auth/confirmation
// @Type Privet
// @Desc Send a confirmation mail to the user
// =========================
router.get("/confirmation", auth, confirmation_link_generator);

// =========================
// @Path: /api/auth/confirmation
// @Type Privet
// @Desc Send a confirmation mail to the user
// =========================
router.get("/confirmation/:token", auth, update_to_confirmed);

module.exports = router;
