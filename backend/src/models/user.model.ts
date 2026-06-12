import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		passwordHash: { type: String, required: true },
		publicKey: { type: String, required: true },
		turnkeySubOrgId: { type: String, required: true },
		turnkeyWalletId: { type: String, required: true },
	},
	{ timestamps: true },
);

export const User = mongoose.model("User", userSchema);
