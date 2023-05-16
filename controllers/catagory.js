const Catagory = require("../models/catagory");

exports.getCatagoryById = (req, res, next, id) => {
  Catagory.findById(id).exec((error, catagory) => {
    if (error || !catagory) {
      res.status(400).json({
        error: "No Catagory Found",
      });
    }
    req.catagory = catagory;
    next();
  });
};

exports.createCatagory = (req, res) => {
  const catagory = new Catagory(req.body);
  catagory.save((err, cate) => {
    if (err || !catagory) {
      res.status(400).json({
        error: "Failed to create catagory",
      });
    }
    res.json(cate);
  });
};

exports.getCatagory = (req, res) => {
  res.json(req.catagory);
};

exports.getAllCatagory = (req, res) => {
  Catagory.find().exec((err, catagories) => {
    if (err || !catagories) {
      res.status(400).json({
        error: "No Catagory Found",
      });
    }
    res.json(catagories);
  });
};

exports.updateCatagory = (req, res) => {
  //req.catagory is generated from above middleware getCatagoryById just like req.profile was populated
  const catagory = req.catagory;
  //grab the catagory name passed from frontend
  catagory.name = req.body.name;
  //coz we already have the catagory object from getCatagoryById
  catagory.save((err, updatedCatagory) => {
    if (err) {
      res.status(400).json({
        error: "Catagory updation failed",
      });
    }
    res.json(updatedCatagory);
  });
};

exports.removeCatagory = (req, res) => {
  const catagory = req.catagory;
  catagory.remove((err, catagory) => {
    if (err) {
      res.status(400).json({
        error: "Failed to delete catagory",
      });
    }
    res.json({
      message: `Deleted ${catagory.name} Successfully`,
    });
  });
};
