import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGO_URI);
  isConnected = true;
}

const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema({
      email: String,
      password: String,
      role: String
    })
  );

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  await connectDB();

  const { email, password } = req.body;

  // 🔹 check user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      msg: "User not found. Contact owner/admin."
    });
  }

  // 🔹 check password
  if (user.password !== password) {
    return res.status(400).json({
      msg: "Invalid credentials"
    });
  }

  // 🔹 success
  res.json(user);
}
