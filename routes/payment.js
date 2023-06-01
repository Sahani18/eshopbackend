const express = require("express");
const { StripePayment, PaypalPayment } = require("../controllers/payment");
const { isAuthenticated, isSignedIn } = require("../controllers/auth");

var router = express.Router();
router.param("userId", getUserById);

router.post("/payment/stripe", StripePayment);
router.post(
  "/payment/paypal/:userId",
  isAuthenticated,
  isSignedIn,
  PaypalPayment
);

module.exports = router;
