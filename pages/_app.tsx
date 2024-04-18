import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  getDefaultWallets,
  RainbowKitProvider,
  Chain,
} from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { WagmiProvider, http } from "wagmi";
import { goerli, mainnet, polygon, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const neox = {
  id: 12227331,
  name: "NeoX",

  iconUrl: "/NEO_512_512.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "GAS",
    symbol: "GAS",
  },
  rpcUrls: {
    public: { http: ["https://neoxseed1.ngd.network/"] },
    default: { http: ["https://neoxseed1.ngd.network/"] },
  },
  blockExplorers: {
    default: { name: "NeoXScan", url: "https://xt3scan.ngd.network/" },
    etherscan: { name: "NeoXScan", url: "https://xt3scan.ngd.network/" },
  },
  testnet: true,
} as const satisfies Chain;

const config = getDefaultConfig({
  appName: "IOT Marketplace",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "PROJECT_ID",
  chains: [mainnet, polygon, goerli, sepolia, neox],
  transports: {
    [(mainnet.id, polygon.id, goerli.id, sepolia.id, neox.id)]: http(),
  },
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
