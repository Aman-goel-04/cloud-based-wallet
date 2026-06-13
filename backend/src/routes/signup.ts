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
	console.log("heyy");
	const { username, password } = (req.body as any) ?? {};

	const existingUser = await User.findOne({
		username,
	});

	if (existingUser) {
		return res.status(400).json({ message: "User already exists" });
	}

	const passwordHash = await bcrypt.hash(password, 10);

	// response object
	// const response = await (turnkey as any).apiClient().createSubOrganization({
	// 	subOrganizationName: "<string> (Name for this sub-organization)",
	// 	rootUsers: [
	// 		{
	// 			// Root users to create within this sub-organization,
	// 			userName: "<string> (Human-readable name for a User.)",
	// 			userEmail: "<string> (The user's email address.)",
	// 			userPhoneNumber:
	// 				"<string> (The user's phone number in E.164 format e.g. +13214567890)",
	// 			apiKeys: [
	// 				{
	// 					// A list of API Key parameters. This field, if not needed, should be an empty array in your request body.,
	// 					apiKeyName:
	// 						"<string> (Human-readable name for an API Key.)",
	// 					publicKey:
	// 						"<string> (The public component of a cryptographic key pair used to sign messages and transactions.)",
	// 					curveType: "<API_KEY_CURVE_P256>", // curveType field,
	// 					expirationSeconds:
	// 						"<string> (Optional window (in seconds) indicating how long the API Key should last.)",
	// 				},
	// 			],
	// 			authenticators: [
	// 				{
	// 					// A list of Authenticator parameters. This field, if not needed, should be an empty array in your request body.,
	// 					authenticatorName:
	// 						"<string> (Human-readable name for an Authenticator.)",
	// 					challenge:
	// 						"<string> (Challenge presented for authentication purposes.)",
	// 					attestation: {
	// 						// attestation field,
	// 						credentialId:
	// 							"<string> (The cbor encoded then base64 url encoded id of the credential.)",
	// 						clientDataJson:
	// 							"<string> (A base64 url encoded payload containing metadata about the signing context and the challenge.)",
	// 						attestationObject:
	// 							"<string> (A base64 url encoded payload containing authenticator data and any attestation the webauthn provider chooses.)",
	// 						transports: "<AUTHENTICATOR_TRANSPORT_BLE>", // The type of authenticator transports.,
	// 					},
	// 				},
	// 			],
	// 			oauthProviders: [
	// 				{
	// 					// A list of Oauth providers. This field, if not needed, should be an empty array in your request body.,
	// 					providerName:
	// 						"<string> (Human-readable name to identify a Provider.)",
	// 					oidcToken: "<string> (Base64 encoded OIDC token)",
	// 					oidcClaims: {
	// 						// oidcClaims field,
	// 						iss: "<string> (The issuer identifier from the OIDC token (iss claim))",
	// 						sub: "<string> (The subject identifier from the OIDC token (sub claim))",
	// 						aud: "<string> (The audience from the OIDC token (aud claim))",
	// 					},
	// 				},
	// 			],
	// 		},
	// 	],
	// 	rootQuorumThreshold: 0, // The threshold of unique approvals to reach root quorum. This value must be less than or equal to the number of root users,
	// 	wallet: {
	// 		// wallet field,
	// 		walletName: "<string> (Human-readable name for a Wallet.)",
	// 		accounts: [
	// 			{
	// 				// A list of wallet Accounts. This field, if not needed, should be an empty array in your request body.,
	// 				curve: "<CURVE_SECP256K1>", // curve field,
	// 				pathFormat: "<PATH_FORMAT_BIP32>", // pathFormat field,
	// 				path: "<string> (Path used to generate a wallet Account.)",
	// 				addressFormat: "<ADDRESS_FORMAT_UNCOMPRESSED>", // addressFormat field,
	// 			},
	// 		],
	// 		mnemonicLength: 0, // Length of mnemonic to generate the Wallet seed. Defaults to 12. Accepted values: 12, 15, 18, 21, 24.,
	// 	},
	// 	disableEmailRecovery: true, // Disable email recovery for the sub-organization,
	// 	disableEmailAuth: true, // Disable email auth for the sub-organization,
	// 	disableSmsAuth: true, // Disable OTP SMS auth for the sub-organization,
	// 	disableOtpEmailAuth: true, // Disable OTP email auth for the sub-organization,
	// 	verificationToken:
	// 		"<string> (Signed JWT containing a unique id, expiry, verification type, contact)",
	// 	clientSignature: {
	// 		// clientSignature field,
	// 		publicKey:
	// 			"<string> (The public component of a cryptographic key pair used to create the signature.)",
	// 		scheme: "<CLIENT_SIGNATURE_SCHEME_API_P256>", // scheme field,
	// 		message: "<string> (The message that was signed.)",
	// 		signature:
	// 			"<string> (The cryptographic signature over the message.)",
	// 	},
	// });

	console.log(
		"DEBUG PUB:",
		JSON.stringify(process.env.TURNKEY_API_PUBLIC_KEY),
	);
	console.log(
		"DEBUG PRIV:",
		JSON.stringify(process.env.TURNKEY_API_PRIVATE_KEY),
	);
	console.log("DEBUG PUB len:", process.env.TURNKEY_API_PUBLIC_KEY?.length);
	console.log("DEBUG PRIV len:", process.env.TURNKEY_API_PRIVATE_KEY?.length);

	const whoami = await getTurnkey().apiClient().getWhoami({});
	console.log(whoami);

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
