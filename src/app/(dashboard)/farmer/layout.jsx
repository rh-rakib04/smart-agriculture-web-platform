import FarmerSidebar from "@/components/farmer/sidebar";


export default function FarmerLayout({ children }) {
  return (
    <div className="flex min-h-screen">

   
      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-[calc(100vh-64px)] bg-[#EEF3E8] p-6">
        {children}
      </main>

    </div>
  );
}