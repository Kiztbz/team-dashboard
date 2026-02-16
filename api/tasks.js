import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGO_URI);
  isConnected = true;
}

const Task =
  mongoose.models.Task ||
  mongoose.model(
    "Task",
    new mongoose.Schema({
      title: String,
      description: String,
      assignedTo: String,   // team email
      client: String,       // client email
      status: {
        type: String,
        default: "todo" // todo | progress | done
      }
    })
  );

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { role, email } = req.query;

    let tasks;

    if (role === "owner") tasks = await Task.find();
    if (role === "team") tasks = await Task.find({ assignedTo: email });
    if (role === "client") tasks = await Task.find({ client: email });

    return res.json(tasks);
  }

  if (req.method === "POST") {
    const task = await Task.create(req.body);
    return res.json(task);
  }

  if (req.method === "PUT") {
    const { id, status } = req.body;

    await Task.findByIdAndUpdate(id, { status });
    return res.json({ msg: "Updated" });
  }
}
