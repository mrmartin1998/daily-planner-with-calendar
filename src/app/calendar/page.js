'use client';
import Calendar from '@/components/calendar/Calendar';

export default function CalendarPage() {
  return (
    <main className="flex-1 p-4">
      <h2 className="text-2xl font-bold mb-4">Calendar</h2>
      <Calendar />
    </main>
  );
} 