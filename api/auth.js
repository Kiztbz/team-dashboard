const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
  }
}

// User model
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

  // LOGIN
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        token
      });

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      return res.status(500).json({
        message: "Server login error",
        error: err.message
      });
    }
  }

  // VERIFY TOKEN
  if (req.method === "GET") {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      return res.status(200).json({ user });

    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
};
