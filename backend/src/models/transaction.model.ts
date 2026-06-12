import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			enum: ["processing", "success", "failed"],
			default: "processing",
		},
		signature: { type: String, default: null },
		rawTxn: { type: String, required: true },
	},
	{ timestamps: true },
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
