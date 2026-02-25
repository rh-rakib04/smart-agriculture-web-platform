'use client';

/**
 * Badge Component - For displaying status and labels
 * Supports success, warning, danger, and info variants
 */

export default function Badge({ 
  children, 
  variant = 'info',
  icon = null 
}) {
  const variants = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={`
        inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium
        ${variants[variant]}
      `}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
