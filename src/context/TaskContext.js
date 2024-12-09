'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { loadTasks, saveTasks, loadCategories, saveCategories } from '@/utils/localStorage';

const TaskContext = createContext(null);

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Work', color: '#FF5733' },
  { id: '2', name: 'Personal', color: '#33FF57' },
  { id: '3', name: 'Shopping', color: '#3357FF' },
  { id: '4', name: 'Health', color: '#FF33F5' }
];

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedTasks = loadTasks();
    const storedCategories = loadCategories();
    setTasks(storedTasks);
    setCategories(storedCategories.length ? storedCategories : DEFAULT_CATEGORIES);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  const createTask = (taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description,
      dueDate: new Date(`${taskData.dueDate}T${taskData.dueTime}`),
      categoryId: taskData.categoryId,
      priority: taskData.priority,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (taskData) => {
    setTasks(prev => prev.map(task => 
      task.id === taskData.id 
        ? {
            ...task,
            title: taskData.title,
            description: taskData.description,
            dueDate: new Date(`${taskData.dueDate}T${taskData.dueTime}`),
            categoryId: taskData.categoryId,
            priority: taskData.priority,
            updatedAt: new Date()
          }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const addCategory = (category) => {
    setCategories(prev => [...prev, { 
      id: Date.now().toString(),
      ...category 
    }]);
  };

  const deleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    // Optional: Update tasks that had this category
    setTasks(prev => prev.map(task => 
      task.categoryId === categoryId 
        ? { ...task, categoryId: null }
        : task
    ));
  };

  const value = {
    tasks,
    categories,
    editingTask,
    setEditingTask,
    createTask,
    updateTask,
    deleteTask,
    addCategory,
    deleteCategory
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
