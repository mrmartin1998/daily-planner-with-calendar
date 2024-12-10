'use client';
import { addMinutes, addHours, addDays, format } from 'date-fns';

export function createTestTasks() {
  const now = new Date();
  
  const testTasks = [
    // Task due in 2 minutes with 1-minute reminder
    {
      id: 'test1',
      title: '⚡ Urgent Task (1min reminder)',
      description: 'Should notify in 1 minute',
      dueDate: format(addMinutes(now, 2), 'yyyy-MM-dd'),
      dueTime: format(addMinutes(now, 2), 'HH:mm'),
      priority: 'high',
      categoryId: '1', // Work
      reminder: '1'
    },
    // Task due in 5 minutes with 3-minute reminder
    {
      id: 'test2',
      title: '🔔 Meeting Prep (3min reminder)',
      description: 'Should notify in 2 minutes',
      dueDate: format(addMinutes(now, 5), 'yyyy-MM-dd'),
      dueTime: format(addMinutes(now, 5), 'HH:mm'),
      priority: 'medium',
      categoryId: '2', // Personal
      reminder: '3'
    },
    // Task due tomorrow with long reminder
    {
      id: 'test3',
      title: '📅 Tomorrow Task (30min reminder)',
      description: 'Long-term reminder test',
      dueDate: format(addDays(now, 1), 'yyyy-MM-dd'),
      dueTime: format(addDays(now, 1), 'HH:mm'),
      priority: 'low',
      categoryId: '3', // Shopping
      reminder: '30'
    },
    // Overdue task
    {
      id: 'test4',
      title: '❌ Overdue Task',
      description: 'This task is already late',
      dueDate: format(addMinutes(now, -30), 'yyyy-MM-dd'),
      dueTime: format(addMinutes(now, -30), 'HH:mm'),
      priority: 'high',
      categoryId: '4', // Health
      reminder: '5'
    },
    // Task due in 1 hour with 15-minute reminder
    {
      id: 'test5',
      title: '⏰ Upcoming Task (15min reminder)',
      description: 'Should notify in 45 minutes',
      dueDate: format(addHours(now, 1), 'yyyy-MM-dd'),
      dueTime: format(addHours(now, 1), 'HH:mm'),
      priority: 'medium',
      categoryId: '1', // Work
      reminder: '15'
    }
  ];

  return testTasks;
} 