'use client';
import { formatDistanceToNow, format, parseISO, isPast, isWithinInterval, addMinutes } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';

export default function TaskCard({ task }) {
  const { categories, deleteTask, setEditingTask } = useTaskContext();
  const category = categories.find(c => c.id === task.categoryId);
  const dueDate = parseISO(task.dueDate);

  const getTaskStatus = () => {
    const now = new Date();
    
    if (isPast(dueDate)) {
      return 'overdue';
    }

    if (task.reminder) {
      const reminderTime = addMinutes(dueDate, -parseInt(task.reminder));
      if (isWithinInterval(now, { start: reminderTime, end: dueDate })) {
        return 'upcoming';
      }
    }

    return 'normal';
  };

  const status = getTaskStatus();

  return (
    <div className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow
      ${status === 'overdue' ? 'border-error border-2' : ''}
      ${status === 'upcoming' ? 'border-warning border-2' : ''}
    `}>
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <h3 className="card-title text-lg mb-2">
            {task.title}
            {task.reminder && (
              <span className="badge badge-warning badge-sm ml-2">
                Reminder set
              </span>
            )}
          </h3>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-xs">
              ⋮
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a onClick={() => {
                  setEditingTask(task);
                  document.getElementById('task-modal').showModal();
                }}>
                  Edit
                </a>
              </li>
              <li><a onClick={() => deleteTask(task.id)} className="text-error">Delete</a></li>
            </ul>
          </div>
        </div>

        {category && (
          <div 
            className="badge" 
            style={{ backgroundColor: category.color, color: '#fff' }}
          >
            {category.name}
          </div>
        )}

        <p className="text-sm mt-2">{task.description}</p>
        
        <div className="flex justify-between items-center mt-4 text-sm text-base-content/70">
          <span className={`
            ${status === 'overdue' ? 'text-error' : ''}
            ${status === 'upcoming' ? 'text-warning' : ''}
          `}>
            Due {formatDistanceToNow(dueDate, { addSuffix: true })}
          </span>
          <span>{format(dueDate, 'MMM d, h:mm a')}</span>
        </div>
      </div>
    </div>
  );
}
