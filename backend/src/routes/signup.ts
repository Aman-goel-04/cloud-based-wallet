import { Router, type Request, type Response } from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { getTurnkey } from "../turnkey.js";
import crypto from "crypto";

const ecdh = crypto.createECDH("prime256v1");
ecdh.generateKeys();
const userPublicKey = ecdh.getPublicKey("hex", "compressed");

export const signupRouter = Router();

signupRouter.post("/signup", async (req: Request, res: Response) => {
	const { username, password } = (req.body as any) ?? {};

	const existingUser = await User.findOne({
		username,
	});

	if (existingUser) {
		return res.status(400).json({ message: "User already exists" });
	}

	const passwordHash = await bcrypt.hash(password, 10);

	const subOrgResponse = await getTurnkey()
		.apiClient()
		.createSubOrganization({
			subOrganizationName: `user-${username}-${Date.now()}`,
			rootUsers: [
				{
					userName: username,
					apiKeys: [
						{
							apiKeyName: `${username}-key`,
							publicKey: userPublicKey,
							curveType: "API_KEY_CURVE_P256",
						},
					],
					authenticators: [],
					oauthProviders: [],
				},
				{
					userName: "backend-signer",
					apiKeys: [
						{
							apiKeyName: "backend-api-key",
							publicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
							curveType: "API_KEY_CURVE_P256",
						},
					],
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
