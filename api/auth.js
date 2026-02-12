const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// connect mongo once
let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
  }
}

// user model
const User = mongoose.models.User || mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["client", "team_member", "admin", "owner"],
      default: "client"
    }
  })
);

module.exports = async function handler(req, res) {
  await connectDB();

  // TEST ROUTE
  if (req.method === "GET") {
    return res.status(200).json({
      message: "MongoDB connected successfully"
    });
  }

  // CREATE USER
  if (req.method === "POST") {
    try {
      const { name, email, password, role } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashed,
        role
      });

      return res.status(201).json({
        message: "User created",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    } catch (err) {
      return res.status(500).json({
        message: "Error creating user",
        error: err.message
      });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
};
