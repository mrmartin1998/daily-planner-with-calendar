'use client';
import { format, isSameDay } from 'date-fns';

export default function DailyView({ selectedDate, tasks }) {
  // Generate array of hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Filter tasks for the selected date
  const dailyTasks = tasks.filter(task => 
    isSameDay(new Date(task.dueDate), selectedDate)
  );

  return (
    <div className="h-full overflow-auto">
      <div className="grid grid-cols-[60px_1fr] gap-2">
        {/* Time labels */}
        <div className="space-y-8">
          {hours.map(hour => (
            <div key={hour} className="text-sm text-base-content/70 text-right pr-2 pt-2 sticky left-0">
              {format(new Date().setHours(hour), 'ha')}
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="relative">
          {/* Hour grid lines */}
          {hours.map(hour => (
            <div 
              key={hour}
              className="h-10 border-t border-base-content/10 relative"
            >
              {/* Task cards will go here */}
              {dailyTasks
                .filter(task => new Date(task.dueDate).getHours() === hour)
                .map(task => (
                  <div
                    key={task.id}
                    className="absolute w-full bg-primary/10 rounded p-2 border border-primary/20"
                    style={{ top: '0' }}
                  >
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <p className="text-xs text-base-content/70">
                      {format(new Date(task.dueDate), 'h:mm a')}
                    </p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 