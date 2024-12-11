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
  const { tasks, createTask, deleteTask, updateTask } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [view, setView] = useState('daily');
  const [slotInitialData, setSlotInitialData] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewTransitioning, setViewTransitioning] = useState(false);

  useEffect(() => {
    const handleSlotClick = (event) => {
      setSelectedTask(null);
      setSlotInitialData({
        ...event.detail,
        _timestamp: Date.now()
      });
      document.getElementById('calendar-task-modal').showModal();
    };

    window.addEventListener('calendar:slot-click', handleSlotClick);
    return () => window.removeEventListener('calendar:slot-click', handleSlotClick);
  }, []);

  const handleCreateTask = (formData) => {
    try {
      const { dueDate, dueTime } = formData;
      
      // Validate date format
      if (!dueDate || !dueTime) {
        throw new Error('Date and time are required');
      }
      
      // Parse the date and time
      let dateTime;
      
      if (dueDate.includes('T')) {
        // If it's already an ISO string, parse it directly
        dateTime = new Date(dueDate);
      } else {
        // Otherwise parse as separate date and time
        const [year, month, day] = dueDate.split('-').map(Number);
        const [hours, minutes] = dueTime.split(':').map(Number);
        dateTime = new Date(year, month - 1, day, hours, minutes);
      }
      
      // Validate the resulting date
      if (isNaN(dateTime.getTime())) {
        throw new Error('Invalid date/time combination');
      }
      
      const taskData = {
        ...formData,
        dueDate: dateTime.toISOString()
      };
      
      createTask(taskData);
      document.getElementById('calendar-task-modal').close();
      setSlotInitialData(null);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error creating task:', error);
    }
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
    e.stopPropagation();
    setSelectedTask(task);
    setSlotInitialData(null);
    document.getElementById('task-details-modal').showModal();
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setSlotInitialData(null);
    document.getElementById('calendar-task-modal').showModal();
  };

  const handleEditTask = (formData) => {
    try {
      const updatedTask = {
        ...formData,
        id: selectedTask.id
      };
      updateTask(updatedTask);
      document.getElementById('calendar-task-modal').close();
      setSelectedTask(null);
      setSlotInitialData(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleViewChange = (newView) => {
    setViewTransitioning(true);
    setTimeout(() => {
      setView(newView);
      setViewTransitioning(false);
    }, 150);
  };

  const handleNavigate = (direction) => {
    setViewTransitioning(true);
    navigateDate(direction);
    setTimeout(() => setViewTransitioning(false), 150);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button 
            className="btn btn-square btn-sm"
            onClick={() => handleNavigate('prev')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            className="btn btn-square btn-sm"
            onClick={() => handleNavigate('next')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <button 
            className="btn btn-sm"
            onClick={() => handleNavigate('today')}
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
            onClick={() => handleViewChange('daily')}
          >
            Day
          </button>
          <button 
            className={`join-item btn btn-sm ${view === 'weekly' ? 'btn-active' : ''}`}
            onClick={() => handleViewChange('weekly')}
          >
            Week
          </button>
          <button 
            className={`join-item btn btn-sm ${view === 'monthly' ? 'btn-active' : ''}`}
            onClick={() => handleViewChange('monthly')}
          >
            Month
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 bg-base-200 rounded-lg p-4 overflow-hidden">
        <div 
          className="h-full transition-all duration-300 ease-in-out transform"
          style={{
            opacity: viewTransitioning ? '0' : '1',
            transform: viewTransitioning ? 'scale(0.98)' : 'scale(1)'
          }}
        >
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

      {/* Task Creation/Edit Modal */}
      <dialog id="calendar-task-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">{selectedTask ? 'Edit Task' : 'Create New Task'}</h3>
          <TaskForm 
            onSubmit={selectedTask ? handleEditTask : handleCreateTask}
            initialData={selectedTask || slotInitialData}
            modalId="calendar-task-modal"
            mode={selectedTask ? 'edit' : 'create'}
          />
        </div>
      </dialog>

      {/* Task Details Modal */}
      <TaskDetailsModal 
        task={selectedTask}
        onEdit={handleEditClick}
        onDelete={deleteTask}
      />
    </div>
  );
} 