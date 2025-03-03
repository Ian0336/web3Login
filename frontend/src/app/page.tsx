'use client';
import { ConnectButton, useAccount } from "@particle-network/connectkit";
import { motion } from "framer-motion";
import LoginButton from "./_components/LoginButton";

export default function Home() {
  const { isConnected } = useAccount();
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
        {isConnected?<motion.main
              initial={{ opacity: 0, scale: 1, y: 100 }}
              animate={{ opacity: [0,0,0.5,0.8], scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10"
            >
              <LoginButton />
        </motion.main>:null}
      </main>
    </>
  );
}
