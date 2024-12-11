'use client';
import { 
  format, 
  startOfWeek, 
  addDays, 
  isSameDay, 
  parseISO, 
  isValid,
  isPast,
  addMinutes,
  isWithinInterval 
} from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';

export default function WeekView({ selectedDate, tasks, onTaskClick }) {
  const { categories } = useTaskContext();
  
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
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

  const getTaskStatus = (task) => {
    const now = new Date();
    const dueDate = parseISO(task.dueDate);
    
    if (isPast(dueDate)) {
      return 'overdue';
    }

    if (task.reminder) {
      const reminderTime = addMinutes(dueDate, -parseInt(task.reminder));
      if (isWithinInterval(now, { start: reminderTime, end: dueDate })) {
        return 'upcoming';
      }
    }

    return 'normal';
  };

  const handleTimeSlotClick = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const formattedTime = format(new Date(), 'HH:mm');

    const initialData = {
      dueDate: formattedDate,
      dueTime: formattedTime
    };

    const event = new CustomEvent('calendar:slot-click', { 
      detail: initialData 
    });
    window.dispatchEvent(event);
    document.getElementById('calendar-task-modal').showModal();
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
          
          <div 
            className="flex-1 bg-base-100 rounded-lg p-2 overflow-y-auto hover:bg-base-200 cursor-pointer transition-colors"
            onClick={() => handleTimeSlotClick(date)}
          >
            {getDayTasks(date).map((task) => {
              const category = getTaskCategory(task.categoryId);
              const status = getTaskStatus(task);
              return (
                <div
                  key={task.id}
                  className={`mb-2 rounded-lg p-2 shadow-sm text-sm hover:ring-2 hover:ring-primary/50 cursor-pointer
                    ${status === 'overdue' ? 'border-error border-2' : ''}
                    ${status === 'upcoming' ? 'border-warning border-2' : ''}
                  `}
                  style={{
                    backgroundColor: category ? `${category.color}20` : 'hsl(var(--p) / 0.1)',
                    borderLeft: category ? `3px solid ${category.color}` : '3px solid hsl(var(--p))'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskClick(e, task);
                  }}
                >
                  <h4 className="font-medium truncate flex items-center gap-1">
                    {task.title}
                    {task.reminder && <span className="text-warning text-[10px]">⏰</span>}
                  </h4>
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
