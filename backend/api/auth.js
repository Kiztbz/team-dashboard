const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

// Mongo connect
mongoose.connect(process.env.MONGO_URI);

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

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role
  });

  res.json({ msg: "User created", user });
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "No user" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
});

module.exports = serverless(app);
