const mongoose = require("mongoose");

const DB_URL = "mongodb://localhost:27017/vidcast-db";

async function connectToDatabase() {
  try {
    await mongoose.connect(DB_URL);
    console.log("DB connect");
  } catch (err) {
    console.log("DB connect error");
    console.error(err);
  }
}

module.exports = connectToDatabase;
