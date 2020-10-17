const User = require("../models/User");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
// config the email which the app will send mails from
let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PW,
  },
});

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
    const refresh_token = JWT.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECONDARY_SECRET + hashed_password,
      {
        expiresIn: "7d",
      }
    );

    // set the token in the response's headers instead of sending it in the body
    res.set("Access-Control-Expose-Headers", "x-auth-token x-refresh-token");
    res.set("x-auth-token", token);
    res.set("x-refresh-token", refresh_token);

    // keep tokens in json res for now
    res.status(201).json({ result: true, token, refresh_token, user });
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
        expiresIn: "1m",
      }
    );

    const refresh_token = JWT.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECONDARY_SECRET + user.password,
      {
        expiresIn: "7d",
      }
    );

    // set the token in the response's headers instead of sending it in the body
    res.set("Access-Control-Expose-Headers", "x-auth-token x-refresh-token");
    res.set("x-auth-token", token);
    res.set("x-refresh-token", refresh_token);

    res.status(200).json({ result: true, token, refresh_token, user });
  } catch (err) {
    next(err);
  }
};

const confirmation_link_generator = async (req, res, next) => {
  try {
    // JWT to use for confirmation
    const { email, firstName, _id, confirmed } = await User.findOne({
      _id: req.user.id,
    });
    const token = JWT.sign(
      { name: firstName, id: _id },
      process.env.CONFIRMATION_SECRET,
      {
        expiresIn: "1h",
      }
    );

    if (confirmed) return res.status(200).json("Email Already Confirmed");

    const url = "http://localhost:3333/api/user/confirmation/";
    // Send email to:

    let html = `<h1 style="background-color: #333; color: #fefefe; padding: 0.5em; text-align: center">GM Store</h1>
                <h2>Hello, ${firstName}</h2>
                <p>Please, click the link below to confirm your account
                  <br>
                  <a href=${url + token}>${url + token}</a>
                </p>
                <p>The link expires within an hour</p> `;

    let info = await transporter.sendMail({
      from: '"Gaithteraacc@gmail.com"', // sender address
      to: email, // list of receivers
      subject: "Confirmation Link", // Subject line
      text: "Hello, click this link to continue", // plain text body
      html, // html body
    });

    res.status(200).json("Email Sent Successfully");
  } catch (err) {
    next(err);
  }
};

// update user email to a confirmed email
const update_to_confirmed = async (req, res, next) => {
  try {
    const { token } = req.params;

    const is_valid = JWT.verify(token, process.env.CONFIRMATION_SECRET);

    if (!is_valid) return res.status(400).json("Invalid Token");

    // Update user's email to confirmed status
    await User.findOneAndUpdate({ _id: is_valid.id }, { confirmed: true });

    res
      .status(200)
      .json({ result: true, message: "Email Confirmed Successfully" });
  } catch (err) {
    next(err);
  }
};

// ====================
// request password reset controller
// ====================
const request_password_reset = async (req, res, next) => {
  try {
    // Validate Inputs
    const validation_result = validationResult(req);

    if (!validation_result.isEmpty()) {
      return res.json({
        result: false,
        errors: validation_result.array({ onlyFirstError: true }),
      });
    }

    // The user sends the email used in his profile. if it's valid, send password reset link
    const { email } = req.body;

    const is_user = await User.findOne({ email });

    if (!is_user)
      return res.status(400).json({ result: false, message: "Invalid Email" });

    //Create password reset link
    const token = JWT.sign(
      { email: is_user.email, id: is_user.id },
      process.env.PASSWORD_RESET_SECRET,
      { expiresIn: "1hr" }
    );

    const url = `http://localhost:3333/api/user/reset_password/${token}`;

    let html = `<h1 style="background-color: #333; color: #fefefe; padding: 0.5em; text-align: center">GM Store</h1>
                <h2>Hello, ${is_user.firstName}</h2>
                <p>You have requested a password reset. click the link below to reset it.
                  <br>
                  <a href=${url}>${url}</a>
                </p>
                <p>The link expires within an hour</p> `;

    let info = await transporter.sendMail({
      from: '"Gaithteraacc@gmail.com"', // sender address
      to: is_user.email, // list of receivers
      subject: "GM Store: Password Recovery", // Subject line
      text: "Password Recovery", // plain text body
      html, // html body
    });

    res.status(200).json({ result: true, message: "Email sent successfully" });
  } catch (err) {
    next(err);
  }
};

// ====================
// reset password controller
// ====================

const reset_password = async (req, res, next) => {
  try {
    // Validate Inputs
    const validation_result = validationResult(req);

    if (!validation_result.isEmpty()) {
      return res.json({
        result: false,
        errors: validation_result.array({ onlyFirstError: true }),
      });
    }

    //  Verify the token and procced if it's valid
    const token = req.params.token;
    const new_password = req.body.password;

    const is_valid = JWT.verify(token, process.env.PASSWORD_RESET_SECRET);

    if (!is_valid)
      return res.status(400).json({ result: false, message: "invalid token" });

    // Hash the new password
    const hashed_password = await bcrypt.hash(new_password, 10);

    await User.findOneAndUpdate(
      { email: is_valid.email },
      { password: hashed_password },
      { useFindAndModify: false }
    );

    res
      .status(200)
      .json({
        result: true,
        message: "password has been changed successfully",
      });
  } catch (err) {
    next(err);
  }
};

// ===================
// Export controllers
// ===================
module.exports = {
  register,
  login,
  confirmation_link_generator,
  update_to_confirmed,
  request_password_reset,
  reset_password,
};
