'use client';

/**
 * Card Component - Reusable card container
 * Used for displaying data in organized card layouts
 */

export default function Card({ 
  children, 
  title, 
  icon, 
  className = '',
  hover = true,
  actions = null 
}) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md border-l-4 border-green-800 p-6
        ${hover ? 'hover:shadow-lg transition-shadow duration-300' : ''}
        ${className}
      `}
    >
      {/* Card Header */}
      {(title || icon || actions) && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {icon && <span className="text-2xl">{icon}</span>}
            {title && <h3 className="text-lg font-bold text-green-800">{title}</h3>}
          </div>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className="text-gray-700">{children}</div>
    </div>
  );
}
