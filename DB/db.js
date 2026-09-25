const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Berhasil terhubung ke MongoDB!");
  } catch (error) {
    console.error("Gagal terhubung ke MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectToMongoDB;
