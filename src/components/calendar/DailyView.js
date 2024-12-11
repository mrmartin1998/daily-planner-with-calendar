'use client';
import { format, isSameDay, parseISO, isValid, isPast, addMinutes, isWithinInterval } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';
import { useState, useEffect } from 'react';

export default function DailyView({ selectedDate, tasks, onTaskClick }) {
  const { categories, createTask } = useTaskContext();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  // Calculate current time indicator position
  const getCurrentTimePosition = () => {
    const now = currentTime;
    const minutes = now.getHours() * 60 + now.getMinutes();
    return (minutes / 1440) * 100; // Convert to percentage of day
  };

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
    document.getElementById('calendar-task-modal').showModal();
  };

  const isSameHour = (date1, date2) => {
    // Ensure both are Date objects
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getHours() === d2.getHours();
  };

  const calculateTaskPositions = (tasks) => {
    if (!tasks.length) return [];
    
    // Sort tasks by start time and then by title
    const sortedTasks = [...tasks].slice(0, MAX_VISIBLE_TASKS).sort((a, b) => {
      const timeA = getTaskTime(a);
      const timeB = getTaskTime(b);
      const timeDiff = timeA.getTime() - timeB.getTime();
      return timeDiff === 0 ? a.title.localeCompare(b.title) : timeDiff;
    });

    // For simplicity, just assign positions sequentially
    return sortedTasks.map((task, index) => ({
      task,
      position: index,
      total: sortedTasks.length
    }));
  };

  const isOverlapping = (task1, task2) => {
    const time1 = getTaskTime(task1);
    const time2 = getTaskTime(task2);
    const diffInMinutes = Math.abs(time1.getTime() - time2.getTime()) / (1000 * 60);
    return diffInMinutes < 30; // Tasks within 30 minutes are considered overlapping
  };

  const MAX_VISIBLE_TASKS = 4;

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
        {/* Current time indicator */}
        {isSameDay(currentTime, selectedDate) && (
          <div 
            className="absolute w-full z-10 flex items-center pointer-events-none"
            style={{ top: `${getCurrentTimePosition()}%` }}
          >
            <div className="w-2 h-2 rounded-full bg-primary -ml-1"></div>
            <div className="flex-1 border-t border-primary"></div>
          </div>
        )}

        {Array.from({ length: 24 }, (_, hour) => {
          const hourTasks = dailyTasks.filter(task => {
            const taskTime = getTaskTime(task);
            return taskTime && taskTime.getHours() === hour;
          });

          const taskPositions = calculateTaskPositions(hourTasks);

          return (
            <div 
              key={`slot-${hour}`}
              className={`
                h-20 border-t border-base-content/10 relative 
                hover:bg-base-200 cursor-pointer transition-colors
                ${isSameHour(currentTime, new Date(selectedDate.getTime())) && hour === currentTime.getHours() ? 'bg-primary/5' : ''}
              `}
              onClick={() => handleTimeSlotClick(hour)}
            >
              {taskPositions.map(({ task, position, total }) => {
                const category = getTaskCategory(task.categoryId);
                const status = getTaskStatus(task);
                const width = `${100 / total}%`;
                const left = `${(position * 100) / total}%`;
                
                return (
                  <div
                    key={task.id}
                    className={`absolute mx-0.5 my-0.5 rounded-lg p-2 shadow-sm text-sm hover:ring-2 hover:ring-primary/50 cursor-pointer group
                      ${status === 'overdue' ? 'border-error border-2' : ''}
                      ${status === 'upcoming' ? 'border-warning border-2' : ''}
                      transition-all duration-200
                    `}
                    title={`${task.title} - ${format(getTaskTime(task), 'HH:mm')}`}
                    style={{
                      backgroundColor: category ? `${category.color}20` : 'hsl(var(--p) / 0.1)',
                      borderLeft: category ? `3px solid ${category.color}` : '3px solid hsl(var(--p))',
                      width: `calc(${100 / total}% - 8px)`,
                      left: `calc(${(position * 100) / total}% + 4px)`,
                      zIndex: position + 1,
                      height: 'calc(100% - 4px)'
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
                      {format(getTaskTime(task), 'HH:mm')}
                    </p>
                    {taskPositions.length > MAX_VISIBLE_TASKS && (
                      <div 
                        className="absolute right-1 bottom-1 text-xs text-base-content/70 bg-base-100 px-1 rounded"
                        style={{ zIndex: taskPositions.length + 1 }}
                      >
                        +{taskPositions.length - MAX_VISIBLE_TASKS} more
                      </div>
                    )}
                  </div>
                );
              })}
              {hourTasks.length > MAX_VISIBLE_TASKS && (
                <div 
                  className="absolute right-2 top-2 text-xs font-medium bg-base-300/90 px-2 py-0.5 rounded-full shadow-sm z-50"
                >
                  +{hourTasks.length - MAX_VISIBLE_TASKS} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}