const { Schema, model } = require("mongoose");

const user_schema = new Schema({
  role: { type: String, default: "user" },
  facebookID: String,
  googleID: String,
  firstName: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    maxlength: 99,
  },
  password: { type: String, minlength: 8 },
  cart: {
    currency: { type: String, default: "usd" },
    total_quantity: { type: Number, default: 0 },
    items: { type: Array, default: [Object] },
  },
  wishlist: [String],
  orders_history: { type: Array, required: true },
  register_date: { type: Date, default: Date.now() },
});

module.exports = model("User", user_schema);
