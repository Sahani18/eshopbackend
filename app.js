require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// ROUTES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const catagoryRoute = require("./routes/catagory");
const productRoute=require("./routes/product")
const orderRoute=require("./routes/order")

// DB CONNECTION
mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch(() => {
    console.log("OOPSS !! SOMETHING WENT WRONG");
  });

// PORT

const port = 7000;

// MIDDLEWARES
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// MY ROUTES
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", catagoryRoute);
app.use("/api", productRoute);
app.use("/api", orderRoute);


// STARTING A SERVER

app.listen(port, () => {
  console.log(`Server is Up & Running at ${port}`);
});
