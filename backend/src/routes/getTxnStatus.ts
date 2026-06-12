import { Transaction } from "../models/transaction.model.js";
import { app } from "../index.js";
import { authMiddleware } from "../middlewares/auth.js";

app.get("/api/v1/txn", authMiddleware, async (req, res) => {
  const { id } = req.query;

  const txn = await Transaction.findById(id);
  if (!txn) return res.status(404).json({ message: "Not found" });

  return res.status(200).json({
    signatures: txn.signature ? [txn.signature] : [],
    status: txn.status,
  });
});