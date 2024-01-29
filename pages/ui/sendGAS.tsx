import * as React from "react";
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import { parseEther } from "viem";

export function SendGAS() {
  const { data: hash, sendTransaction, isLoading } = useSendTransaction();

  // submit handler
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get("address") as `0x${string}`;
    const value = formData.get("value") as string;
    sendTransaction({ to, value: parseEther(value) });
  }

  // wait for transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransaction(hash);

  // render
  return (
    <form onSubmit={submit}>
      <input name="address" placeholder="0xA0Cf…251e" required />
      <input name="value" placeholder="0.5" required />
      <button disabled={isLoading} type="submit">
        {isLoading ? "Confirming..." : "Send"}
      </button>
      {hash && <p>Transaction hash: {hash.hash}</p>}
      {isConfirming && <p>Waiting for confirmation...</p>}
      {isConfirmed && <p>Transaction confirmed!</p>}
    </form>
  );
}
