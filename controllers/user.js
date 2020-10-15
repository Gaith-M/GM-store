const User = require("../models/User");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

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
    // This object is used to config the email which the app will send from
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PW,
      },
    });

    // JWT to use for confirmation
    const { email, firstName } = await User.findOne({ _id: req.user.id });
    const token = JWT.sign(
      { name: firstName },
      process.env.CONFIRMATION_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const url = "http://localhost:3333/api/user/confirmation/";
    // Send email to:
    let info = await transporter.sendMail({
      from: '"Gaithteraacc@gmail.com"', // sender address
      to: email, // list of receivers
      subject: "Confirmation Link", // Subject line
      text: "Hello, click this link to continue", // plain text body
      html: `<h1>Hello, ${firstName}</h1> <p>Please click the link below to confirm your email</p> <a href=${
        url + token
      }>${url + token}</a>`, // html body
    });

    res.status(200).json("Email Sent Successfully");
  } catch (err) {
    next(err);
  }
};

// update user email to a confirmed email
const update_to_confirmed = async (req, res, next) => {
  try {
    res.status(200).json("done");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  confirmation_link_generator,
  update_to_confirmed,
};
