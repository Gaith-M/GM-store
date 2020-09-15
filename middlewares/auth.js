const JWT = require("jsonwebtoken");
const User = require("../models/user");
const new_tokens = require("../helper_functions/new_tokens");

// stop the process if the main token is invalid (not just expired, but wrong)
const auth = async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (token) {
    try {
      // check if token is valid:
      const decoded = JWT.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      // if the code reaches here, it means the token supplied was invalid (expired most likely)
      // so the refresh process will take place here
      const old_refresh_token = req.headers["x-refresh-token"];

      if (!old_refresh_token)
        return res
          .status(403)
          .json({ result: false, msg: "please, login to continue" });

      const { token, refresh_token, user } = await new_tokens(
        User,
        old_refresh_token,
        process.env.JWT_SECRET,
        process.env.JWT_SECONDARY_SECRET
      );

      if (token && refresh_token) {
        res.set(
          "Access-Control-Expose-Headers",
          "x-auth-token x-refresh-token"
        );
        res.set("x-auth-token", token);
        res.set("x-refresh-token", refresh_token);

        req.user = user;
        next();
      }
    }
  } else {
    // if there is no token, block user from going further
    return res
      .status(401)
      .json({ result: false, msg: "please, login to continue" });
  }
};

module.exports = auth;
