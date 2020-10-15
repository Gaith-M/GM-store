const JWT = require("jsonwebtoken");

const create_tokens = async (user, secret_one, secret_two) => {
  // main token
  const token = await JWT.sign({ id: user._id, role: user.role }, secret_one, {
    expiresIn: "20m",
  });

  // refreash token
  const refresh_token = await JWT.sign(
    { id: user._id, role: user.role },
    secret_two + user.password,
    {
      expiresIn: "7d",
    }
  );
  return [token, refresh_token];
};

module.exports = create_tokens;
