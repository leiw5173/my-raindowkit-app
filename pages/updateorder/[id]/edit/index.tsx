import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { orderAbi } from "@/pages/lib/abi";
import { Order } from "@/pages/lib/definitaions";
import { useRouter } from "next/router";

export default function Page() {
  const id = useRouter().query.id;
  const [productName, setProductName] = useState<string>("");
  const [price, setPrice] = useState("");
  const ORDER_ADDR = process.env.NEXT_PUBLIC_ORDER_ADDR || "0x";

  console.log(id);
  const { data: orderData }: { data: Order | undefined } = useReadContract({
    address: `0x${ORDER_ADDR}`,
    abi: orderAbi,
    functionName: "getOrder",
    args: [id],
  });

  console.log(orderData);

  // const { config } = usePrepareContractWrite({
  //   address: `0x${ORDER_ADDR}`,
  //   abi: orderAbi,
  //   functionName: "updateOrder",
  //   args: [id, productName, parseInt(price) * 10 ** 10],
  //   enabled: Boolean(productName.length > 0 && parseInt(price) > 0),
  // });

  const { data, isPending, writeContract } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash: data });

  return (
    <main>
      <div>
        <ConnectButton />
      </div>
      <h1>Update Order</h1>
      <p>Fill out the form below to update an order.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          writeContract?.({
            address: `0x${ORDER_ADDR}`,
            abi: orderAbi,
            functionName: "updateOrder",
            args: [
              id,
              productName,
              parseInt((Number(price) * 10 ** 10).toString()),
            ],
          });
        }}
      >
        <label>
          Product Name:
          <input
            type="text"
            name="name"
            placeholder={orderData?.name}
            onChange={(e) => setProductName(e.target.value)}
            value={productName}
          />
        </label>
        <label>
          Price:
          <input
            type="text"
            name="price"
            placeholder={(Number(orderData?.price) / 10 ** 10).toString()}
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />
        </label>
        <button disabled={isPending || isLoading}>
          {isLoading ? "Updating Order" : "Update Order"}
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
      <a href="../../">
        <button>Back To Order List</button>
      </a>
    </main>
  );
}
