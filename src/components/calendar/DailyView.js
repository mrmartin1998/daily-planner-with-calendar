'use client';
import { format, isSameDay, parseISO, isValid, isPast, addMinutes, isWithinInterval } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';

export default function DailyView({ selectedDate, tasks, onTaskClick }) {
  const { categories, createTask } = useTaskContext();
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

  const handleTimeSlotClick = (hour) => {
    console.log('DailyView - Clicked hour:', hour);
    console.log('DailyView - Selected date:', selectedDate);

    // Create a new date object for the selected date and hour
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(hour, 0, 0, 0);
    
    console.log('DailyView - Selected DateTime:', selectedDateTime);
    console.log('DailyView - Selected DateTime Hour:', selectedDateTime.getHours());

    // Format the date and time for the form
    const formattedDate = format(selectedDateTime, 'yyyy-MM-dd');
    const formattedTime = format(selectedDateTime, 'HH:mm');
    
    console.log('DailyView - Formatted date:', formattedDate);
    console.log('DailyView - Formatted time:', formattedTime);

    // Create initial data object
    const initialData = {
      dueDate: formattedDate,
      dueTime: formattedTime
    };

    console.log('DailyView - Dispatching event with data:', initialData);

    // Pass the initialData through a custom event
    const event = new CustomEvent('calendar:slot-click', { 
      detail: initialData 
    });
    window.dispatchEvent(event);
    
    // Open the task modal
    const modal = document.getElementById('calendar-task-modal');
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <div className="grid grid-cols-[80px_1fr] gap-2">
      {/* Time labels column */}
      <div className="space-y-0">
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">00:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">01:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">02:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">03:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">04:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">05:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">06:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">07:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">08:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">09:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">10:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">11:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">12:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">13:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">14:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">15:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">16:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">17:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">18:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">19:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">20:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">21:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">22:00</div>
        <div className="h-20 text-sm text-base-content/70 text-right pr-2">23:00</div>
      </div>

      {/* Time slots column */}
      <div className="relative border-l border-base-content/10">
        {Array.from({ length: 24 }, (_, hour) => {
          const hourTasks = dailyTasks.filter(task => {
            const taskTime = getTaskTime(task);
            return taskTime && taskTime.getHours() === hour;
          });

          return (
            <div 
              key={`slot-${hour}`}
              className="h-20 border-t border-base-content/10 relative hover:bg-base-200 cursor-pointer transition-colors"
              onClick={() => handleTimeSlotClick(hour)}
            >
              {hourTasks.map((task) => {
                const category = getTaskCategory(task.categoryId);
                const status = getTaskStatus(task);
                
                return (
                  <div
                    key={task.id}
                    className={`absolute inset-x-0 mx-1 my-1 rounded-lg p-2 shadow-sm text-sm hover:ring-2 hover:ring-primary/50 cursor-pointer
                      ${status === 'overdue' ? 'border-error border-2' : ''}
                      ${status === 'upcoming' ? 'border-warning border-2' : ''}
                    `}
                    style={{
                      backgroundColor: category ? `${category.color}20` : 'hsl(var(--p) / 0.1)',
                      borderLeft: category ? `3px solid ${category.color}` : '3px solid hsl(var(--p))'
                    }}
                    onClick={(e) => onTaskClick(e, task)}
                  >
                    <h4 className="font-medium truncate flex items-center gap-1">
                      {task.title}
                      {task.reminder && <span className="text-warning text-[10px]">⏰</span>}
                    </h4>
                    <p className="text-xs text-base-content/70">
                      {format(getTaskTime(task), 'HH:mm')}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}