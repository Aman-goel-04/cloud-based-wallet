import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useNavigate } from "react-router-dom";

function Dashboard() {
	const { publicKey, logout } = useAuth();
	const [balance, setBalance] = useState<number | null>(null);

	const navigate = useNavigate();

	useEffect(() => {
		if (!publicKey) return;
		// get balance on mount
		const connection = new Connection(import.meta.env.VITE_RPC_ENDPOINT);
		async function balanceFunc() {
			const fetchLamports = await connection.getBalance(
				new PublicKey(publicKey!),
			);
			setBalance(fetchLamports / LAMPORTS_PER_SOL);
		}
		balanceFunc();
	}, [publicKey]);

	function handleClickSend() {
		navigate("/send");
	}

	function handleClickLogout() {
		logout();
		navigate("/signin");
	}

	return (
		<>
			{publicKey && <div>Wallet address: {publicKey}</div>}
			{balance !== null && <div>Balance: {balance}</div>}
			<button onClick={handleClickSend}> Send SOL </button>
			<button onClick={handleClickLogout}> Logout </button>
		</>
	);
}

export default Dashboard;