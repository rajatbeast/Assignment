import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this";

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!["teacher", "student"].includes(role))
      return res.status(400).json({ message: "Invalid role" });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, passwordHash, role });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "8h",
    });
    res.json({
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

export { register, login };
