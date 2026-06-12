import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { app } from "../index.js";

app.post("/api/v1/signin", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Incorrect credentials" });
  }

  const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return res.status(200).json({ jwt: token });
});