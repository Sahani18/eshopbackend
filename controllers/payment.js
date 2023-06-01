const stripe = require("stripe")(
  "sk_test_51NCgUpSA4QKHgmwbMXlI5zkDR2MAgSc6jklje1xe90n2J5wdPuDDhxKiUJPddbBfomf0EXeEzxiwvFujcQHtXbBx0074XYaYpD"
);
const uuid = require("uuid/v4");
const braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "f68w6ttscw3kbmqc",
  publicKey: "7z8t3k9r36vvf3v5",
  privateKey: "47e4224bf801ef5891a96743d5a8aa8b",
});

exports.StripePayment = (req, res) => {
  const { amount, token } = req.body;
  console.log(amount);

  const idempotencyKey = uuid(); //responsible for not charging the user again

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount,
            currency: "INR",
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
          return res.status(200).json(result);
        })
        .catch((err) => console.log(err));
    });
};

exports.PaypalPayment = (req, res) => {
  const { userId, token, amount,nonce } = req.body;
  gateway.transaction
    .sale({
      amount: `${amount}`,
      paymentMethodNonce: `${nonce}`,
      options: {
        submitForSettlement: true,
      },
    })
    .then(function (result) {
      if (result.success) {
        console.log("Transaction ID: " + result.transaction.id);
      } else {
        console.error(result.message);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
};
