'use client';

/**
 * StatCard Component - Displays key metrics and statistics
 * Used for dashboard overview sections
 */

export default function StatCard({ 
  icon, 
  label, 
  value, 
  unit = '',
  trend = null,
  trendUp = true,
  className = ''
}) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-6 border-l-4 border-green-800
        hover:shadow-lg transition-shadow duration-300
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
          <div className="flex items-baseline space-x-1">
            <p className="text-3xl font-bold text-green-800">{value}</p>
            {unit && <span className="text-gray-600">{unit}</span>}
          </div>
          {trend && (
            <p className={`text-sm mt-2 font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trendUp ? '📈' : '📉'} {trend}
            </p>
          )}
        </div>
        <span className="text-4xl opacity-80">{icon}</span>
      </div>
    </div>
  );
}
