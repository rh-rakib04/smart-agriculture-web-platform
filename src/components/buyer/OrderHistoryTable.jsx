// "use client";
// import { useEffect, useState } from "react";
// import OrderStatusBadge from "./OrderStatusBadge";

// const OrderHistoryTable = () => {
//   const [orders, setOrders] = useState([]); // default empty array
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await fetch("/api/orders?buyerId=B001");
//         const data = await res.json();

//         // Ensure data is an array
//         if (Array.isArray(data)) setOrders(data);
//         else if (data.orders && Array.isArray(data.orders))
//           setOrders(data.orders);
//         else setOrders([]); // fallback
//       } catch (err) {
//         console.error(err);
//         setOrders([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   if (loading) return <p>Loading orders...</p>;
//   if (!orders || orders.length === 0) return <p>No orders found</p>;

//   return (
//     <table className="min-w-full border">
//       <thead className="bg-gray-100">
//         <tr>
//           <th className="px-4 py-2 border">Crop ID</th>
//           <th className="px-4 py-2 border">Quantity</th>
//           <th className="px-4 py-2 border">Status</th>
//           <th className="px-4 py-2 border">Date</th>
//         </tr>
//       </thead>
//       <tbody>
//         {orders.map((order) => (
//           <tr key={order._id}>
//             <td className="px-4 py-2 border">{order.cropId}</td>
//             <td className="px-4 py-2 border">{order.quantity}</td>
//             <td className="px-4 py-2 border">
//               <OrderStatusBadge status={order.status} />
//             </td>
//             <td className="px-4 py-2 border">
//               {order.createdAt
//                 ? new Date(order.createdAt).toLocaleDateString()
//                 : "-"}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default OrderHistoryTable;

// "use client";

// import { useEffect, useState } from "react";
// import OrderStatusBadge from "./OrderStatusBadge";

// const OrderHistoryTable = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const res = await fetch("/api/orders?buyerId=B001");
//       const json = await res.json();
//       setOrders(json.data || []);
//       setLoading(false);
//     };
//     fetchOrders();
//   }, []);

//   if (loading) {
//     return <p className="text-center py-6">Loading orders...</p>;
//   }

//   return (
//     <div className="overflow-x-auto bg-white rounded-lg shadow">
//       <table className="min-w-full text-sm">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="px-4 py-2 text-left">Crop</th>
//             <th className="px-4 py-2 text-left">Quantity</th>
//             <th className="px-4 py-2 text-left">Price</th>
//             <th className="px-4 py-2 text-left">Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {orders.map((order) => (
//             <tr key={order._id} className="border-t">
//               <td className="px-4 py-2">{order.cropId}</td>
//               <td className="px-4 py-2">{order.quantity}</td>
//               <td className="px-4 py-2">{order.price}</td>
//               <td className="px-4 py-2">
//                 <OrderStatusBadge status={order.status} />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OrderHistoryTable;

"use client";

import { useEffect, useState } from "react";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderHistoryTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/orders?buyerId=B001");
      const json = await res.json();

      // ✅ API response safe handling
      setOrders(json.data || []);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center py-6">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-center py-6">No orders found</p>;
  }

  return (
    <>
      {/* ===================== */}
      {/* ✅ DESKTOP / TABLET */}
      {/* ===================== */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Crop</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="px-4 py-2">{order.cropId}</td>
                <td className="px-4 py-2">{order.quantity}</td>
                <td className="px-4 py-2">{order.price ?? "-"}</td>
                <td className="px-4 py-2">
                  <OrderStatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===================== */}
      {/* ✅ MOBILE VIEW (Card) */}
      {/* ===================== */}
      <div className="space-y-4 md:hidden">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-4 rounded-lg shadow space-y-2"
          >
            <div className="flex justify-between">
              <span className="text-gray-500">Crop</span>
              <span className="font-semibold">{order.cropId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Quantity</span>
              <span>{order.quantity}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Price</span>
              <span>{order.price ?? "-"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Status</span>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderHistoryTable;
