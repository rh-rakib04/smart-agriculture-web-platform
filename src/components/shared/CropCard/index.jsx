'use client';

export default function CropCard({ crop }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold">{crop?.name || 'Crop Name'}</h3>
      <p className="text-gray-600">{crop?.type || 'Crop Type'}</p>
      {/* Crop card content */}
    </div>
  );
}

