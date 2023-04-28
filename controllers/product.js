const Product = require("../models/product");
const formidable = require("formidable"); //to store multimedia file in DB
const _ = require("lodash"); //as given in documentation
const fs = require("fs"); // to access the path location of file
const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("catagory") //we want to populate product based on catagory
    .exec((error, product) => {
      if (error) {
        res.json({
          message: "No Product found",
        });
      }
      res.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      res.status(400).json({
        message: "Problem with Image",
      });
    }

    //destructure the fields that are coming from model to check for validation

    const { name, description, price, catagory, stock } = fields;
    //validation check or you can use express validator in route that is best method
    if (!name || !description || !price || !catagory || !stock) {
      return res.status(400).json({
        message: "Please include all the fields",
      });
    }

    let product = new Product(fields);

    //handle photo
    if (file.photo) {
      if (file.photo.size > 3000000) {
        //we are setting not more than 3MB approx
        return res.status(400).json({
          message: "File size above 3MB",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = product.photo.type;
    }
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          message: "Saving T-shirt in DB failed",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  //so that the bulky photo may not take time and we can quickly parse and send json data
  req.product.photo = undefined;
  return res.json(req.product);
};

//middleware to get photo so that our application is fast when we call getProduct
// this is done for performance optimization
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        message: "Failed to delete product",
      });
    }
    res.json({
      message: "Deletion Successfull",
    });
  });
};

//Plan to update- load all info from DB--> display as a form in frontend with loaded data-->let user edit those info-->save to DB

exports.updateProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      res.status(400).json({
        message: "Problem with Image",
      });
    }

    //updation code
    let product = req.product;
    //here we are using lodash to update our product object before updation
    // basically it combines all the individual objects into a single object we can use other method like spread operator etc
    product = _.extend(product, fields); // lodash

    //handle photo
    if (file.photo) {
      if (file.photo.size > 3000000) {
        //we are setting not more than 3MB approx
        return res.status(400).json({
          message: "File size above 3MB",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = product.photo.type;
    }
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          message: "Updation of product failed",
        });
      }
      res.json(product);
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo") //-photo means we dont want to display photo coz it will become bulky
    .populate("catagory")
    .limit(limit) // we are limiting the no of result
    .sort([[sortBy, "asc"]]) //sort syntax- [[sortBy,"what conditon"]]
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          message: "No product found",
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCatagories = (req, res) => {
  Product.distinct("catagory", {}, (err, catagory) => {
    if (err) {
      res.send(400).json({
        error: "No Catagory Found",
      });
    }
    res.json(catagory);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      UpdateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, product) => {
    if (err) {
      res.send(400).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};
