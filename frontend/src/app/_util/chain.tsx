// We'll use more generic types since the specific types are not easily accessible
interface Account {
  isConnected: boolean;
  address: `0x${string}`;
}

interface Wallet {
  getWalletClient: () => {
    signMessage: (params: { message: string; account: `0x${string}` }) => Promise<string>;
  };
}

export const handleLogin = async (account: Account, primaryWallet: Wallet): Promise<boolean> => {
  try {
      // First ensure connection if not already connected
      if (!account.isConnected) {
          return false;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/nonce`, {
          method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      console.log(primaryWallet);
      
      const walletClient = primaryWallet.getWalletClient();
      const signature = await walletClient.signMessage({message: data.message, account: account.address});

      // Here you could send the signature and address to your backend for verification
      console.log("Address:", account.address);
      console.log("Signature:", signature);
      console.log("Message:", data.message);
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ address: account.address, signature: signature, message: data.message })
      });
      const verifyData = await verifyResponse.json();
      console.log(verifyData);
      
      // save tokens to httpOnly cookie
      if (verifyData.token) {
          // Store tokens securely
          document.cookie = `token=${verifyData.token}; path=/;`;
          document.cookie = `refreshToken=${verifyData.refreshToken}; path=/;`;
          
          // You might want to update your app state here
          console.log('Successfully authenticated!');
          return true;
      } else {
          throw new Error(verifyData.error || 'Authentication failed');
      }
  } catch (error) {
      console.error("Login failed:", error);
      return false;
  }
}