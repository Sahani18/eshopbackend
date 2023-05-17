const User = require("../models/user");
const Order = require("../models/order");

//to populate req.profile using params
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  //we dont want to display the sensitive info of user so we're making undefined in users profile not in DB
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "Not Authorized to Update",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  //whenever we're referencing something another collection we use populate
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: "No Order in this account",
        });
      }
      res.json(order);
    });
};

//MIDDLEWARE
exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      id: product._id,
      name: product.name,
      description: product.description,
      catagory: product.catagory,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });
  //store this in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: { purchase: purchases } },
    { new: true }, // send me the updated object from db not the old one
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list",
        });
      }
      next();
    }
  );
};

exports.pushOrderInWishList = (req, res, id) => {
  // TODO:
};
