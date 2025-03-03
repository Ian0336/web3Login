'use client';
import { useAccount, useWallets } from "@particle-network/connectkit";
import { handleLogin } from "../_util/chain";
// import Web3 from 'web3';

export default function LoginButton() {
    const account = useAccount();
    const [primaryWallet] = useWallets();
    
    if (!account.isConnected) {
        return null;
    }
    return (
        <div>
            <button onClick={() => handleLogin(account, primaryWallet)}>Login</button>
        </div>
    )
}