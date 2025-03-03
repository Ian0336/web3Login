'use client';
import { useAccount, useWallets } from "@particle-network/connectkit";
import { handleLogin } from "../_util/chain";
import { useState } from "react";
// import Web3 from 'web3';

export default function LoginButton({ loginTrigger, setLoginTrigger }: { loginTrigger: boolean, setLoginTrigger: (loginTrigger: boolean) => void }) {
    const account = useAccount();
    const [primaryWallet] = useWallets();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    
    if (!account.isConnected) {
        return null;
    }

    const handleLoginClick = async () => {
        try {
            setIsLoggingIn(true);
            // Use type assertion to match the Account interface in chain.tsx
            const accountWithAddress = {
                ...account,
                address: account.address as `0x${string}`
            };
            const success = await handleLogin(accountWithAddress, primaryWallet);
            if (success) {
                setLoginTrigger(!loginTrigger);
            }
            
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div>
            <button 
                onClick={handleLoginClick}
                disabled={isLoggingIn}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200 ease-in-out"
            >
                {isLoggingIn ? "Logging in..." : "Login with Wallet"}
            </button>
        </div>
    );
}