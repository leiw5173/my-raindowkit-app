import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  erc20ABI,
} from "wagmi";
import { orderAbi } from "@/pages/lib/abi";
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
      <button>Upodate Order</button>
    </Link>
  );
}

export function DeleteOrder({ id }: { id: number }) {
  const ORDER_ADDR = process.env.NEXT_PUBLIC_ORDER_ADDR || "0x";

  const { config } = usePrepareContractWrite({
    address: `0x${ORDER_ADDR}`,
    abi: orderAbi,
    functionName: "cancelOrderBySeller",
    args: [id],
  });

  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
  });
  useEffect(() => {
    if (isSuccess) {
      alert("Order Deleted");
      refreshPage();
    }
    if (isError) {
      alert("Error");
    }
  }, [isSuccess, isError]);

  return (
    <button
      onClick={() => {
        write?.();
      }}
      disabled={isLoading}
    >
      Delete Order
    </button>
  );
}

export function DepositeOrder({ id, price }: { id: number; price: number }) {
  const ORDER_ADDR = process.env.NEXT_PUBLIC_ORDER_ADDR || "0x";
  const CURRENCY_ADDR = process.env.NEXT_PUBLIC_CURRENCY_ADDR || "0x";

  const { config: configApporve } = usePrepareContractWrite({
    address: `0x${CURRENCY_ADDR}`,
    abi: erc20ABI,
    functionName: "approve",
    args: [`0x${ORDER_ADDR}`, BigInt(price)],
  });

  const { data: dataApprove, write: writeApprove } =
    useContractWrite(configApporve);
  const {
    isSuccess: isSuccessApprove,
    isError: isErrorApprove,
    isLoading: isLoadingApprove,
  } = useWaitForTransaction({ hash: dataApprove?.hash });

  const { config } = usePrepareContractWrite({
    address: `0x${ORDER_ADDR}`,
    abi: orderAbi,
    functionName: "depositCurrency",
    args: [id],
  });

  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isSuccessApprove) {
      write?.();
      refreshPage();
    }
    if (isSuccess) {
      alert("Order Deposited");
    }
    if (isError || isErrorApprove) {
      alert("Error");
    }
  }, [isSuccess, isError, isSuccessApprove, isErrorApprove]);

  return (
    <div>
      <button
        onClick={() => {
          writeApprove?.();
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

  const { config } = usePrepareContractWrite({
    address: `0x${ORDER_ADDR}`,
    abi: orderAbi,
    functionName: "receiveGoods",
    args: [id],
  });

  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
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
        write?.();
      }}
      disabled={isLoading}
    >
      Receive Goods
    </button>
  );
}
