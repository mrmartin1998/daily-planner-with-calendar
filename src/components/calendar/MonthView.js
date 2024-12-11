'use client';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  parseISO,
  isValid,
  isPast,
  addMinutes,
  isWithinInterval
} from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';

export default function MonthView({ selectedDate, tasks, onTaskClick }) {
  const { categories } = useTaskContext();

  // Get all days in the month grid (including days from prev/next months)
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Generate array of all days to display
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

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

  const handleDayClick = (date) => {
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

    const modal = document.getElementById('calendar-task-modal');
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {/* Weekday headers */}
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
        <div key={day} className="text-sm font-medium text-center py-2">
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {calendarDays.map(date => {
        const dayTasks = getDayTasks(date);
        const isCurrentMonth = isSameMonth(date, selectedDate);

        return (
          <div
            key={date.toString()}
            className={`min-h-[100px] p-1 border rounded-lg cursor-pointer hover:bg-base-200 transition-colors ${
              isCurrentMonth ? 'bg-base-100' : 'bg-base-200 opacity-50'
            }`}
            onClick={() => handleDayClick(date)}
          >
            <div className="text-sm font-medium mb-1">
              {format(date, 'd')}
            </div>

            <div className="space-y-1">
              {dayTasks.slice(0, 3).map(task => {
                const category = categories.find(c => c.id === task.categoryId);
                const status = getTaskStatus(task);
                return (
                  <div
                    key={task.id}
                    className={`text-xs truncate rounded px-1 py-0.5 flex items-center gap-1 hover:ring-2 hover:ring-primary/50 cursor-pointer
                      ${status === 'overdue' ? 'border-error border' : ''}
                      ${status === 'upcoming' ? 'border-warning border' : ''}
                    `}
                    style={{
                      backgroundColor: category ? `${category.color}20` : 'hsl(var(--p) / 0.1)',
                      borderLeft: category ? `2px solid ${category.color}` : '2px solid hsl(var(--p))'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick(e, task);
                    }}
                  >
                    <span>{task.title}</span>
                    {task.reminder && <span className="text-warning text-[10px]">⏰</span>}
                  </div>
                );
              })}
              {dayTasks.length > 3 && (
                <div className="text-xs text-base-content/70 text-center">
                  +{dayTasks.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
