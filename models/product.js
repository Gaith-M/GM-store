const mongoose = require("mongoose");

const product_schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 150 },
  brand: { type: String, trim: true, maxlength: 150 },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, trim: true },
  discounted: { type: Boolean, amount: Number },
  url: [String],
  colors: [Object],
  sizes: [Object],
  in_stock: Boolean,
  quantity: Number,
  reviews: [String],
  rating: {
    type: Object,
    one: Number,
    two: Number,
    three: Number,
    four: Number,
    five: Number,
    overall: Number,
  },
});

module.exports = mongoose.model("Product", product_schema);
