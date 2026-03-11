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

//       //  API response safe handling
//       setOrders(json.data || []);
//       setLoading(false);
//     };

//     fetchOrders();
//   }, []);

//   if (loading) {
//     return <p className="text-center py-6">Loading orders...</p>;
//   }

//   if (orders.length === 0) {
//     return <p className="text-center py-6">No orders found</p>;
//   }

//   return (
//     <>
//       {/* ===================== */}
//       {/* ✅ DESKTOP / TABLET */}
//       {/* ===================== */}
//       <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2 text-left">Crop</th>
//               <th className="px-4 py-2 text-left">Quantity</th>
//               <th className="px-4 py-2 text-left">Price</th>
//               <th className="px-4 py-2 text-left">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {orders.map((order) => (
//               <tr key={order._id} className="border-t">
//                 <td className="px-4 py-2">{order.cropId}</td>
//                 <td className="px-4 py-2">{order.quantity}</td>
//                 <td className="px-4 py-2">{order.price ?? "-"}</td>
//                 <td className="px-4 py-2">
//                   <OrderStatusBadge status={order.status} />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ===================== */}
//       {/* ✅ MOBILE VIEW (Card) */}
//       {/* ===================== */}
//       <div className="space-y-4 md:hidden">
//         {orders.map((order) => (
//           <div
//             key={order._id}
//             className="bg-white p-4 rounded-lg shadow space-y-2"
//           >
//             <div className="flex justify-between">
//               <span className="text-gray-500">Crop</span>
//               <span className="font-semibold">{order.cropId}</span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-500">Quantity</span>
//               <span>{order.quantity}</span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-500">Price</span>
//               <span>{order.price ?? "-"}</span>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="text-gray-500">Status</span>
//               <OrderStatusBadge status={order.status} />
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default OrderHistoryTable;

"use client";

import { useEffect, useState } from "react";
import OrderStatusBadge from "./OrderStatusBadge";
import { Package, Calendar, Tag, CreditCard } from "lucide-react";

const OrderHistoryTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      // Mocking a slightly longer delay for the KrishiNova feel
      const res = await fetch("/api/orders?buyerId=B001");
      const json = await res.json();
      setOrders(json.data || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
          Syncing Order Ledger...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex p-4 bg-slate-50 text-slate-300 rounded-full mb-4">
          <Package size={40} />
        </div>
        <p className="text-slate-500 font-bold">No purchase history found</p>
        <p className="text-slate-400 text-sm">
          Your orders will appear here once processed.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ✅ DESKTOP VIEW */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Crop Details
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Price
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Date
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {orders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs uppercase">
                      {order.cropId?.substring(0, 2) || "CR"}
                    </div>
                    <span className="font-bold text-slate-700">
                      {order.cropId}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">
                  {order.quantity} Units
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-black text-slate-800">
                    ${order.price?.toLocaleString() || "-"}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-400">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ MOBILE VIEW (Responsive Cards) */}
      <div className="md:hidden divide-y divide-slate-100">
        {orders.map((order) => (
          <div key={order._id} className="p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                  <Tag size={16} />
                </div>
                <span className="font-black text-slate-800 uppercase tracking-tight">
                  {order.cropId}
                </span>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Package size={10} /> Quantity
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {order.quantity}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <CreditCard size={10} /> Total
                </p>
                <p className="text-sm font-black text-emerald-600">
                  ${order.price || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 italic">
              <Calendar size={10} /> Ordered on{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "Unknown"}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderHistoryTable;
