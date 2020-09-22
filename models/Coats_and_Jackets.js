const { Schema, model } = require("mongoose");

const coats_and_jackets_schema = new Schema({
  model_id: { type: String, required: true, unique: true },
  sex: { type: String, required: true },
  category: { type: String, required: true },
  name: { type: String, required: true, trim: true, maxlength: 150 },
  brand: { type: String, trim: true, maxlength: 150 },
  description: { type: Array, required: true },
  price: { type: Number, required: true, trim: true },
  discount: { discounted: { type: Boolean }, amount: { type: Number } },
  photos: [String],
  sizes: [Object],
  colors: [Object],
  quantity: { type: Number, required: true },
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

module.exports = model("CoatsAndJackets", coats_and_jackets_schema);
