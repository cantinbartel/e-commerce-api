require('dotenv').config();
const router = require('express').Router();
// const stripe = require('stripe')('sk_test_51Ibiw9Le9pTjvrT7pEUlcpQ7Gcjz71HG1hpwzUDz8kUJ0iG7Q5pD9pa17rBydJvSc31N9lc82o0qzl7KiKgDImOQ005RiVSFFm');
const stripe = require('stripe')(process.env.STRIPE_KEY);

router.post('/payment', async (req, res) => {
    console.log('process.env.STRIPE_KEY: ', process.env.STRIPE_KEY)
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "eur",
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            res.status(500).json(stripeErr);
        } else {
            res.status(200).json(stripeRes);
        }
    });
});

module.exports = router;
