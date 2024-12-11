'use client';
import { format, parseISO } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';

export default function TaskDetailsModal({ task, modalId = 'task-details-modal', onEdit, onDelete }) {
  const { categories } = useTaskContext();
  const category = categories.find(c => c.id === task?.categoryId);

  const handleEdit = () => {
    onEdit(task);
    document.getElementById(modalId).close();
  };

  const handleDelete = () => {
    onDelete(task.id);
    document.getElementById(modalId).close();
  };

  if (!task) return null;

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg">{task.title}</h3>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>
        </div>

        <div className="space-y-4">
          {task.description && (
            <div>
              <h4 className="font-medium text-sm text-base-content/70">Description</h4>
              <p className="mt-1">{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-base-content/70">Due Date</h4>
              <p className="mt-1">{format(parseISO(task.dueDate), 'PPP')}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-base-content/70">Time</h4>
              <p className="mt-1">{task.dueTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-base-content/70">Priority</h4>
              <p className="mt-1 capitalize">{task.priority}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-base-content/70">Category</h4>
              <p className="mt-1 flex items-center gap-2">
                {category && (
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                )}
                {category ? category.name : 'No category'}
              </p>
            </div>
          </div>

          {task.reminder && (
            <div>
              <h4 className="font-medium text-sm text-base-content/70">Reminder</h4>
              <p className="mt-1">
                {task.reminder === '5' && '5 minutes before'}
                {task.reminder === '15' && '15 minutes before'}
                {task.reminder === '30' && '30 minutes before'}
                {task.reminder === '60' && '1 hour before'}
                {task.reminder === '1440' && '1 day before'}
              </p>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-error btn-sm" onClick={handleDelete}>
            Delete
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleEdit}>
            Edit
          </button>
          <form method="dialog">
            <button className="btn btn-ghost btn-sm">Close</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
} 