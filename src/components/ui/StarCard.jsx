import React from 'react';

const StarCard = ({ title, value, trend, danger }) => {
    return (
         <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500">{title}</p>

      <div className="flex items-end justify-between mt-2">
        <p className="text-2xl font-bold text-gray-800">
          {value}
        </p>

        <span
          className={`text-xs px-2 py-1 rounded-full
            ${danger
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
            }`}
        >
          {trend}
        </span>
      </div>
    </div>
    );
};

export default StarCard;