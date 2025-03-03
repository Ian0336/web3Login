export const handleLogin = async (account: any, primaryWallet: any) => {
  try {
      // First ensure connection if not already connected
      if (!account.isConnected) {
          return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/nonce`, {
          method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      console.log(primaryWallet);
      // Create a message to sign (customize as needed)
      // const myProvider = await primaryWallet?.getProvider();
      // const provider = new Web3(myProvider as string);
      // const signature = await provider.eth.personal.sign(data.message, address as string, '');
      const walletClient = primaryWallet.getWalletClient();
      const signature = await walletClient.signMessage({message: data.message, account: account.address as `0x${string}`});

      // Here you could send the signature and address to your backend for verification
      console.log("Address:", account.address);
      console.log("Signature:", signature);
      console.log("Message:", data.message);
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ address: account.address as `0x${string}`, signature: signature, message: data.message })
      });
      const verifyData = await verifyResponse.json();
      console.log(verifyData);
      
      if (verifyData.token) {
          // Store tokens securely
          localStorage.setItem('token', verifyData.token);
          localStorage.setItem('refreshToken', verifyData.refreshToken);
          
          // You might want to update your app state here
          console.log('Successfully authenticated!');
      } else {
          throw new Error(verifyData.error || 'Authentication failed');
      }
  } catch (error) {
      console.error("Login failed:", error);
  }
}