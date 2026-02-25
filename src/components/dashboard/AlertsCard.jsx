import React from 'react';
import SectionCard from '../ui/SectionCard';
import { alerts } from '@/data/dashboardSample';
import Button from '../ui/Button';
const AlertsCard = () => {
    return (
        <SectionCard title="Alerts">
      <ul className="space-y-2 text-sm text-red-600">
        {alerts.map((alert, i) => (
          <li key={i}>⚠ {alert}</li>
        ))}
      </ul>
      <div className="flex justify-end mt-5">
        <Button>View Details</Button>
      </div>
    </SectionCard>
    );
};

export default AlertsCard;