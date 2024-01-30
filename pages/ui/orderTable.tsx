import { useContractRead } from "wagmi";
import { orderAbi } from "../lib/abi";
import { Order } from "../lib/definitaions";

export default function OrderTable() {
  const ORDER_ADDR = process.env.NEXT_PUBLIC_ORDER_ADDR || "0x";
  const { data, isError, isLoading } = useContractRead({
    address: `0x${ORDER_ADDR}`,
    abi: orderAbi,
    functionName: "getOrder",
    args: [1],
    onSuccess: (data) => {
      console.log(data);
    },
  });

  let order: Order | undefined;

  if (data) {
    order = {
      orderId: (data as any)[0],
      buyer: (data as any)[1],
      seller: (data as any)[2],
      price: (data as any)[3],
      name: (data as any)[4],
      status: (data as any)[5],
    };
  }
  console.log(order);

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
        {isLoading && (
          <tr>
            <td colSpan={6}>Loading...</td>
          </tr>
        )}
        {order && (
          <tr key={order.orderId}>
            <td>{order.orderId.toString()}</td>
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
