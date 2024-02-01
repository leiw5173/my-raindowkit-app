import { useContractRead } from "wagmi";
import { orderAbi } from "../lib/abi";
import { Order } from "../lib/definitaions";
import { useEffect, useState } from "react";
import { UpdateOrder, DeleteOrder, DepositeOrder } from "./buttons";

export default function OrderTable() {
  const ORDER_ADDR = process.env.NEXT_PUBLIC_ORDER_ADDR || "0x";
  const [orders, setOrders] = useState<Order[] | undefined>(undefined);
  const { data, isError, isLoading } = useContractRead({
    address: `0x${ORDER_ADDR}`,
    abi: orderAbi,
    functionName: "getOrders",
    args: [],
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setOrders(data);
    }
  }, [data]);

  if (isError) console.log("Error");
  // if (isLoading) {
  //   return <div>Loading</div>;
  // }

  return (
    <div>
      <h1>Order Table</h1>
      <a href="./createorder">
        <button>Create Order</button>
      </a>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Buyer Address</th>
            <th>Seller Address</th>
            <th>Price</th>
            <th>Product Name</th>
            <th>Stutus</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {/* {isLoading && (
          <tr className="skeleton-row">
            <td colSpan={6}>
              <div className="skeleton"></div>
              <div className="skeleton"></div>
              <div className="skeleton"></div>
              <div className="skeleton"></div>
              <div className="skeleton"></div>
              <div className="skeleton"></div>
            </td>
          </tr>
        )} */}
          {orders?.map((order) => {
            return (
              <tr key={order.orderId}>
                <td>{Number(order.orderId)}</td>
                <td>{order.buyer}</td>
                <td>{order.seller}</td>
                <td>{Number(order.price) / 10 ** 10}</td>
                <td>{order.name}</td>
                <td>{order.status}</td>
                <td>
                  <div className="flex justify-end gap-3">
                    <UpdateOrder id={order.orderId} />
                  </div>
                  <div className="flex justify-end gap-3">
                    <DeleteOrder id={order.orderId} />
                  </div>
                  <div className="flex justify-end gap-3">
                    <DepositeOrder id={order.orderId} price={order.price} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
