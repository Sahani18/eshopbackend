const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    lastname: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    userInfo: {
      type: String,
      trim: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
    wishlist: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// Here we dont want our pwd to get stored in plain text. But we cant tell user to enter
// hased or encrypted pwd . So we are creating a virtual field that will collect info from user
// and on the go encrypt the pwd and store in our db

// also we are storing the salt which is getting generated by uuid and the same salt will be stored in our db(as we have defined in our schema) so everytime the user login we can use the same
// salt and match the pwd with the encrypted pwd stored in our db

// ## Virtual fields are created either on the go or they are computed using the values user are already passing
userSchema
  .virtual("password")
  .set(function (password) {
    //save the pwd in private variable
    this._password == password;
    //generate salt using uuid and store in salt in db to encrypt & match pwd later
    this.salt = uuidv1();
    //fill encry_pwd with encrypted password
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

// create schema method
userSchema.methods = {
  //pass the entered password and encrypt it..and match it with the saved encrypted passsword
  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) == this.encry_password;
  },

  // encrypt the password
  securePassword: function (plainPassword) {
    if (!plainPassword) return " ";

    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      return " ";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
