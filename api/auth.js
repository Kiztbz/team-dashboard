import express from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

// Mongo connect (cached for serverless)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
};

// User model
const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String
    })
  );

// LOGIN ROUTE
app.post("/", async (req, res) => {
  try {
    await connectDB();

    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ msg: "Invalid creds" });
    }

    res.json({
      msg: "Login success",
      user
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

export default serverless(app);
