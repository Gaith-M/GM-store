const { Schema, model } = require("mongoose");

const order_schema = new Schema({
  items: { type: Array, required: true },
  buyer_id: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  submitted: { type: Boolean, default: false },
});

// This will take place before charge
// Once a charge had been completed successfully, the submitted will become true

// The array of items will have the following fields for each item
// model_id, product_name, price, quantity
// discounted: this will be applied before the total is calculated. the original price will be included, the discount amount, and the price after discount which will be the one to be calculated

// How discounts will work: it will be an object inside the item object. with a Boolean value and a discount value

module.exports = model("Order", order_schema);
