const User = require("../models/User");
const model_select = require("../helper_functions/model_select");
const extract_type = require("../helper_functions/extract_type");
const {
  increase_quantity,
  get_total,
  exists_in_cart,
} = require("../helper_functions/cart_helper_functions");

// =========================
// Add Item to cart
// =========================
const add_to_cart = async (req, res, next) => {
  try {
    const { product_info } = req.body || null;

    if (!product_info)
      return res
        .status(400)
        .json({ result: false, message: "Invalid Product Details" });

    let { model_id, qty, color, size } = product_info;
    if (!qty) qty = 1;

    const [type] = extract_type(model_id);

    // using the provided type, select the right model:
    const model = model_select(type);

    // Retreive the product from DB:
    const product = await model
      .findOne({ model_id })
      .select("name brand price stock model_id");

    if (!product)
      return res
        .status(404)
        .json({ result: false, message: "Product not found" });

    // Get the user from the database and check whethere the item exist in their cart or not
    const user_info = req.user;
    const { cart } = await User.findOne({ _id: user_info.id });

    // Checking if the item is in stock should be done on client side. the client should indicate that an item is out of stock, and prevent placing an order

    // check if the requested item is already in cart
    let is_in_cart = exists_in_cart(cart.items, product.name, color, size);

    if (is_in_cart) {
      // Increase the quantity of the item which matches the description
      const updated_items = increase_quantity(
        cart.items,
        product.name,
        color,
        size,
        qty
      );

      // Calculate total quantity:
      const total = get_total(updated_items);

      // update the cart
      const updated_cart = await User.findOneAndUpdate(
        { _id: user_info.id },
        {
          "cart.items": updated_items,
          "cart.total_quantity": total,
        },
        { new: true, useFindAndModify: false }
      );

      res.status(200).json({ result: "updated", updated_cart });
    } else {
      // add item to cart
      const { name, brand, price, model_id } = product;
      const item_to_add = { name, brand, price, size, color, model_id };

      // set the requested quantity
      item_to_add.quantity = qty;

      const updated_items = [...cart.items, item_to_add];

      // Calculate total quantity:
      const total = get_total(updated_items);

      const updated_cart = await User.findOneAndUpdate(
        { _id: user_info.id },
        {
          "cart.items": updated_items,
          "cart.total_quantity": total,
        },
        { new: true, useFindAndModify: false }
      );

      res.status(200).json({ result: "added", updated_cart });
    }
  } catch (err) {
    next(err);
  }
};

// =======================
// Edit Item
// =======================
const edit_item = async (req, res, next) => {
  try {
    const { product_info } = req.body || null;
    if (!product_info)
      return res
        .status(400)
        .json({ result: false, message: "Invalid Product Details" });

    const { id, colors, sizes } = product_info;
    const new_quantity = product_info.qty;

    // change the item's quantity according to the value of quantity sent by user
    const user_info = req.user;
    const { cart } = await User.findById(user_info.id).select("cart");
    // Look for the right item, then based on the difference between quantities, change it

    const new_items = cart.items.map((item) => {
      if (item.model_id === id) {
        if (new_quantity === 0) {
          return;
        } else {
          // update the item
          if (typeof new_quantity === "number" && new_quantity >= 1)
            item.quantity = new_quantity;
          if (colors) item.colors = colors;
          if (sizes) item.sizes = sizes;

          return item;
        }
      } else {
        return item;
      }
    });

    // get the new total
    const total_quantity = get_total(new_items);

    // Update the cart
    const updated_cart = await User.findOneAndUpdate(
      { _id: user_info.id },
      { "cart.total_quantity": total_quantity, "cart.items": new_items },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json(updated_cart);
  } catch (err) {
    next(err);
  }
};

// =======================
// Delete Item
// =======================
const delete_item = async (req, res, next) => {
  try {
    // Get model_id, get the user cart, loop over it, delete the item with a matching id
    const { model_id } = req.body;
    const { cart } = await User.findById(req.user.id).select("cart");

    const new_items = cart.items.filter((item) => item.model_id !== model_id);
    // get the new total
    const total_quantity = get_total(new_items);

    const updated_cart = await User.findOneAndUpdate(
      { _id: req.user.id },
      { "cart.total_quantity": total_quantity, "cart.items": new_items },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json(updated_cart);
  } catch (err) {
    next(err);
  }
};

// =======================
// Empty Cart
// =======================
const empty_cart = async (req, res, next) => {
  try {
    const update_cart = await User.findOneAndUpdate(
      { _id: req.user.id },
      { "cart.items": [], "cart.total_quantity": 0 },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json(update_cart);
  } catch (err) {
    next(err);
  }
};

// =======================
// Change the currency of the cart
// =======================
const change_currency = async (req, res, next) => {
  try {
    const { currency } = req.body;

    if (!currency)
      res.status.json({ result: false, message: "invalid currency" });

    const updated_cart = await User.findOneAndUpdate(
      { _id: req.user.id },
      { "cart.currency": currency },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json(updated_cart);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  add_to_cart,
  edit_item,
  delete_item,
  empty_cart,
  change_currency,
};
