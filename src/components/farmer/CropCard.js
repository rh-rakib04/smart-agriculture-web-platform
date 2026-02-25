'use client';

import Badge from "../ui/Badge";

/**
 * CropCard Component - Display individual crop information
 * Used in farmer's crop management section
 */



export default function CropCard({ crop }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Growing': return 'info';
      case 'Harvested': return 'success';
      case 'Planned': return 'warning';
      default: return 'info';
    }
  };

  const daysUntilHarvest = crop.expectedHarvestDate
    ? Math.ceil((new Date(crop.expectedHarvestDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md border-l-4 border-green-800 p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-green-800 mb-1 flex items-center space-x-2">
            <span>🌾</span>
            <span>{crop.name}</span>
          </h3>
          <Badge variant={getStatusColor(crop.status)}>{crop.status}</Badge>
        </div>
        <div className="text-right">
          <span className="text-3xl">{crop.health || 0}%</span>
          <p className="text-sm text-gray-600">Health</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
        <div>
          <p className="text-gray-600 text-sm">Area</p>
          <p className="font-semibold text-gray-800">{crop.area} ha</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Planted</p>
          <p className="font-semibold text-gray-800">{crop.plantedDate}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Stage</p>
          <p className="font-semibold text-gray-800">{crop.stage}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Irrigation</p>
          <p className="font-semibold text-gray-800">{crop.irrigation}</p>
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 mb-2">Expected Harvest</p>
        <div className="flex justify-between items-center">
          <p className="font-bold text-green-800">{crop.expectedHarvestDate}</p>
          <p className="text-sm font-semibold text-green-700">
            {daysUntilHarvest > 0 ? `${daysUntilHarvest} days` : 'Ready'}
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        {/* BACKEND PLACEHOLDER - Crop edit and delete functionality to be implemented */}
        <button className="flex-1 bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition font-medium">
          📝 Edit
        </button>
        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
          📊 View Details
        </button>
      </div>
    </div>
  );
}
