import React from 'react';

const SectionCard = ({ title, children }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="font-semibold text-gray-700 mb-3">
        {title}
      </h2>
      {children}
    </div>
    );
};

export default SectionCard;