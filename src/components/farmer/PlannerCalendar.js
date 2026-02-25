'use client';

import Card from "../ui/Card";

/**
 * PlannerCalendar Component - Smart planning calendar with farming events
 * Shows important farming dates and activities
 */



export default function PlannerCalendar({ events }) {
  const getEventColor = (type) => {
    const colors = {
      irrigation: 'bg-blue-100 text-blue-800 border-blue-300',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      harvest: 'bg-green-100 text-green-800 border-green-300',
      fertilizer: 'bg-orange-100 text-orange-800 border-orange-300',
      pesticide: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getEventIcon = (type) => {
    const icons = {
      irrigation: '💧',
      maintenance: '🔧',
      harvest: '🌾',
      fertilizer: '🧪',
      pesticide: '🦠',
    };
    return icons[type] || '📅';
  };

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Card title="Smart Planner Calendar" icon="📅">
      <div className="space-y-3">
        {sortedEvents.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No upcoming events scheduled</p>
        ) : (
          sortedEvents.map((event, index) => {
            const eventDate = new Date(event.date);
            const today = new Date();
            const daysAway = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={index}
                className={`border-2 border-l-4 rounded-lg p-4 ${getEventColor(event.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl mt-1">{getEventIcon(event.type)}</span>
                    <div>
                      <h4 className="font-bold">{event.event}</h4>
                      <p className="text-sm opacity-75">
                        {event.date}
                        {daysAway >= 0 && (
                          <span className="ml-2">
                            ({daysAway === 0 ? 'Today' : `${daysAway} days away`})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {/* BACKEND PLACEHOLDER - Calendar event actions (edit, delete, mark complete) to be implemented */}
                  <button className="text-lg hover:scale-125 transition">✓</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Event Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        {/* BACKEND PLACEHOLDER - Add event functionality to be implemented */}
        <button className="w-full bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition font-medium">
          + Add Event
        </button>
      </div>
    </Card>
  );
}
