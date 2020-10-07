const { Schema, model } = require("mongoose");

const dress_schema = new Schema({
  model_id: { type: String, required: true, unique: true },
  sex: { type: String, required: true, default: "women" },
  category: { type: String, required: true },
  name: { type: String, required: true, trim: true, maxlength: 150 },
  brand: { type: String, trim: true, maxlength: 150 },
  description: { type: Array, required: true },
  price: { type: Number, required: true, trim: true },
  currency: { type: String, default: "usd" },
  discount: { discounted: { type: Boolean }, amount: { type: Number } },
  stock: {
    type: Array,
    required: true,
  },
  // reviews and rating will empty to begin with
  reviews: [String],
  rating: {
    one: { type: Number, default: 0 },
    two: { type: Number, default: 0 },
    three: { type: Number, default: 0 },
    four: { type: Number, default: 0 },
    five: { type: Number, default: 0 },
    overall: { type: Number, default: 0 },
  },
  post_date: { type: Date, default: Date.now() },
});

module.exports = model("Dress", dress_schema);
