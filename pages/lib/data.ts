import { unstable_noStore as noStore } from "next/cache";
import { useContractRead } from "wagmi";
import { orderAbi } from "./abi";

const ITEMS_PER_PAGE = 6;
const ORDER_ADDR = process.env.NEXT_PUBLIC_ORDER_ADDR || "0x";
export function fetchFilteredOrders(query: number, currentPage: number) {
  noStore();
  try {
    const { data, isError, isLoading } = useContractRead({
      address: `0x${ORDER_ADDR}`,
      abi: orderAbi,
      functionName: "getOrder",
      args: [query],
      onSuccess(data) {
        console.log(data);
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching orders");
  }
}
