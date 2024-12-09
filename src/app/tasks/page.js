'use client';
import { useState, useEffect } from 'react';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import { loadTasks, saveTasks } from '@/utils/localStorage';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = loadTasks();
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleCreateTask = (formData) => {
    const newTask = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
    document.getElementById('task-modal').close();
  };

  const handleEditTask = (formData) => {
    setTasks(prev => prev.map(task => 
      task.id === formData.id 
        ? { ...task, ...formData, updatedAt: new Date() } 
        : task
    ));
    setEditingTask(null);
    document.getElementById('task-modal').close();
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    document.getElementById('task-modal').showModal();
  };

  return (
    <main className="flex-1 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setEditingTask(null);
            document.getElementById('task-modal').showModal();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Task
        </button>
      </div>
      
      <TaskList tasks={tasks} onEdit={openEditModal} onDelete={handleDeleteTask} />

      <dialog id="task-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
          <TaskForm 
            onSubmit={editingTask ? handleEditTask : handleCreateTask} 
            initialData={editingTask} 
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </main>
  );
} 