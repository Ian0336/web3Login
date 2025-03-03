'use client';
import { useState, useEffect } from "react";
import { ConnectButton, useAccount } from "@particle-network/connectkit";
import { motion } from "framer-motion";
import LoginButton from "./_components/LoginButton";
import { getCookie, verifyTokenAddress, isTokenExpired, clearAuthTokens } from "./_util/tokenUtils";

export default function Home() {
  const account = useAccount();
  const [text, setText] = useState('');
  const [settingText, setSettingText] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [loginTrigger, setLoginTrigger] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const savedToken = getCookie('token');
    
    // Examine the token to verify if the payload address matches the connected wallet address
    if (savedToken) {
      // First check if token is expired
      if (isTokenExpired(savedToken)) {
        console.warn("Token is expired");
        clearAuthTokens();
        return;
      }
      
      // If wallet is connected, verify the address matches
      if (account.isConnected && account.address) {
        console.log("account.address", account.address);
        if (verifyTokenAddress(savedToken, account.address)) {
          // Valid token for the current connected wallet
          setToken(savedToken);
          setIsLoggedIn(true);
          fetchUserText(savedToken);
        } else {
          console.warn("Token address doesn't match connected wallet address");
          // Clear tokens if addresses don't match
          clearAuthTokens();
          handleLogout();
        }
      } else {
        // We have a valid token but wallet not connected
        // Allow using the token for data access but user should reconnect wallet
        setToken(savedToken);
        setIsLoggedIn(true);
        fetchUserText(savedToken);
      }
    }
  }, [account.address, account.isConnected, loginTrigger]);

  // if disconnect, clear the token and set logout 



  
  // Fetch user text when logged in
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchUserText(token);
    }
  }, [isLoggedIn, token]);

  // Function to fetch user text from backend
  const fetchUserText = async (authToken: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/text`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        // If unauthorized, token might be expired or invalid
        if (response.status === 401) {
          setIsLoggedIn(false);
          clearAuthTokens();
        }
        throw new Error('Failed to fetch text');
      }
      
      const data = await response.json();
      setText(data.text);
    } catch (error) {
      console.error('Error fetching text:', error);
    }
  };

  // Function to logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken('');
    setText('');
    clearAuthTokens();
  };

  // Function to set user text
  const handleSetText = async () => {
    if (!isLoggedIn || !token) {
      alert('Please login first');
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: settingText })
      });
      
      if (!response.ok) {
        // If unauthorized, token might be expired or invalid
        if (response.status === 401) {
          setIsLoggedIn(false);
          clearAuthTokens();
        }
        throw new Error('Failed to set text');
      }
      
      // Refresh user text
      fetchUserText(token);
      setSettingText(''); // Clear input field
    } catch (error) {
      console.error('Error setting text:', error);
    }
  };

  console.log("address", account.address);

  return (
    <>
      <main className="flex flex-col justify-center items-center h-screen">
        <motion.main
              initial={{ opacity: 0, scale: 1, y: 100 }}
              animate={{ opacity: [0,0,0.5,0.8], scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ConnectButton />
        </motion.main>
        {account.isConnected && !isLoggedIn ? 
          <motion.main
                initial={{ opacity: 0, scale: 1, y: 100 }}
                animate={{ opacity: [0,0,0.5,0.8], scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-10"
              >
                <LoginButton loginTrigger={loginTrigger} setLoginTrigger={setLoginTrigger} />
          </motion.main> : null}

        {/* show the address of text from backend */}
        {(isLoggedIn && account.address) && 
          <motion.main
                initial={{ opacity: 0, scale: 1, y: 100 }}
                animate={{ opacity: [0,0,0.5,0.8], scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-10"
              >
                <p>Your text is: {text || "No text saved yet"}</p>
          </motion.main>}
          
        {/* set the address of text from backend */}
        {(isLoggedIn && account.address) && 
          <motion.main
                initial={{ opacity: 0, scale: 1, y: 100 }}
                animate={{ opacity: [0,0,0.5,0.8], scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-10 flex flex-col gap-2"
              >
                <span>Set text:</span>
                <input 
                  type="text" 
                  value={settingText} 
                  onChange={(e) => setSettingText(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 bg-black text-white"
                />
                <button 
                  onClick={handleSetText}
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                  Save
                </button>
          </motion.main>}
          
        {/* Logout button */}
        {/* {(isLoggedIn && account.address) && 
          <motion.main
                initial={{ opacity: 0, scale: 1, y: 100 }}
                animate={{ opacity: [0,0,0.5,0.8], scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-10"
              >
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Logout
                </button>
          </motion.main>} */}
      </main>
    </>
  );
}
