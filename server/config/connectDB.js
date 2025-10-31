const mongoose = require("mongoose");
require("dotenv").config();

const mongoUrl = process.env.MONGO_URI;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB is connected Successfully!!!");
  } catch (error) {
    console.log("MongoDB failed to connect");
  }
};

module.exports = connectMongoDB;

