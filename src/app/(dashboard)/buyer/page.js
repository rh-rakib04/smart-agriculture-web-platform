// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import Sidebar from "@/components/buyer/Sidebar";
// import PlaceOrderForm from "@/components/buyer/PlaceOrderForm";
// import OrderHistoryTable from "@/components/buyer/OrderHistoryTable";

// export default function BuyerDashboard() {
//   const router = useRouter();
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const currentRole = "buyer"; // simulate role
//     if (currentRole !== "buyer") router.push("/unauthorized");
//     else setRole(currentRole);
//     setLoading(false);
//   }, [router]);

//   if (loading) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen">
//       <div className="md:w-64">
//         <Sidebar />
//       </div>
//       <div className="flex-1 p-6 bg-gray-50">
//         <h1 className="text-3xl font-bold mb-6">Welcome, Buyer</h1>
//         <div className="space-y-10">
//           <div className="bg-white p-6 rounded shadow">
//             <PlaceOrderForm />
//           </div>
//           <div className="bg-white p-6 rounded shadow">
//             <OrderHistoryTable />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import BuyerTopStats from "@/components/buyer/BuyerTopStats";

export default function BuyerDashboard() {
  return (
    
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Buyer Dashboard
      </h1>

      <BuyerTopStats />
    </div>
  );
}