import mongoose from "mongoose";

let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
  }
}

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

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid login" });
    }

    return res.status(200).json({
      name: user.name,
      role: user.role
    });
  }

  res.status(405).json({ message: "Method not allowed" });
}
