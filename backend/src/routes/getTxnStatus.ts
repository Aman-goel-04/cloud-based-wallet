import mongoose from "mongoose";
import { Transaction } from "../models/transaction.model.js";
import { authMiddleware } from "../middlewares/auth.js";
import { Router } from "express";

export const getTxnStatusRouter = Router();

getTxnStatusRouter.get("/txn", authMiddleware, async (req, res) => {
  const { id } = req.query;

  if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(404).json({ message: "Not found" });
  }

  const txn = await Transaction.findById(id);
  if (!txn) return res.status(404).json({ message: "Not found" });

  return res.status(200).json({
    signatures: txn.signature ? [txn.signature] : [],
    status: txn.status,
  });
});