const User = require("../models/user");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Invalid email and password",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  //CHECK VALIDATIONS
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  //FIND USER IN DB BASED ON EMAIL
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Invalid email and password",
      });
    }
    //AUTHENTICATE USER BY MATCHING PWD USING VIRTUAL FIELD WE CREATED
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email & Password do not match",
      });
    }
    //CREATE TOKEN
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //PUT TOKEN IN COOKIE
    res.cookie("token", token, { expire: new Date() + 9999  }); //for testing we kept long expiry duration of cookie
    // SEND DATA TO FRONTEND
    const { _id, name,lastname, email, role } = user;
    return res.json({ token, user: { _id, name,lastname, email, role } });
  });
};

exports.signout = (req, res) => {
  //CLEAR COOKIE NAMED TOKEN WHICH WE SET IN SIGNIN METHOD OF THE SAME NAME TOKEN
  res.clearCookie("token");
  res.json({ message: "User Signout successfully" });
};

//PROTECTED ROUTES

// this will require token to be set with bearer in authorization
//it act as a middleware..expressJwt already have next so we dont need to define manually
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth", //it work on 'req' part in (req,res) param .it add a userProperty named auth which containes userID which is of user whose token has been generated
});

//CUSTOM MIDDLEWARE

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    res.status(403).json({
      error: "You are not Admin. Access Denied",
    });
  }
  next();
};
