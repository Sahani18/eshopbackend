const stripe = require("stripe")(
  "sk_test_51NCgUpSA4QKHgmwbMXlI5zkDR2MAgSc6jklje1xe90n2J5wdPuDDhxKiUJPddbBfomf0EXeEzxiwvFujcQHtXbBx0074XYaYpD"
);
const uuid = require("uuid/v4");

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
