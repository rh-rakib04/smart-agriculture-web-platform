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

import BuyerClientLayout from "./BuyerClientLayout";

export default function BuyerLayout({ children }) {
  return <BuyerClientLayout>{children}</BuyerClientLayout>;
}
