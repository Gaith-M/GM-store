const { Schema, model } = require("mongoose");

const purchase_schema = new Schema({
  product_id: String,
  product_name: String,
  price: Number,
  quantity: Number,
  buyer: String,
  date: { type: Date, default: Date.now() },
});

module.exports = model("Purchase", purchase_schema);
