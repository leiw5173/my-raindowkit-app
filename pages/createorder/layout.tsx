import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>
        <ConnectButton />
      </div>
      <div>{children}</div>
    </div>
  );
}
