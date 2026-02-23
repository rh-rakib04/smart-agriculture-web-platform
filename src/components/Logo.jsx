import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center  ">
      <Image src="/logo.png" alt="SmartStudy Logo" width={60} height={10} />
      <span className="text-xl font-bold text-highlight tracking-tight">
        Smart<span className="text-secondary">Agriculture</span>
      </span>
    </Link>
  );
};

export default Logo;
