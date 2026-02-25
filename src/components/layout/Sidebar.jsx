'use client';

export default function Sidebar({ userRole }) {
  return (
    <aside className="w-64 border-r min-h-screen p-4">
      <nav className="space-y-2">
        {/* Navigation items based on user role */}
        {userRole === 'farmer' && (
          <>
            <a href="/farmer/dashboard" className="block p-2 hover:bg-gray-100 rounded">Dashboard</a>
            <a href="/farmer/crops" className="block p-2 hover:bg-gray-100 rounded">My Crops</a>
            <a href="/farmer/expenses" className="block p-2 hover:bg-gray-100 rounded">Expenses</a>
            <a href="/farmer/planner" className="block p-2 hover:bg-gray-100 rounded">Farm Planner</a>
             <a href="/farmer/calculator" className="block p-2 hover:bg-gray-100 rounded">Calculator</a>
            <a href="/farmer/weather" className="block p-2 hover:bg-gray-100 rounded">Weather</a>
            <a href="/farmer/ai-chat" className="block p-2 hover:bg-gray-100 rounded">Ai Crop Recommendation</a>
          </>
        )}
        {userRole === 'buyer' && (
          <>
            <a href="/buyer/dashboard" className="block p-2 hover:bg-gray-100 rounded">Dashboard</a>
            <a href="/buyer/crops" className="block p-2 hover:bg-gray-100 rounded">Browse Crops</a>
            <a href="/buyer/purchases" className="block p-2 hover:bg-gray-100 rounded">My Purchases</a>
          </>
        )}
        {userRole === 'admin' && (
          <>
            <a href="/admin/dashboard" className="block p-2 hover:bg-gray-100 rounded">Dashboard</a>
            <a href="/admin/users" className="block p-2 hover:bg-gray-100 rounded">Users</a>
            <a href="/admin/analytics" className="block p-2 hover:bg-gray-100 rounded">Analytics</a>
          </>
        )}
      </nav>
    </aside>
  );
}

