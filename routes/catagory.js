var express = require("express");
var router = express.Router();
const {
  getCatagoryById,
  createCatagory,
  getAllCatagory,
  getCatagory,
  updateCatagory,
  removeCatagory,
} = require("../controllers/catagory");
const { getUserById } = require("../controllers/user");
const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");

router.param("catagoryId", getCatagoryById);
router.param("userId", getUserById);

router.post(
  "/catagory/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCatagory
);

router.get("/catagory/:catagoryId", getCatagory);
router.get("/catagories", getAllCatagory);

router.put(
  "/catagory/update/:catagoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCatagory
);

router.delete(
  "/catagory/remove/:catagoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCatagory
);

module.exports = router;
