'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { loadTasks, saveTasks } from '@/utils/localStorage';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = loadTasks();
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage when they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const createTask = (formData) => {
    const newTask = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (formData) => {
    setTasks(prev => prev.map(task => 
      task.id === formData.id 
        ? { ...task, ...formData, updatedAt: new Date() } 
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const value = {
    tasks,
    editingTask,
    setEditingTask,
    createTask,
    updateTask,
    deleteTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
