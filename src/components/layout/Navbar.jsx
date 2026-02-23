'use client';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-bold">Smart Agriculture</a>
            <div className="hidden md:flex space-x-4">
              <a href="/" className="hover:text-gray-600">Home</a>
              <a href="/news" className="hover:text-gray-600">News</a>
              <a href="/about" className="hover:text-gray-600">About</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/login" className="px-4 py-2 text-sm">Login</a>
            <a href="/register" className="px-4 py-2 bg-green-600 text-white rounded text-sm">Sign Up</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

