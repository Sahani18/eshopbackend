var express = require("express");
var router = express.Router();
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");
const {
  getOrderById,
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateStatus
} = require("../controllers/order");

router.param("orderId", getOrderById);
router.param("userId", getUserById);

router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);

router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

//status for user
router.get("order/status/:userId",isSignedIn, isAuthenticated, isAdmin,getOrderStatus)
router.put("order/:orderId/status/:userId",isSignedIn, isAuthenticated, isAdmin,updateStatus)

module.exports = router;
