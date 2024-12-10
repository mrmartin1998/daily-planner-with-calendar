'use client';
import { parseISO, isBefore, addMinutes } from 'date-fns';

class ReminderService {
  constructor() {
    this.checkPermission();
    this.checkInterval = null;
  }

  async checkPermission() {
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
    // Check every minute
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
    tasks.forEach(task => {
      if (!task.reminder) return;

      const dueDate = parseISO(task.dueDate);
      const reminderTime = addMinutes(dueDate, -parseInt(task.reminder));

      if (isBefore(reminderTime, now) && isBefore(now, dueDate)) {
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