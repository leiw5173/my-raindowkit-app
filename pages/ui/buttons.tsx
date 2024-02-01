import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { orderAbi } from "@/pages/lib/abi";
import { useEffect } from "react";

export function UpdateOrder({ id }: { id: number }) {
  return (
    <Link
      href={`/updateorder/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="h-5 w-5 text-gray-500" />
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
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      {isLoading ? "Deleting Order" : <TrashIcon className="w-5" />}
    </button>
  );
}
