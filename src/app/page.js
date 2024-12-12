import TodayOverview from '@/components/dashboard/TodayOverview';
import UpcomingTasks from '@/components/dashboard/UpcomingTasks';
import TaskStatistics from '@/components/dashboard/TaskStatistics';
import QuickActions from '@/components/dashboard/QuickActions';

export default function Home() {
  return (
    <main className="flex-1 p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <QuickActions />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Overview Card */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-lg mb-2">Today's Overview</h3>
            <TodayOverview />
          </div>
        </div>

        {/* Upcoming Tasks Card */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-lg mb-2">Upcoming Tasks</h3>
            <UpcomingTasks />
          </div>
        </div>

        {/* Task Statistics Card */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-lg mb-2">Task Statistics</h3>
            <TaskStatistics />
          </div>
        </div>
      </div>
    </main>
  );
}