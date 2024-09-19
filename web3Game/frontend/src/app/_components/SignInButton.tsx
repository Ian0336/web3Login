'use client';
import React from "react";
import { signMessage } from '@wagmi/core'
import { config } from "./Provider";

const CustomSIWEButton = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSigned, setIsSigned] = React.useState(false);
  const handleSignIn = async () => {
    setIsLoading(() => true);
    setIsSigned(() => false);
    const message = "Sign in to your account";
    const signature = await signMessage(config, { message });
    console.log(signature);
    if (signature) {
      setIsSigned(() => true);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };
  /** Wallet is connected, but not signed in */
  return (
    <>
      <button onClick={handleSignIn} disabled={isLoading} className="border border-black-700 bg-black-600  focus:outline-none  transition-all duration-700 ease-in-out  text-white font-bold py-2 px-4 hover:rounded mt-5">
        { isLoading // Waiting for signing request
          ? <LoadingText isSigned={isSigned} />
          : // Waiting for interaction
            "Sign In"}
      </button>
    </>
  );
  


};

const LoadingText = ({ isSigned }: { isSigned: boolean }) => {
 return (
  <>
    <svg
      className="animate-spin h-5 w-5 text-current inline-block mr-1"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill="currentColor"
      />
    </svg>{isSigned?"Waiting for server...":"Waiting for signature..."}
  </>
  );
};

export default CustomSIWEButton;