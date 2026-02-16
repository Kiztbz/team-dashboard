import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
  }
}

const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema({
      email: String,
      password: String,
      role: String,
      name: String,
      phone: String,
      description: String,
      company: String
    })
  );

export default async function handler(req, res) {
  await connectDB();

  const users = await User.find({}, { password: 0 });
  res.json(users);
}
