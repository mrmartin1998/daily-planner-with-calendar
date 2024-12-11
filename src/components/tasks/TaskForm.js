'use client';
import { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { format, isValid, parseISO } from 'date-fns';
import CategorySelector from './CategorySelector';

const defaultFormData = {
  id: '',
  title: '',
  description: '',
  dueDate: format(new Date(), 'yyyy-MM-dd'),
  dueTime: format(new Date(), 'HH:mm'),
  priority: 'low',
  categoryId: '',
  reminder: '',
};

export default function TaskForm({ onSubmit, initialData = null, modalId = 'task-modal', mode = 'create' }) {
  const { categories } = useTaskContext();
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    console.log('TaskForm - Received initialData:', initialData);
    
    if (initialData) {
      if (mode === 'edit' && initialData.id) {
        // Handle editing existing task
        console.log('TaskForm - Setting existing task data');
        let date = parseISO(initialData.dueDate);
        if (!isValid(date)) date = new Date();

        setFormData({
          id: initialData.id,
          title: initialData.title,
          description: initialData.description || '',
          dueDate: format(date, 'yyyy-MM-dd'),
          dueTime: format(date, 'HH:mm'),
          priority: initialData.priority || 'low',
          categoryId: initialData.categoryId || '',
          reminder: initialData.reminder || '',
        });
      } else {
        // Handle new task from calendar slot
        console.log('TaskForm - Setting calendar slot data');
        setFormData(prev => ({
          ...defaultFormData,
          dueDate: initialData.dueDate,
          dueTime: initialData.dueTime,
          title: initialData.title || ''
        }));
      }
    } else {
      console.log('TaskForm - Resetting to default form data');
      setFormData(defaultFormData);
    }
  }, [initialData, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create date string in local timezone
    const dateTimeString = `${formData.dueDate}T${formData.dueTime}`;
    const localDate = new Date(dateTimeString);
    
    onSubmit({
      ...formData,
      dueDate: localDate.toISOString()  // Store as ISO string
    });
  };

  const handleCancel = () => {
    document.getElementById(modalId).close();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <CategorySelector
        value={formData.categoryId}
        onChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
      />

      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter task description"
          className="textarea textarea-bordered h-24"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Due Date</span>
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Due Time</span>
          </label>
          <input
            type="time"
            name="dueTime"
            value={formData.dueTime}
            onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
            className="input input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Priority</span>
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
            className="select select-bordered w-full"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Reminder</span>
        </label>
        <select
          name="reminder"
          value={formData.reminder}
          onChange={(e) => setFormData(prev => ({ ...prev, reminder: e.target.value }))}
          className="select select-bordered w-full"
        >
          <option value="">No reminder</option>
          <option value="5">5 minutes before</option>
          <option value="15">15 minutes before</option>
          <option value="30">30 minutes before</option>
          <option value="60">1 hour before</option>
          <option value="1440">1 day before</option>
        </select>
      </div>

      <div className="modal-action">
        <button 
          type="button" 
          className="btn" 
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
        >
          {mode === 'edit' ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
