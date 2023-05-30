var express = require("express");
var { StripePayment } = require("../controllers/payment");

var router = express.Router();

router.post("/payment",StripePayment);

module.exports = router;
