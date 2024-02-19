import { useReadContract } from "wagmi";
import { orderAbi } from "../lib/abi";
import { Order } from "../lib/definitaions";
import { useEffect, useState } from "react";
import {
  UpdateOrder,
  DeleteOrder,
  DepositeOrder,
  ReceiveOrder,
} from "./buttons";

export default function OrderTable() {
  const ORDER_ADDR = process.env.NEXT_PUBLIC_ORDER_ADDR || "0x";
  const STATUS_MAP: { [index: number]: string } = {
    0: "Created",
    1: "Deposited",
    2: "Finished",
    3: "Updated",
    4: "Cancelled",
  };

  const [orders, setOrders] = useState<Order[] | undefined>(undefined);
  const { data, isError, isLoading } = useReadContract({
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
          {orders?.map((order: Order) => {
            if (order.status !== 2 && order.status !== 4)
              return (
                <tr key={order.orderId}>
                  <td>{Number(order.orderId)}</td>
                  <td>{order.buyer}</td>
                  <td>{order.seller}</td>
                  <td>{Number(order.price) / 10 ** 10}</td>
                  <td>{order.name}</td>
                  <td>{STATUS_MAP[order.status]}</td>
                  <td>
                    <div className="flex justify-end gap-3">
                      <UpdateOrder id={order.orderId} />

                      <DeleteOrder id={order.orderId} />

                      <DepositeOrder id={order.orderId} price={order.price} />
                      <ReceiveOrder id={order.orderId} />
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
