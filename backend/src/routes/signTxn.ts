import { Router, type Request, type Response } from "express";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { User } from "../models/user.model.js";
import { Transaction } from "../models/transaction.model.js";
import { getTurnkey } from "../turnkey.js";
import { authMiddleware } from "../middlewares/auth.js";

export const signTxnRouter = Router();


signTxnRouter.post("/txn/sign", authMiddleware, async (req: Request, res: Response) => {
  const { message, retry } = req.body;
  const user = await User.findById(req.userId);

  const txnRecord = await Transaction.create({
    userId: user!._id,
    status: "processing",
    rawTxn: message,
  });

  processTransaction(txnRecord._id.toString(), user!, message);

  return res.status(200).json({ id: txnRecord._id.toString() });
});

async function processTransaction(txnId: string, user: any, message: string) {
  try {
    const connection = new Connection(`${process.env.SOLANA_RPC_URL!}`);

    const txnBuffer = Buffer.from(message, "base64");
    const transaction = VersionedTransaction.deserialize(txnBuffer);

    const signResponse = await (getTurnkey as any)
      .apiClientForOrganization(user.turnkeySubOrgId)
      .signTransaction({
        signWith: user.publicKey,
        unsignedTransaction: txnBuffer.toString("hex"),
        type: "TRANSACTION_TYPE_SOLANA",
      });

    const signedTxnBytes = Buffer.from(signResponse.signedTransaction, "hex");
    const signedTxn = VersionedTransaction.deserialize(signedTxnBytes);

    const signature = await connection.sendTransaction(signedTxn);
    await connection.confirmTransaction(signature);

    await Transaction.findByIdAndUpdate(txnId, {
      status: "success",
      signature,
    });
  } catch (err) {
    console.error(err);
    await Transaction.findByIdAndUpdate(txnId, { status: "failed" });
  }
}