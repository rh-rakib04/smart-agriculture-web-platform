// import Sidebar from "@/components/buyer/Sidebar";

// export default function BuyerLayout({ children }) {
//   return (
//     <div className="flex max-w-7xl mx-auto min-h-screen bg-gray-100">
//       {/* Sidebar */}
// <aside>

//       <Sidebar></Sidebar>
// </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto max-w-7xl mx-auto ">
//         {children}
//       </main>
//     </div>
//   );
// }

// import BuyerClientLayout from "./BuyerClientLayout";

// export default function BuyerLayout({ children }) {
//   return <BuyerClientLayout>{children}</BuyerClientLayout>;
// }




"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";

export default function BuyerLayout({ children }) {
  const router = useRouter();
  const { role, loading, isBuyer } = useRole();

  useEffect(() => {
    if (loading) return;

    // logged-in but not Buyer
    if (role && !isBuyer) {
      router.replace("/403");
    }
  }, [role, loading, isBuyer, router]);

  if (loading) return <div className="p-6">Checking Buyer access...</div>;

  // if role exists but not Buyer, show nothing (redirect will happen)
  if (role && !isBuyer) return null;

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
