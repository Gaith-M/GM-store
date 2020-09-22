const JWT = require("jsonwebtoken");
const create_tokens = require("./create_tokens");

const new_tokens = async (model, refresh_token, secret_one, secret_two) => {
  try {
    // get the id from the refresh token
    const { id } = JWT.decode(refresh_token);

    if (id) {
      const user = await model.findOne({ _id: id });
      if (!user) return {};

      const refresh_secret = secret_two + user.password;

      JWT.verify(refresh_token, refresh_secret);

      const [new_token, new_refresh_token] = await create_tokens(
        user,
        secret_one,
        secret_two
      );

      return {
        token: new_token,
        refresh_token: new_refresh_token,
        user,
      };
    }
  } catch (err) {
    return {};
  }
};

module.exports = new_tokens;
