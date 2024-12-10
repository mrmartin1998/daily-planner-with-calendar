'use client';
import { format, isSameDay, parseISO, isValid } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';

export default function DailyView({ selectedDate, tasks }) {
  const { categories } = useTaskContext();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const dailyTasks = tasks.filter(task => {
    const taskDate = parseISO(task.dueDate);
    return isSameDay(taskDate, selectedDate);
  });

  const getTaskCategory = (categoryId) => {
    return categories.find(c => c.id === categoryId) || null;
  };

  const getTaskTime = (task) => {
    try {
      const date = parseISO(task.dueDate);
      if (!isValid(date)) return null;
      
      // Convert to local time
      const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      return localDate;
    } catch (error) {
      console.error('Error parsing task time:', error);
      return null;
    }
  };

  return (
    <div className="grid grid-cols-[80px_1fr] gap-2">
      {/* Time labels */}
      <div>
        {hours.map(hour => (
          <div 
            key={`label-${hour}`} 
            className="h-20 text-sm text-base-content/70 text-right pr-2"
            style={{ marginTop: '0.1px' }}
          >
            {String(hour).padStart(2, '0')}:00
          </div>
        ))}
      </div>

      {/* Time slots */}
      <div className="relative border-l border-base-content/10">
        {hours.map(hour => (
          <div 
            key={`slot-${hour}`}
            className="h-20 border-t border-base-content/10 relative"
          >
            {dailyTasks.map((task) => {
              const taskTime = getTaskTime(task);
              if (!taskTime) return null;

              const taskHour = taskTime.getHours();
              if (taskHour !== hour) return null;

              const category = getTaskCategory(task.categoryId);
              
              return (
                <div
                  key={`${task.id}-${hour}`}
                  className="absolute inset-x-0 mx-1 rounded-lg p-2 shadow-md z-10"
                  style={{ 
                    backgroundColor: category ? `${category.color}20` : 'hsl(var(--p) / 0.1)',
                    borderLeft: category ? `3px solid ${category.color}` : '3px solid hsl(var(--p))',
                    height: 'calc(100% - 4px)',
                    top: '2px'
                  }}
                >
                  <h4 className="font-medium text-sm truncate">{task.title}</h4>
                  <p className="text-xs text-base-content/70">
                    {format(taskTime, 'HH:mm')}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}