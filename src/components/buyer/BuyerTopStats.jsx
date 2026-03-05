// export default function BuyerTopStats() {
//   const stats = [
//     { title: "Total Orders", value: 12 },
//     { title: "Pending Orders", value: 3 },
//     { title: "Completed Orders", value: 7 },
//     { title: "Cancelled Orders", value: 2 },
//   ];

//   return (
//     <div
//       className="
//       grid gap-4
//       grid-cols-1
//       sm:grid-cols-2
//       lg:grid-cols-4
//     "
//     >
//       {stats.map((item, i) => (
//         <div key={i} className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">{item.title}</p>
//           <p className="text-3xl font-bold mt-2">{item.value}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";

export default function BuyerTopStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const res = await fetch("/api/orders?buyerId=B001");
      const json = await res.json();
      const orders = json.data || [];

      setStats({
        total: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        approved: orders.filter((o) => o.status === "approved").length,
        completed: orders.filter((o) => o.status === "completed").length,
      });
    };
    loadStats();
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  const cards = [
    { title: "Total Orders", value: stats.total },
    { title: "Pending", value: stats.pending },
    { title: "Approved", value: stats.approved },
    { title: "Completed", value: stats.completed },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-xl shadow
          hover:scale-105 transition-transform duration-300"
        >
          <p className="text-gray-500">{c.title}</p>
          <p className="text-3xl font-bold mt-2">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
