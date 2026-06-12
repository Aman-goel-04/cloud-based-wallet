import type { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { app } from "../index.js";
import { turnkey } from "../turnkey.js";
import bcrypt from "bcrypt" 
import { authMiddleware } from "../middlewares/auth.js";
import { Transaction } from "../models/transaction.model.js";

app.post("/api/v1/signup", async (req: Request, res: Response) => {
    const { username, password } = (req.body as any) ?? {};

    const existingUser = await User.findOne({
        username 
    });

    if(existingUser){
        return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const subOrgResponse = await turnkey.apiClient().createSubOrganization({
    subOrganizationName: `user-${username}-${Date.now()}`,
    rootUsers: [
      {
        userName: username,
        apiKeys: [],
        authenticators: [],
        oauthProviders: [],
      },
    ],
    rootQuorumThreshold: 1,
    wallet: {
      walletName: `wallet-${username}`,
      accounts: [
        {
          curve: "CURVE_ED25519",
          pathFormat: "PATH_FORMAT_BIP32",
          path: "m/44'/501'/0'/0'",
          addressFormat: "ADDRESS_FORMAT_SOLANA",
        },
      ],
    },
  });

  const subOrgId = subOrgResponse.subOrganizationId;
  const walletId = subOrgResponse.wallet?.walletId!;
  const publicKey = subOrgResponse.wallet?.addresses?.[0]!;

  await User.create({
    username,
    passwordHash,
    publicKey,
    turnkeySubOrgId: subOrgId,
    turnkeyWalletId: walletId,
  });

  return res.status(200).json({ publicKey });
});

app.get("/api/v1/txn", authMiddleware, async (req, res) => {
  const { id } = req.query;

  const txn = await Transaction.findById(id);
  if (!txn) return res.status(404).json({ message: "Not found" });

  return res.status(200).json({
    signatures: txn.signature ? [txn.signature] : [],
    status: txn.status,
  });
});