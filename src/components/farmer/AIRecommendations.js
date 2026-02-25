'use client';

/**
 * AIRecommendations Component - Display AI-powered farming recommendations
 * Provides intelligent suggestions for crop management
 */


import Badge from '../ui/Badge';
import Card from '../ui/Card';


export default function AIRecommendations({ recommendations }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'info';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '🟢';
    }
  };

  return (
    <Card title="AI-Powered Recommendations" icon="🤖">
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No recommendations at this time</p>
        ) : (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`border-2 border-l-4 rounded-lg p-4 ${
                rec.priority === 'High'
                  ? 'bg-red-50 border-l-red-600 border-red-200'
                  : rec.priority === 'Medium'
                  ? 'bg-yellow-50 border-l-yellow-600 border-yellow-200'
                  : 'bg-green-50 border-l-green-600 border-green-200'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getPriorityIcon(rec.priority)}</span>
                  <div>
                    <h4 className="font-bold text-gray-900">{rec.recommendation}</h4>
                    <p className="text-sm text-gray-600 mt-1">Crop: {rec.crop}</p>
                  </div>
                </div>
                <Badge variant={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
              </div>

              <p className="text-gray-700 mb-4 bg-white bg-opacity-50 rounded p-3">{rec.details}</p>

              <button className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition text-sm font-medium">
                {rec.action}
              </button>
            </div>
          ))
        )}
      </div>

      {/* BACKEND PLACEHOLDER - AI recommendation generation to be implemented with ML model */}
      {/* Recommendations are currently mock data - will integrate with backend AI service */}
    </Card>
  );
}
