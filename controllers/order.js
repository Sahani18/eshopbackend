const { Order, ProductCart } = require("../models/order"); //coz we r throwing 2 models in order.js

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price") //we are picking 1 product & bringing 2 info name & price from them
    .exec((err, order) => {
      if (err) {
        res.status(400).json({
          error: "Order not found",
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      res.status(400).json({
        error: "Order not saved in DB",
      });
    }
    res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "name _id")
    .exec((err, order) => {
      if (err) {
        res.status(400).json({
          error: "No order found",
        });
      }
      res.json(order);
    });
};

exports.getOrderStatus = (req, res) => {
  return res.json(Order.Schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        res.status(400).json({
          error: "Cannot update order status",
        });
      }
      res.json(order);
    }
  );
};
