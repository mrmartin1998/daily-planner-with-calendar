'use client';
import { useTaskContext } from '@/context/TaskContext';
import { format, isToday, parseISO } from 'date-fns';

export default function TodayOverview() {
  const { tasks } = useTaskContext();
  const todayTasks = tasks.filter(task => isToday(parseISO(task.dueDate)));
  
  const completed = todayTasks.filter(task => task.status === 'completed').length;
  const total = todayTasks.length;

  return (
    <div className="space-y-4">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Tasks Today</div>
          <div className="stat-value">{total}</div>
          <div className="stat-desc">{completed} completed</div>
        </div>
      </div>
      
      <div className="text-sm">
        {format(new Date(), 'EEEE, MMMM d, yyyy')}
      </div>
    </div>
  );
}