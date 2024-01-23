import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  Chain,
} from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli, mainnet, polygon, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const neox: Chain = {
  id: 12227329,
  name: "NeoX",
  network: "testnet",
  iconUrl: "/NEO_512_512.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "GAS",
    symbol: "GAS",
  },
  rpcUrls: {
    public: { http: ["https://neoxseed1.ngd.network:444/"] },
    default: { http: ["https://neoxseed1.ngd.network:444/"] },
  },
  blockExplorers: {
    default: { name: "NeoXScan", url: "https://xt1scan.ngd.network/" },
    etherscan: { name: "NeoXScan", url: "https://xt1scan.ngd.network/" },
  },
  testnet: true,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [goerli, sepolia, neox]
      : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
