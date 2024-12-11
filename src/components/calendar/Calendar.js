'use client';
import { useState, useEffect } from 'react';
import { 
  format, 
  addDays, 
  subDays, 
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfToday 
} from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';
import DailyView from './DailyView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import TaskForm from '../tasks/TaskForm';
import TaskDetailsModal from '../tasks/TaskDetailsModal';

export default function Calendar() {
  const { tasks, createTask, deleteTask } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [view, setView] = useState('daily');
  const [slotInitialData, setSlotInitialData] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const handleSlotClick = (event) => {
      console.log('Calendar - Received slot click event with data:', event.detail);
      setSlotInitialData({
        ...event.detail,
        _timestamp: Date.now()
      });
    };

    window.addEventListener('calendar:slot-click', handleSlotClick);
    return () => window.removeEventListener('calendar:slot-click', handleSlotClick);
  }, []);

  const handleCreateTask = (formData) => {
    console.log('Calendar - Creating task with data:', formData);
    createTask(formData);
    document.getElementById('calendar-task-modal').close();
    setSlotInitialData(null); // Reset the initial data
    console.log('Calendar - Reset slotInitialData to null');
  };

  const navigateDate = (direction) => {
    if (direction === 'today') {
      setSelectedDate(startOfToday());
      return;
    }

    setSelectedDate(prev => {
      switch (view) {
        case 'daily':
          return direction === 'prev' ? subDays(prev, 1) : addDays(prev, 1);
        case 'weekly':
          return direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1);
        case 'monthly':
          return direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1);
        default:
          return prev;
      }
    });
  };

  const getHeaderDate = () => {
    switch (view) {
      case 'daily':
        return format(selectedDate, 'MMMM d, yyyy');
      case 'weekly':
        return `Week of ${format(selectedDate, 'MMMM d, yyyy')}`;
      case 'monthly':
        return format(selectedDate, 'MMMM yyyy');
      default:
        return format(selectedDate, 'MMMM d, yyyy');
    }
  };

  const handleTaskClick = (e, task) => {
    e.stopPropagation(); // Prevent triggering the time slot click
    setSelectedTask(task);
    document.getElementById('task-details-modal').showModal();
  };

  const handleEditTask = (task) => {
    setSlotInitialData(task);
    document.getElementById('calendar-task-modal').showModal();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button 
            className="btn btn-square btn-sm"
            onClick={() => navigateDate('prev')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            className="btn btn-square btn-sm"
            onClick={() => navigateDate('next')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <button 
            className="btn btn-sm"
            onClick={() => navigateDate('today')}
          >
            Today
          </button>
        </div>

        <h3 className="text-xl font-semibold">
          {getHeaderDate()}
        </h3>

        <div className="join">
          <button 
            className={`join-item btn btn-sm ${view === 'daily' ? 'btn-active' : ''}`}
            onClick={() => setView('daily')}
          >
            Day
          </button>
          <button 
            className={`join-item btn btn-sm ${view === 'weekly' ? 'btn-active' : ''}`}
            onClick={() => setView('weekly')}
          >
            Week
          </button>
          <button 
            className={`join-item btn btn-sm ${view === 'monthly' ? 'btn-active' : ''}`}
            onClick={() => setView('monthly')}
          >
            Month
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 bg-base-200 rounded-lg p-4 overflow-hidden">
        <div className="transition-all duration-300 ease-in-out">
          {view === 'daily' && (
            <DailyView 
              selectedDate={selectedDate} 
              tasks={tasks} 
              onTaskClick={handleTaskClick}
            />
          )}
          {view === 'weekly' && (
            <WeekView 
              selectedDate={selectedDate} 
              tasks={tasks} 
              onTaskClick={handleTaskClick}
            />
          )}
          {view === 'monthly' && (
            <MonthView 
              selectedDate={selectedDate} 
              tasks={tasks} 
              onTaskClick={handleTaskClick}
            />
          )}
        </div>
      </div>

      {/* Task Creation Modal */}
      <dialog id="calendar-task-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Create New Task</h3>
          <TaskForm 
            onSubmit={handleCreateTask}
            initialData={slotInitialData}
            modalId="calendar-task-modal"
          />
        </div>
      </dialog>

      {/* Task Details Modal */}
      <TaskDetailsModal 
        task={selectedTask}
        onEdit={handleEditTask}
        onDelete={deleteTask}
      />
    </div>
  );
} 