import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc20Abi } from "viem";
import { orderAbi } from "@/lib/abi";
import { useEffect } from "react";

const refreshPage = () => {
  window.location.reload();
};

export function UpdateOrder({ id }: { id: number }) {
  return (
    <Link
      href={`/updateorder/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <button>Update Order</button>
    </Link>
  );
}

export function DeleteOrder({ id }: { id: number }) {
  const ORDER_ADDR = process.env.NEXT_PUBLIC_ORDER_ADDR || "0x";

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash: hash,
  });
  useEffect(() => {
    if (isSuccess) {
      alert(`Order Deleted: ${hash}`);
      refreshPage();
    }
    if (isError) {
      alert("Error");
    }
  }, [isSuccess, isError]);

  return (
    <button
      onClick={() => {
        writeContract?.({
          address: `0x${ORDER_ADDR}`,
          abi: orderAbi,
          functionName: "cancelOrderBySeller",
          args: [id],
        });
      }}
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete Order"}
    </button>
  );
}

export function DepositeOrder({ id, price }: { id: number; price: number }) {
  const ORDER_ADDR = process.env.NEXT_PUBLIC_ORDER_ADDR || "0x";
  const CURRENCY_ADDR = process.env.NEXT_PUBLIC_CURRENCY_ADDR || "0x";

  const configApporve = {
    address: `0x${CURRENCY_ADDR}`,
    abi: erc20Abi,
    functionName: "approve",
    args: [`0x${ORDER_ADDR}`, BigInt(price)],
  };

  const { data: dataApprove, writeContract: writeApprove } = useWriteContract();
  const {
    isSuccess: isSuccessApprove,
    isError: isErrorApprove,
    isLoading: isLoadingApprove,
  } = useWaitForTransactionReceipt({ hash: dataApprove });

  const config = {
    address: `0x${ORDER_ADDR}`,
    abi: orderAbi,
    functionName: "depositCurrency",
    args: [BigInt(id)],
  };

  const { data, writeContract } = useWriteContract();
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash: data,
  });

  useEffect(() => {
    if (isSuccessApprove) {
      writeContract?.({
        address: `0x${ORDER_ADDR}`,
        abi: orderAbi,
        functionName: "depositCurrency",
        args: [BigInt(id)],
      });
    }

    if (isSuccess) {
      alert("Order Deposited");
      refreshPage();
    }
    if (isError || isErrorApprove) {
      alert("Error");
    }
  }, [isSuccess, isError, isSuccessApprove, isErrorApprove]);

  return (
    <div>
      <button
        onClick={() => {
          writeApprove?.({
            address: `0x${CURRENCY_ADDR}`,
            abi: erc20Abi,
            functionName: "approve",
            args: [`0x${ORDER_ADDR}`, BigInt(price)],
          });
        }}
        className="rounded-md border p-2 hover:bg-gray-100"
        disabled={isLoading || isLoadingApprove}
      >
        Purchase Order
      </button>
    </div>
  );
}

export function ReceiveOrder({ id }: { id: number }) {
  const ORDER_ADDR = process.env.NEXT_PUBLIC_ORDER_ADDR || "0x";

  // const { config } = usePrepareContractWrite({
  //   address: `0x${ORDER_ADDR}`,
  //   abi: orderAbi,
  //   functionName: "receiveGoods",
  //   args: [id],
  // });

  const { data, writeContract } = useWriteContract();
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash: data,
  });

  useEffect(() => {
    if (isSuccess) {
      alert("Order Received");
      refreshPage();
    }
    if (isError) {
      alert("Error");
    }
  }, [isSuccess, isError]);

  return (
    <button
      onClick={() => {
        writeContract?.({
          address: `0x${ORDER_ADDR}`,
          abi: orderAbi,
          functionName: "receiveGoods",
          args: [id],
        });
      }}
      disabled={isLoading}
    >
      Receive Goods
    </button>
  );
}
