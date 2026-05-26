import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies; // or req.headers.authorization
    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};