import { Connection, Transaction, SystemProgram, PublicKey, Keypair } from "@solana/web3.js";

async function main() {
  const connection = new Connection("https://api.devnet.solana.com");
  const { blockhash } = await connection.getLatestBlockhash();

  const from = new PublicKey(process.env.TEST_WALLET_PUBLIC_KEY!); 
  const to = Keypair.generate().publicKey;

  const txn = new Transaction({
    recentBlockhash: blockhash,
    feePayer: from,
  }).add(
    SystemProgram.transfer({ fromPubkey: from, toPubkey: to, lamports: 1_000_000 }) // min amount for rent exemption 
  );

  console.log(txn.serialize({ requireAllSignatures: false }).toString("base64")); // pasted in the body of the getTxnStatus rquest
}

main();