const JWT = require("jsonwebtoken");

const create_tokens = (user, secret_one, secret_two) => {
  // main token
  const token = JWT.sign({ id: user._id }, secret_one, { expiresIn: "20m" });

  // refreash token
  const refresh_token = JWT.sign({ id: user._id }, secret_two + user.password, {
    expiresIn: "7d",
  });

  return [token, refresh_token];
};

module.exports = create_tokens;
