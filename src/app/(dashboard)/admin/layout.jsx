"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // const [checking, setChecking] = useState(true);

  // useEffect(() => {
  //   const role = localStorage.getItem("role");

  //   if (role !== "farmer") {
  //     router.replace("/login"); // or "/" if you want
  //     return;
  //   }
  //   setChecking(false);
  // }, [router, pathname]);

  // if (checking) {
  //   return <div className="p-6">Checking admin access...</div>;
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple top bar */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">{children}</div>
    </div>
  );
}
