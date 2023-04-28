var express = require("express");
const { signup, signin,signout, isSignedIn } = require("../controllers/auth");
const { check } = require("express-validator");

var router = express.Router();

//sign Up
router.post(
  "/signup",
  [
    check("name", "Name should be atleast 3 char").isLength({ min: 3 }),
    check("email", "Valid Email is required").isEmail(),
    check("password", "Password should be atleast 6 char").isLength({ min: 6 }),
  ],
  signup
);

//sign IN
router.post(
  "/signin",
  [
    check("email", "Valid Email is required").isEmail(),
    check("password", "Valid password field is required").isLength({ min: 3 }),
  ],
  signin
);

// sign out
router.get("/signout",signout);

router.get("/test",isSignedIn,(req,res)=>{
  res.send("a protected route")
}
)

module.exports = router;
