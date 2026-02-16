import mongoose from "mongoose";

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

const Task =
  mongoose.models.Task ||
  mongoose.model(
    "Task",
    new mongoose.Schema({
      title: String,
      assignedTo: String,
      status: String,
      progress: Number
    })
  );

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const tasks = await Task.find();
    return res.json(tasks);
  }

  if (req.method === "POST") {
    const task = await Task.create(req.body);
    return res.json(task);
  }

  if (req.method === "PUT") {
    const task = await Task.findByIdAndUpdate(
      req.query.id,
      req.body,
      { new: true }
    );
    return res.json(task);
  }

  res.status(405).json({ msg: "Method not allowed" });
}
