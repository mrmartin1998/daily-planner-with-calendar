'use client';
import { useTaskContext } from '@/context/TaskContext';
import TaskCard from './TaskCard';

export default function TaskList() {
  const { tasks } = useTaskContext();

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 bg-base-200 rounded-lg">
        <h3 className="font-semibold mb-2">No tasks yet</h3>
        <p className="text-base-content/70">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
