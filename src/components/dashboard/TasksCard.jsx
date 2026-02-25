import React from 'react';
import SectionCard from '../ui/SectionCard';
import { tasks } from '@/data/dashboardSample';
const TasksCard = () => {
    return (
       <SectionCard title="Today's Tasks">
      <ul className="space-y-2 text-sm">
        {tasks.map((task, i) => (
          <li key={i} className="flex items-center gap-2">
             {task}
          </li>
        ))}
      </ul>
    </SectionCard>
    );
};

export default TasksCard;