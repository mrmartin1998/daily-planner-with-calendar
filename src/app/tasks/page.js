'use client';
import { useState } from 'react';
import TaskList from '@/components/tasks/TaskList';

export default function TasksPage() {
  const [tasks] = useState([
    {
      id: '1',
      title: 'Complete Project Proposal',
      description: 'Write and submit the project proposal for the new client',
      dueDate: new Date('2024-03-20'),
      priority: 'high',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Team Meeting',
      description: 'Weekly team sync to discuss project progress',
      dueDate: new Date('2024-03-15'),
      priority: 'medium',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  return (
    <main className="flex-1 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <button className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Task
        </button>
      </div>
      <TaskList tasks={tasks} />
    </main>
  );
} 