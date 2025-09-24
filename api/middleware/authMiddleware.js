import jwt from "jsonwebtoken";
import User from "../models/User.js";
const JWT_SECRET = process.env.JWT_SECRET || "change_this";

const auth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "No token" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(payload.sub).select("-passwordHash");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export { auth };
