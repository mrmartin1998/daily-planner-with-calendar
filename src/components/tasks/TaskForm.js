'use client';
import { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { format } from 'date-fns';
import CategorySelector from './CategorySelector';

const defaultFormData = {
  id: '',
  title: '',
  description: '',
  dueDate: format(new Date(), 'yyyy-MM-dd'),
  dueTime: format(new Date(), 'HH:mm'),
  priority: 'low',
  categoryId: '',
};

export default function TaskForm({ onSubmit, initialData = null }) {
  const { categories } = useTaskContext();
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (initialData) {
      // Edit mode
      const taskDate = new Date(initialData.dueDate);
      setFormData({
        id: initialData.id,
        title: initialData.title || '',
        description: initialData.description || '',
        dueDate: format(taskDate, 'yyyy-MM-dd'),
        dueTime: format(taskDate, 'HH:mm'),
        priority: initialData.priority || 'low',
        categoryId: initialData.categoryId || '',
      });
    } else {
      // Create mode - reset to defaults
      setFormData(defaultFormData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit({
      ...formData,
      dueDate: formData.dueDate && formData.dueTime
        ? new Date(`${formData.dueDate}T${formData.dueTime}`)
        : new Date(formData.dueDate)
    });
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

      <div className="flex justify-end gap-2 mt-6">
        <button 
          type="button" 
          className="btn" 
          onClick={() => document.getElementById('task-modal').close()}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
