'use client';
import { format, isSameDay, parseISO } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';

export default function DailyView({ selectedDate, tasks }) {
  const { categories } = useTaskContext();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const dailyTasks = tasks.filter(task => 
    isSameDay(parseISO(task.dueDate), selectedDate)
  );

  const getTaskCategory = (categoryId) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <div className="grid grid-cols-[80px_1fr] gap-2">
      {/* Time labels */}
      <div className="space-y-8">
        {hours.map(hour => (
          <div key={hour} className="text-sm text-base-content/70 text-right pr-2 pt-2 h-20">
            {format(new Date().setHours(hour), 'ha')}
          </div>
        ))}
      </div>

      {/* Time slots */}
      <div className="relative">
        {hours.map(hour => (
          <div 
            key={hour}
            className="h-20 border-t border-base-content/10 relative group"
          >
            {dailyTasks
              .filter(task => new Date(task.dueDate).getHours() === hour)
              .map(task => {
                const category = getTaskCategory(task.categoryId);
                return (
                  <div
                    key={task.id}
                    className="absolute w-[95%] rounded-lg p-2 shadow-md"
                    style={{ 
                      top: '4px',
                      backgroundColor: category ? `${category.color}20` : 'hsl(var(--p) / 0.1)',
                      borderLeft: category ? `3px solid ${category.color}` : '3px solid hsl(var(--p))'
                    }}
                  >
                    <h4 className="font-medium text-sm truncate">{task.title}</h4>
                    <p className="text-xs text-base-content/70">
                      {format(parseISO(task.dueDate), 'h:mm a')}
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