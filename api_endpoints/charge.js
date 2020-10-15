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
  // There is two options here: checkout via cart, and direct checkout
  // if by cart:
  // Retreive the selected currency from the user document
  // Retreive the items' IDs and their quantities from the cart
  // query the DB for their price, and then send the request to stripe
  // if directly:
  // The id of the product will be sent in an object inside the body of the request.
  // req.body.directBuy.id this will be checked first. if directBuy === undefinied, then it must be checkout via the cart

  // since this is a get request... I can;t send data to it..... maybe I can let other route call it?
  try {
    const id = req.body.directBuy.id || null;
    console.log(id);
    let total_amount;
    if (!id) {
      const { cart } = await User.findById(req.user.id).select("cart");
      console.log(cart);
      // retrieve the cart from the user document
      total_amount = cart.items.reduce((item) => {
        return item.quantityl;
      }, 0);
    }

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
