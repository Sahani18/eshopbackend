const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 32,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 32,
      required: true,
    },
    price: {
      type: Number,
      maxlength: 32,
      required: true,
      trim: true,
    },
    catagory: {
      type: ObjectId,
      ref: "Catagory",
      require: true,
    },
    stock: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
