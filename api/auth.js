const mongoose = require("mongoose");

module.exports = async function handler(req, res) {
  try {
    // connect to Mongo
    await mongoose.connect(process.env.MONGO_URI);

    res.status(200).json({
      message: "MongoDB connected successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "MongoDB connection failed",
      error: error.message
    });
  }
};
