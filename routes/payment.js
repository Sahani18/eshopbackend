const express = require("express");
const { StripePayment, braintreePayment,getToken } = require("../controllers/payment");
const { isAuthenticated, isSignedIn } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");


var router = express.Router();


router.get("/payment/gettoken/:userId", isAuthenticated, isSignedIn, getToken);

router.post("/payment/stripe", StripePayment);
router.post(
  "/payment/braintree/:userId",
  isAuthenticated,
  isSignedIn,
  braintreePayment
);

module.exports = router;
