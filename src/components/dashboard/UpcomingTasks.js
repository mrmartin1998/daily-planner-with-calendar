'use client';
import { useTaskContext } from '@/context/TaskContext';
import { format, parseISO, isFuture, isToday } from 'date-fns';

export default function UpcomingTasks() {
  const { tasks } = useTaskContext();
  
  const upcomingTasks = tasks
    .filter(task => isToday(parseISO(task.dueDate)) || isFuture(parseISO(task.dueDate)))
    .sort((a, b) => parseISO(a.dueDate) - parseISO(b.dueDate))
    .slice(0, 3);

  return (
    <div className="space-y-2">
      {upcomingTasks.map(task => (
        <div key={task.id} className="flex justify-between items-center p-2 bg-base-200 rounded">
          <span className="font-medium">{task.title}</span>
          <span className="text-sm opacity-70">
            {format(parseISO(task.dueDate), 'MMM d')}
          </span>
        </div>
      ))}
    </div>
  );
}