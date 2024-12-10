'use client';
import { parseISO, isBefore, addMinutes } from 'date-fns';

class ReminderService {
  constructor() {
    if (typeof window !== 'undefined') {
      this.checkPermission();
    }
    this.checkInterval = null;
  }

  async checkPermission() {
    if (typeof window === 'undefined') return false;
    
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  startChecking(tasks) {
    // Check immediately when tasks are added
    this.checkReminders(tasks);
    
    // Then check every minute
    this.checkInterval = setInterval(() => {
      this.checkReminders(tasks);
    }, 60000);
  }

  stopChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  checkReminders(tasks) {
    const now = new Date();
    console.log('🕒 Checking reminders at:', now.toLocaleString());
    console.log('📋 Tasks with reminders:', tasks.filter(t => t.reminder).length);
    
    tasks.forEach(task => {
      if (!task.reminder) return;

      // Parse the date correctly
      const fullDueDate = new Date(task.dueDate);
      const [hours, minutes] = task.dueTime.split(':');
      fullDueDate.setHours(parseInt(hours), parseInt(minutes), 0);
      
      const reminderTime = addMinutes(fullDueDate, -parseInt(task.reminder));

      console.log('📌 Task Details:', {
        title: task.title,
        dueDate: fullDueDate.toLocaleString(),
        reminderTime: reminderTime.toLocaleString(),
        currentTime: now.toLocaleString(),
        timeUntilDue: (fullDueDate - now) / 1000 / 60, // minutes
        timeUntilReminder: (reminderTime - now) / 1000 / 60 // minutes
      });

      if (isBefore(reminderTime, now) && isBefore(now, fullDueDate)) {
        console.log('🔔 Triggering notification for:', task.title);
        this.showNotification(task);
      }
    });
  }

  async showNotification(task) {
    if (!await this.checkPermission()) return;

    new Notification('Task Reminder', {
      body: `"${task.title}" is due ${task.reminder} minutes from now`,
      icon: '/favicon.ico',
      tag: task.id
    });
  }
}

export const reminderService = new ReminderService(); 