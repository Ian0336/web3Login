'use client';
import { useAccount } from "@particle-network/connectkit";
import Web3 from 'web3';

export default function LoginButton() {
    const { isConnected, connector, address } = useAccount();
    const handleLogin = async () => {
        try {
            // First ensure connection if not already connected
            if (!isConnected) {
                await connector?.connect();
            }
            
            // Create a message to sign (customize as needed)
            const message = `Sign this message to log in to the application\nTimestamp: ${Date.now()}`;

            console.log(await connector?.getProvider());
            const myProvider = await connector?.getProvider();
            const provider = new Web3(myProvider as string);
            const signature = await provider.eth.personal.sign(message, address as string, '');

            // Here you could send the signature and address to your backend for verification
            console.log("Address:", address);
            console.log("Signature:", signature);
            console.log("Message:", message);
            
            // Add your authentication logic here
            // e.g., fetch('/api/auth', { method: 'POST', body: JSON.stringify({ address, signature, message }) })
        } catch (error) {
            console.error("Login failed:", error);
        }
    }
    if (!isConnected) {
        return null;
    }
    return (
        <div>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}