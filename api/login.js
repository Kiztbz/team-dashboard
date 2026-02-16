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
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  await connectDB();

  const { email, password } = req.body;

  let user = await User.findOne({ email });

  // if user not found → auto create
  if (!user) {
    user = await User.create({
      email,
      password,
      role: "team"
    });
  }

  if (user.password !== password)
    return res.status(400).json({ msg: "Invalid credentials" });

  res.json(user);
}
