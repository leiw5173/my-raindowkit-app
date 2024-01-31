import { useContractRead } from "wagmi";
import { orderAbi } from "../lib/abi";
import { Order } from "../lib/definitaions";
import { useEffect, useState } from "react";

export default function OrderTable() {
  const ORDER_ADDR = process.env.NEXT_PUBLIC_ORDER_ADDR || "0x";
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const { data, isError, isLoading } = useContractRead({
    address: `0x${ORDER_ADDR}`,
    abi: orderAbi,
    functionName: "getOrder",
    args: [1],
  });

  useEffect(() => {
    if (data) {
      setOrder({
        orderId: Number((data as any)[0]),
        buyer: (data as any)[1],
        seller: (data as any)[2],
        price: Number((data as any)[3]) / 10 ** 10,
        name: (data as any)[4],
        status: (data as any)[5],
      });
    }
  }, [data]);

  if (isError) console.log("Error");
  // if (isLoading) {
  //   return <div>Loading</div>;
  // }

  return (
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Buyer Address</th>
          <th>Seller Address</th>
          <th>Price</th>
          <th>Product Name</th>
          <th>Stutus</th>
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
        {order && (
          <tr key={order.orderId}>
            <td>{order.orderId}</td>
            <td>{order.buyer}</td>
            <td>{order.seller}</td>
            <td>{order.price}</td>
            <td>{order.name}</td>
            <td>{order.status}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
