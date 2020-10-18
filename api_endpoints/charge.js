const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const User = require("../models/User");
const auth = require("../middlewares/auth");

//======================
//Path: api/charge/secret
//Type: Privet
//Desc: Create a paymentIntent and send the client secret back
//======================
router.get("/secret/:id", auth, async (req, res) => {
  // Create a payment request here
  // Collect order info (total) from the cart to ensure the safety of the process
  try {
    const { id } = req.params;

    // retreive the cart from the user doc
    const user = await User.findById(id);

    if (!user)
      return res.status(404).json({ result: false, message: "invalid id" });

    const { cart } = user;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "usd",
      // Verify your integration in this guide by including this parameter
      metadata: { integration_check: "accept_a_payment" },
    });
  } catch (err) {
    return err;
  }
});

module.exports = router;
