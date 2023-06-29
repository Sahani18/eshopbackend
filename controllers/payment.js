const stripe = require("stripe")(
  "sk_test_51NCgUpSA4QKHgmwbmtWOWfUGA28DjbG6hxHJH4D7WaSHxwFNlryiUFMM6vnNTMW99hmIL0bNKuDWqCXsu8Z3gfBx00eaR0X1uh"
);
const uuid = require("uuid/v4");
const braintree = require("braintree");

/* const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "f68w6ttscw3kbmqc",
  publicKey: "7z8t3k9r36vvf3v5",
  privateKey: "47e4224bf801ef5891a96743d5a8aa8b",
}); */

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "f68w6ttscw3kbmqc",
  publicKey: "7z8t3k9r36vvf3v5",
  privateKey: "47e4224bf801ef5891a96743d5a8aa8b",
});

//TODO: Stripe payment
exports.StripePayment = (req, res) => {
  const { amount, token } = req.body;
  const idempotencyKey = uuid(); //responsible for not charging the user again
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      console.log("CHARGES",customer);
      stripe.charges
        .create(
          {
            payment_method_types: ["card"],
            amount: amount, //coz in frontend we are multiplying amt by 100 so that correct amt is displayed on stripe payment card and that is correct in backend ..no need to divide by 100
            currency: "INR",
            card: req.body.card._id,
            customer: customer.id,
            receipt_email: token.email,
            shipping: {
              name: token.card.name,
              address: {
                line_1: token.card.address_1,
                line_2: token.card.address_2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => {
          /* res.json({ client_secret: result.client_secret });
          console.log("Secret", result.client_secret);
          /* return res.send(result.client_secret); */
          return res.status(200).json(result);
        })
        .catch((err) => console.log(err));
    });
};

//TODO: Braintree/paypal payment

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      return res.status(400).send("Error generating client token:", err);
    }
    const clientToken = response.clientToken;
    return clientToken;
  });
};

exports.braintreePayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    }
  );
};
