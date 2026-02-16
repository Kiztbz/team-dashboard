import mongoose from "mongoose";

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
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
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const { email, password } = req.body;

  let user = await User.findOne({ email });

  // auto-create user if not exist
  if (!user) {
    user = await User.create({
      email,
      password,
      role: "team_member"
    });
  }

  if (user.password !== password) {
    return res.status(400).json({ msg: "Wrong password" });
  }

  res.json(user);
}
