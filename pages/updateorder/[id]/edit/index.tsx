import { use, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
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

  const { data: orderData }: { data: Order | undefined } = useContractRead({
    address: `0x${ORDER_ADDR}`,
    abi: orderAbi,
    functionName: "getOrder",
    args: [parseInt(id as string)],
  });

  const { config } = usePrepareContractWrite({
    address: `0x${ORDER_ADDR}`,
    abi: orderAbi,
    functionName: "updateOrder",
    args: [productName, parseInt(price) * 10 ** 10],
    enabled: Boolean(productName.length > 0 && parseInt(price) > 0),
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

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
          write?.();
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
        <button disabled={!write || isLoading}>
          {isLoading ? "Updating Order" : "Update Order"}
        </button>
        {isSuccess && (
          <div>
            Successfully created order!
            <div>
              <a
                href={`https://xt2scan.ngd.network/tx/${data?.hash}`}
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
