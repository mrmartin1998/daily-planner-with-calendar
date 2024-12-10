'use client';
import { useTaskContext } from '@/context/TaskContext';
import { reminderService } from '@/services/ReminderService';
import TaskForm from '@/components/tasks/TaskForm';
import { useEffect } from 'react';
import { isPast } from 'date-fns';

export default function RemindersPage() {
  const { tasks, createTask } = useTaskContext();

  useEffect(() => {
    console.log('💡 Current tasks:', tasks);
    console.log('⏰ Tasks with reminders:', tasks.filter(t => t.reminder));
    reminderService.startChecking(tasks);
    return () => reminderService.stopChecking();
  }, [tasks]);

  const handleCreateTask = (formData) => {
    console.log('Creating task with reminder:', formData);
    createTask(formData);
    document.getElementById('reminder-modal').close();
  };

  return (
    <main className="flex-1 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reminders</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => document.getElementById('reminder-modal').showModal()}
        >
          Add Task with Reminder
        </button>
      </div>

      <div className="grid gap-4">
        <div className="p-4 border rounded-lg bg-base-200">
          <h3 className="font-bold mb-2">Active Reminders:</h3>
          <ul className="space-y-2">
            {tasks.filter(t => t.reminder).map(task => (
              <li key={task.id} className="flex items-center justify-between p-2 bg-base-100 rounded">
                <div>
                  <span className="font-medium">{task.title}</span>
                  <span className="text-sm ml-2">
                    Due: {task.dueTime} ({task.reminder}min reminder)
                  </span>
                </div>
                <span className={`badge ${isPast(new Date(`${task.dueDate}T${task.dueTime}`)) ? 'badge-error' : 'badge-primary'}`}>
                  {isPast(new Date(`${task.dueDate}T${task.dueTime}`)) ? 'Overdue' : 'Active'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <dialog id="reminder-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Create Task with Reminder</h3>
          <TaskForm 
            onSubmit={handleCreateTask}
            initialData={{ reminder: '15' }} // Default 15-minute reminder
          />
        </div>
      </dialog>
    </main>
  );
} 