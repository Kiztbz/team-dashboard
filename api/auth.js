import express from "express";
import serverless from "serverless-http";

const app = express();
app.use(express.json());

app.post("/", (req, res) => {
  const { email, password } = req.body;

  if (email === "owner@test.com" && password === "123456") {
    return res.json({
      user: { email, role: "owner" }
    });
  }

  res.status(400).json({ msg: "Invalid creds" });
});

export default serverless(app);
