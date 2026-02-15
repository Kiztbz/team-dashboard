const jwt = require("jsonwebtoken");

if (req.method === "GET") {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    return res.status(200).json({ user });

  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
