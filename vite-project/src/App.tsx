import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react";

function App() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const getBalance = async () => {
      if (!publicKey) return;
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / 1e9);
    }
    getBalance();
  }, [publicKey])

  return (
    <>
      <h1>Solana Wallet Dashboard</h1>
      <WalletMultiButton></WalletMultiButton>
      {publicKey &&
        <>
          <p>Connected: {publicKey.toString()}</p>
          <p>Balance: {balance}</p>
        </>
      }
    </>
  )
}

export default App
