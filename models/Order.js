const { Schema, model } = require("mongoose");

const order_schema = new Schema({
  model_id: { type: String, required: true },
  product_name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  discounted: { type: Boolean, required: true },
  buyer_id: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: Date, default: Date.now() },
});

module.exports = model("Order", order_schema);
