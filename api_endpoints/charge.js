const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

//======================
//Path: api/charge/secret
//Type: Privet
//Desc: Create a payment-intent and send the client secret back
//======================
router.get("/secret", async (req, res) => {
  // To make this correctly, I have to retrieve the data from the user object as follows:
  // Retreive the selected currency from the user document
  // Retreive the items' IDs and their quantities from the cart
  // query the DB for their price, and then send the request to stripe
  try {
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
