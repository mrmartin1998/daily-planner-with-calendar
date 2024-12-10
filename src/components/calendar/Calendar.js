'use client';
import { useState } from 'react';
import { format, addDays, subDays, startOfToday } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';
import DailyView from './DailyView';
import WeekView from './WeekView';
import MonthView from './MonthView';
export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [view, setView] = useState('daily'); // daily, weekly, monthly
  const { tasks } = useTaskContext();

  const navigateDate = (direction) => {
    const amount = {
      daily: 1,
      weekly: 7,
      monthly: 30
    }[view] || 1;

    if (direction === 'prev') {
      setSelectedDate(prev => subDays(prev, amount));
    } else if (direction === 'next') {
      setSelectedDate(prev => addDays(prev, amount));
    } else if (direction === 'today') {
      setSelectedDate(startOfToday());
    }
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
          {format(selectedDate, 'MMMM d, yyyy')}
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
        {view === 'daily' && <DailyView selectedDate={selectedDate} tasks={tasks} />}
        {view === 'weekly' && <WeekView selectedDate={selectedDate} tasks={tasks} />}
        {view === 'monthly' && <MonthView selectedDate={selectedDate} tasks={tasks} />}
      </div>
    </div>
  );
} 