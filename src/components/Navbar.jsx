// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useState } from "react";

// const Navbar = () => {
//   const [open, setOpen] = useState(false);

//   return (
//     <nav className="bg-gray-400 font-bold flex flex-col">
//       {/* ===== Container ===== */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* ===== Main Row ===== */}
//         <div className="flex items-center justify-between h-16">
//           {/* ===== 1️⃣ Logo ===== */}
//           <div className="flex-shrink-0">
//             <Link href="/">
//               <Image
//                 src="/logo.jpg"
//                 alt="Logo"
//                 width={40}
//                 height={40}
//                 className="cursor-pointer"
//               />
//             </Link>
//           </div>

//           {/* ===== 2️⃣ Menu Links (Desktop) ===== */}
//           <div className="hidden md:flex gap-8">
//             <Link href="/" className="hover:text-white">
//               Home
//             </Link>
//             <Link href="/service" className="hover:text-white">
//               Service
//             </Link>
//             <Link href="/aboutUs" className="hover:text-white">
//               About Us
//             </Link>
//             <Link href="/reviews" className="hover:text-white">
//               Reviews
//             </Link>
//           </div>

//           {/* ===== 3️⃣ Auth Buttons (Desktop) ===== */}
//           <div className="hidden md:flex gap-4">
//             <Link href="/login" className="hover:text-white">
//               Login
//             </Link>
//             <Link
//               href="/register"
//               className="bg-black text-white px-4 py-1 rounded"
//             >
//               Register
//             </Link>
//           </div>

//           {/* ===== Mobile Menu Button ===== */}
//           <div className="md:hidden">
//             <button onClick={() => setOpen(!open)}>
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* ===== Mobile Menu ===== */}
//         {open && (
//           <div className="md:hidden flex flex-col gap-3 pb-4">
//             <Link href="/">Home</Link>
//             <Link href="/service">Service</Link>
//             <Link href="/aboutUs">About Us</Link>
//             <Link href="/reviews">Reviews</Link>
//             <Link href="/login">Login</Link>
//             <Link
//               href="/register"
//               className="bg-black text-white text-center py-2 rounded"
//             >
//               Register
//             </Link>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = ({ isLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md fixed w-full z-10 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT - Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/logo.jpg"
              alt=" logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* CENTER - Menu (Desktop / Laptop) */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" pathname={pathname}>
              Home
            </NavLink>
            <NavLink href="/aboutUs" pathname={pathname}>
              About Us
            </NavLink>
            <NavLink href="/services" pathname={pathname}>
              Services
            </NavLink>

            {isLoggedIn && (
              <>
                <NavLink href="/dashboard/servicesDetails" pathname={pathname}>
                  Services Details
                </NavLink>
                <NavLink href="/dashboard/profile" pathname={pathname}>
                  Profile
                </NavLink>
              </>
            )}
          </div>

          {/* RIGHT - Login  */}
          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  window.dispatchEvent(new Event("auth-change"));
                  window.location.href = "/api/auth/logout";
                }}
               className="
  bg-[#2E7D32]
  hover:bg-white
  text-white
  hover:text-[#2E7D32]
  px-4 py-2
  rounded-full
  text-sm
  border-2 border-transparent
  hover:border-[#2E7D32]
  transition-all duration-300
"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
               className="
  bg-[#2E7D32]
  hover:bg-white
  text-white
  hover:text-[#2E7D32]
  px-4 py-2
  rounded-full
  text-sm
  border-2 border-transparent
  hover:border-[#2E7D32]
  transition-all duration-300
"
              >
                Login
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md z-50">
          <div className="p-4 space-x-[29px] ">
            <Link onClick={() => setIsMenuOpen(false)} href="/">
              Home
            </Link>
            <Link onClick={() => setIsMenuOpen(false)} href="/aboutUs">
              About Us
            </Link>
            <Link onClick={() => setIsMenuOpen(false)} href="/services">
              Services
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  href="/dashboard/serviceDetails"
                >
                  Service Details
                </Link>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  href="/dashboard/profile"
                >
                  Profile
                </Link>
              </>
            )}

            {isLoggedIn ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  localStorage.removeItem("user");
                  window.dispatchEvent(new Event("auth-change"));
                  window.location.href = "/api/auth/logout";
                }}
                className="block w-full text-left text-red-600 px-3 py-2"
              >
                Logout
              </button>
            ) : (
              <Link
                onClick={() => setIsMenuOpen(false)}
                href="/login"
                className="block px-3 py-2 bg-blue-500 text-white rounded-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

/* Reusable Desktop Link */
const NavLink = ({ href, pathname, children }) => (
  <Link
    href={href}
    className={`text-sm font-medium border-b-2 pb-1 ${
      pathname === href
        ? "border-blue-500 text-gray-900"
        : "border-transparent text-gray-500 hover:text-gray-700"
    }`}
  >
    {children}
  </Link>
);

/* Reusable Mobile Link */
const MobileLink = ({ href, children, className = "" }) => (
  <Link
    href={href}
    className={`block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 ${className}`}
  >
    {children}
  </Link>
);

export default Navbar;
