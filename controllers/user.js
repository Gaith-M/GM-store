const User = require("../models/user");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

// ==================
// Register Controller
// ==================
const register = async (req, res, next) => {
  // Validate Inputs
  const validation_result = validationResult(req);

  if (!validation_result.isEmpty()) {
    return res.json({
      result: false,
      errors: validation_result.array({ onlyFirstError: true }),
    });
  }

  try {
    const { firstName, lastName, email, password, role } = req.body;

    // check if email exists
    const is_available = await User.findOne({ email });
    if (is_available)
      return res.json({ result: false, msg: "email is unavailable" });

    const hashed_password = bcrypt.hashSync(password, 10);

    const new_user = new User({
      role,
      firstName,
      lastName,
      email,
      password: hashed_password,
    });

    const user = await new_user.save();

    const token = JWT.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "20min",
      }
    );
    const refreash_token = JWT.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECONDARY_SECRET + user.password,
      {
        expiresIn: "7d",
      }
    );

    // set the token in the response's headers instead of sending it in the body
    res.set("Access-Control-Expose-Headers", "x-auth-token x-refreash-token");
    res.set("x-auth-token", token);
    res.set("x-refreash-token", refreash_token);

    // keep tokens in json res for now
    res.status(201).json({ result: true, token, refreash_token, user });
  } catch (err) {
    next(err);
  }
};

// ==================
// login Controller
// ==================
const login = async (req, res, next) => {
  const validation_result = validationResult(req);

  if (!validation_result.isEmpty()) {
    return res.json({
      result: false,
      errors: validation_result.array({ onlyFirstError: true }),
    });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json("invliad email");

    const is_valid_password = bcrypt.compareSync(password, user.password);
    if (!is_valid_password) return res.json("invalid password");

    const token = JWT.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "20m",
      }
    );

    const refreash_token = JWT.sign(
      { id: user._id, user: user.role },
      process.env.JWT_SECONDARY_SECRET + user.password,
      {
        expiresIn: "7d",
      }
    );

    // set the token in the response's headers instead of sending it in the body
    res.set("Access-Control-Expose-Headers", "x-auth-token x-refreash-token");
    res.set("x-auth-token", token);
    res.set("x-refreash-token", refreash_token);

    res.status(200).json({ result: true, token, refreash_token, user });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};
