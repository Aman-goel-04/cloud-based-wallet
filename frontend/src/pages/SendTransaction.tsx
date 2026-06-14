import {
	Connection,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	Transaction,
} from "@solana/web3.js";
import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { instance } from "../api/client";

function SendTransaction() {
	const [recipient, setRecipient] = useState<string>("");
	const [amount, setAmount] = useState<number>();
	const [status, setStatus] = useState<
		"idle" | "processing" | "success" | "failed"
	>("idle");
	const [signature, setSignature] = useState<string | null>();
	const [error, setError] = useState<string | null>();

	// from address
	const { publicKey } = useAuth();

	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "recipient") {
			setRecipient(value);
		} else {
			setAmount(Number(value));
		}
	};

	const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		// validate recipient's id:
		try {
			new PublicKey(recipient);
		} catch{
			setError("Invalid Address");
			return;
		}

		async function processTxn() {
			try {
				const connection = new Connection(
					import.meta.env.VITE_RPC_ENDPOINT,
				);
				const { blockhash } = await connection.getLatestBlockhash();

				const txn = new Transaction({
					recentBlockhash: blockhash,
					feePayer: new PublicKey(publicKey!),
				}).add(
					SystemProgram.transfer({
						fromPubkey: new PublicKey(publicKey!),
						toPubkey: new PublicKey(recipient),
						lamports: amount! * LAMPORTS_PER_SOL,
					}),
				);

				// serialize thetxn
				const message = txn
					.serialize({ requireAllSignatures: false })
					.toString("base64");

				type resType = {
					id: string;
				};

				const response = await instance.post<resType>("/txn/sign", {
					message: message,
				});

				const txnID = response.data.id;
				setStatus("processing");

				// poll to see if the transaction has been processed.
				const interval = setInterval(async () => {
					const res = await instance.get(`/txn?id=${txnID}`);
					if (res.data.status === "success") {
						setStatus("success");
						setSignature(res.data.signatures[0]);
						clearInterval(interval);
					} else if (res.data.status === "failed") {
						setStatus("failed");
						clearInterval(interval);
					}
				}, 2000);
			} catch{
				setStatus("failed");
				setError("Something went wrong. Try again.");
			}
		}

		processTxn();
	};

	function goBackHandler() {
		navigate("/dashboard");
	}

	return (
		<>
			<form onSubmit={handleFormSubmit}>
				<input
					type="text"
					placeholder="Enter recipient's public key"
					name="recipient"
					value={recipient}
					onChange={handleChange}
				/>
				<input
					type="number"
					placeholder="Enter amount"
					name="amount"
					value={amount}
					onChange={handleChange}
				/>
				<button type="submit">Send SOL</button>
			</form>
			{status === "processing" && <div>Transaction processing...</div>}
			{status === "success" && (
				<>
					<div>Transaction signature: {signature}</div>
					<div>
						<a
							href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
							target="_blank"
						>
							View on Explorer
						</a>
					</div>
				</>
			)}
			{status === "failed" && (
				<div>Transaction failed - Check your balance</div>
			)}
			{error && <div>{error}</div>}
			<button onClick={goBackHandler}>Go back</button>
		</>
	);
}

export default SendTransaction;