import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

function App() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<token[]>([]);

  type token = {
    mint: String,
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
        })
        setTokens(tokenList);

      } catch (err) {
        console.log(err);
      }
    }
    getData();
  }, [publicKey, connection])

  return (
    <>
      <h1>Solana Wallet Dashboard</h1>
      <WalletMultiButton />
      {publicKey &&
        <>
          <p>Connected: {publicKey.toString()}</p>
          <p>Balance: {balance !== null ? balance : "Loading..."}</p>
          <h2>Your Tokens</h2>
          {tokens.map((t, i) => {
            return <div key={i}>
              <p>Mint Address is : {t.mint}</p>
              <p>Amount : {t.amount}</p>
            </div>
          })}
        </>
      }
    </>
  )
}

export default App
