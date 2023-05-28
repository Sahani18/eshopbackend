var express = require("express");
var { StripePayment } = require("../controllers/payment");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
var router = express.Router();

router.post("/payment",isSignedIn,isAuthenticated, StripePayment);

module.exports = router;
