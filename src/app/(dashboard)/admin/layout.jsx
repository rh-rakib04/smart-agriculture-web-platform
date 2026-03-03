"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // const [checking, setChecking] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      router.replace("/login"); // or "/" if you want
      return;
    }
    setChecking(false);
  }, [router, pathname]);

  // if (checking) {
  //   return <div className="p-6">Checking admin access...</div>;
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple top bar */}
      <div className="bg-green-900 text-white px-4 py-3 flex justify-between items-center">
        <div className="font-bold text-lg">Admin Dashboard</div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">{children}</div>
    </div>
  );
}
