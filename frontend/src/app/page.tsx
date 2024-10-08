'use client';
import { ConnectKitButton } from "connectkit";
import { useAccount } from 'wagmi';
import { motion } from "framer-motion";
import CustomSIWEButton from "./_components/SignInButton";

export default function Home() {
  const account = useAccount();
  console.log(account.isConnected);
  
  return (
    <>
      <main className="flex flex-col justify-center items-center h-screen">
        <ConnectKitButton/>
        {account.isConnected?<motion.main
          initial={{ opacity: 0, scale: 1, y: 100 }}
          animate={{ opacity: [0,0,0.5,0.8], scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CustomSIWEButton />
        </motion.main>:null}
      </main>
    </>
  );
}
