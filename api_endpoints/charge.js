const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const User = require("../models/User");
const auth = require("../middlewares/auth");
const calculate_total = require("../helper_functions/calculate_total_cost");
const model_select = require("../helper_functions/model_select");
const extract_type = require("../helper_functions/extract_type");

//======================
//Path: api/charge/secret
//Type: Privet
//Desc: Create a paymentIntent and send the client secret back
//======================
router.get("/secret", auth, async (req, res) => {
  // Create a payment request here
  // Collect order info (total) from the cart to ensure the safety of the process
  try {
    const { id } = req.user;

    // retreive the cart from the user doc
    const user = await User.findById(id);

    if (!user)
      return res.status(404).json({ result: false, message: "invalid id" });

    const { cart } = user;

    // calculate total cost of items
    let total_amount = calculate_total(cart.items);

    if (cart.currency === "usd") total_amount *= 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total_amount,
      currency: cart.currency,
      // Verify your integration in this guide by including this parameter
      metadata: { integration_check: "accept_a_payment" },
    });

    // update the products' stock to reflect the new quantity:
    // this should happen in a loop and send a request for each purchased item (within the cart and got purchased)

    for (item of cart.items) {
      const { model_id, color, size, quantity } = item;

      const [type] = extract_type(model_id);
      const model = model_select(type);

      const product = await model.findOne({ model_id }).select("stock");

      // create an updated stock object
      let updated_stock = product.stock.map((varity) => {
        if (varity.size === size) {
          // should send a notifcation
          if (varity.color_and_quantity[color] - quantity <= 0) {
            // send a notifcation that this varity is out of stock
            return varity;
          }

          // decrease the correct quantity by the amount requested
          varity.color_and_quantity[color] =
            varity.color_and_quantity[color] - quantity;

          return varity;
        } else {
          return varity;
        }
      });

      const updated = await model.findOneAndUpdate(
        { model_id },
        { $set: { stock: updated_stock } },
        { new: true, useFindAndModify: false }
      );
    }

    res.status(200).json(paymentIntent.client_secret);
  } catch (err) {
    return err;
  }
});

module.exports = router;
