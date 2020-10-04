const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const User = require("../models/User");
const auth = require("../middlewares/auth");
//======================
//Path: api/charge/secret
//Type: Privet
//Desc: Create a payment-intent and send the client secret back
//======================
router.get("/secret", auth, async (req, res) => {
  // To make this correctly, I have to retrieve the data from the user object as follows:
  // Retreive the selected currency from the user document
  // Retreive the items' IDs and their quantities from the cart
  // query the DB for their price, and then send the request to stripe
  try {
    // retrieve the cart from the user document
    const { cart } = await User.findById(req.user.id).select("cart");
    const total_amount = cart.items.reduce((item) => {
      return item.quantityl;
    }, 0);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: "usd",
      metadata: { integration_check: "accept_a_payment" },
    });
    res.status(200).json(paymentIntent.client_secret);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
