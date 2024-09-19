import { createConfig, http } from "@wagmi/core";
import { sepolia } from '@wagmi/core/chains'
export const config = createConfig(
  {
    // Your dApps chains
    chains: [sepolia],
    transports: {
      // RPC URL for each chain
      [sepolia.id]: http(
        `https://1rpc.io/sepolia`,
      ),
    },

  },
);
