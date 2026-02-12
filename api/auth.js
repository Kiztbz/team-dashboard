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

  // health check
  if (req.method === "GET") {
    return res.status(200).json({ message: "API running" });
  }

  // LOGIN ONLY
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          name: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          name: user.name,
          role: user.role,
          email: user.email
        }
      });

    } catch (err) {
      return res.status(500).json({
        message: "Login error",
        error: err.message
      });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
};
