import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Transaction, PublicKey, SystemProgram } from "@solana/web3.js";

function App() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

  type Token = {
    mint: string,
    amount: number,
  }

  useEffect(() => {
    const getData = async () => {
      try {

        if (!publicKey) return;
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / 1e9);

        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: TOKEN_PROGRAM_ID }
        );

        console.log(tokenAccounts);

        const tokenList = tokenAccounts.value.map((acc) => {
          const info = acc.account.data.parsed.info;
          console.log(info.mint);
          console.log(info.tokenAmount.uiAmount);
          return {
            mint: info.mint,
            amount: info.tokenAmount.uiAmount
          }
        }).filter((t) => t.amount > 0);

        setTokens(tokenList);

      } catch (err) {
        console.log(err);
      }
    }
    getData();
  }, [publicKey, connection])

  const sendSol = async () => {
    if (!publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(receiver),
        lamports: Number(amount) * 1e9,
      })
    );

    const signature = await sendTransaction(transaction, connection);

    console.log("transaction Signature", signature);
    alert("Transaction sent!");
    setAmount("");
    setReceiver("");
  }

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>💼 Solana Wallet Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <WalletMultiButton />
      </div>

      {publicKey && (
        <div style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px"
        }}>
          <p><strong>Address:</strong> {publicKey.toString().slice(0, 10)}...</p>
          <p><strong>Balance:</strong> {balance?.toFixed(4)} SOL</p>
        </div>
      )}

      <h2>🪙 Your Tokens</h2>

      {tokens.length === 0 && <p>No tokens found</p>}

      {tokens.map((t, i) => (
        <div key={i} style={{
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px"
        }}>
          <p><strong>Mint:</strong> {t.mint.slice(0, 10)}...</p>
          <p><strong>Amount:</strong> {t.amount}</p>
        </div>
      ))}

      <h2>💸 Send SOL</h2>

      <input
        type="text"
        placeholder="Receiver Address"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="number"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button style={{ padding: "10px", width: "100%" }} onClick={sendSol}>
        Send SOL
      </button>
    </div>
  );

}

export default App
