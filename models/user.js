const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
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
  password: { type: String, required: true, minlength: 8 },
  cart: {
    type: Object,
    items: [Object],
    total: Number,
  },
  wish_list: [Object],
  orders: [Object],
  purchase_history: [Object],
  facebookID: String,
  googleID: String,
  instagramID: String,
  register_date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("User", user_schema);
