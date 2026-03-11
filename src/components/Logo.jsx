import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center  ">
      <Image src="/logo.png" alt="SmartStudy Logo" width={40} height={40} />
      <span className="text-xl font-bold text-highlight tracking-tight">
       Krishi<span className="text-secondary">Nova</span>
      </span>
    </Link>
  );
};

export default Logo;
