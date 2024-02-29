import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { orderAbi } from "@/pages/lib/abi";
import { useDebouncedCallback } from "use-debounce";

export default function Page() {
  const [productName, setProductName] = useState<string>("");
  const [price, setPrice] = useState("");
  const ORDER_ADDR = process.env.NEXT_PUBLIC_ORDER_ADDR || "0x";

  //   const handleNameChange = useDebouncedCallback((name) => {
  //     if (name.length > 0) {
  //       setProductName(name);
  //     } else {
  //       setProductName("");
  //     }
  //   }, 500);
  //   const handlePriceChange = useDebouncedCallback((price) => {
  //     if (price > 0) {
  //       setPrice(price);
  //     } else {
  //       setPrice(0);
  //     }
  //   }, 500);

  // const { config } = usePrepareContractWrite({
  //   address: `0x${ORDER_ADDR}`,
  //   abi: orderAbi,
  //   functionName: "setPriceAndGoods",
  //   args: [productName, parseInt(price) * 10 ** 10],
  //   enabled: Boolean(productName.length > 0 && parseInt(price) > 0),
  // });

  const { data, isPending, writeContract } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  return (
    <main>
      <div>
        <ConnectButton />
      </div>
      <h1>Create Order</h1>
      <p>Fill out the form below to create an order.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          writeContract?.({
            address: `0x${ORDER_ADDR}`,
            abi: orderAbi,
            functionName: "setPriceAndGoods",
            args: [productName, parseInt(price) * 10 ** 10],
          });
        }}
      >
        <label>
          Product Name:
          <input
            type="text"
            name="name"
            placeholder="100 Stones"
            onChange={(e) => setProductName(e.target.value)}
            value={productName}
          />
        </label>
        <label>
          Price:
          <input
            type="text"
            name="price"
            placeholder="0.0001"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />
        </label>
        <button disabled={isPending || isLoading}>
          {isLoading ? "Creating Order" : "Create Order"}
        </button>
        {isSuccess && (
          <div>
            Successfully created order!
            <div>
              <a
                href={`https://xt2scan.ngd.network/tx/${data}`}
                target="_blank"
                rel="noreferrer"
              >
                View on explorer
              </a>
            </div>
          </div>
        )}
      </form>
      <a href="./">
        <button>Back To Order List</button>
      </a>
    </main>
  );
}
