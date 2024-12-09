import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
      <div className="menu p-4 w-80 min-h-full bg-base-200">
        <div className="flex items-center gap-2 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          <Link href="/" className="text-xl font-bold">Daily Planner</Link>
        </div>
        <ul>
          <li><Link href="/">Dashboard</Link></li>
          <li><Link href="/calendar">Calendar</Link></li>
          <li><Link href="/tasks">Tasks</Link></li>
          <li><Link href="/reminders">Reminders</Link></li>
        </ul>
      </div>
    </div>
  );
}
