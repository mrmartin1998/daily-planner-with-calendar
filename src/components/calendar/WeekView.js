'use client';
import { format, startOfWeek, addDays, isSameDay, parseISO, isValid } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';

export default function WeekView({ selectedDate, tasks }) {
  const { categories } = useTaskContext();
  
  // Get the start of the week from selected date
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start on Monday
  
  // Create array of dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getTaskCategory = (categoryId) => {
    return categories.find(c => c.id === categoryId) || null;
  };

  const getDayTasks = (date) => {
    return tasks.filter(task => {
      const taskDate = parseISO(task.dueDate);
      return isValid(taskDate) && isSameDay(taskDate, date);
    });
  };

  return (
    <div className="grid grid-cols-7 h-full gap-2">
      {/* Day headers */}
      {weekDates.map((date) => (
        <div key={date.toString()} className="flex flex-col">
          <div className="text-sm text-base-content/70 pb-2 text-center">
            <div>{format(date, 'EEE')}</div>
            <div className="font-semibold">{format(date, 'd')}</div>
          </div>
          
          {/* Day column */}
          <div className="flex-1 bg-base-100 rounded-lg p-2 overflow-y-auto">
            {getDayTasks(date).map((task) => {
              const category = getTaskCategory(task.categoryId);
              return (
                <div
                  key={task.id}
                  className="mb-2 rounded-lg p-2 shadow-sm text-sm"
                  style={{
                    backgroundColor: category ? `${category.color}20` : 'hsl(var(--p) / 0.1)',
                    borderLeft: category ? `3px solid ${category.color}` : '3px solid hsl(var(--p))'
                  }}
                >
                  <h4 className="font-medium truncate">{task.title}</h4>
                  <p className="text-xs text-base-content/70">
                    {format(parseISO(task.dueDate), 'HH:mm')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
