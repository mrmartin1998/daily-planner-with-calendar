'use client';
import { useTaskContext } from '@/context/TaskContext';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';

export default function TasksPage() {
  const { 
    tasks, 
    editingTask, 
    setEditingTask, 
    createTask, 
    updateTask, 
    deleteTask 
  } = useTaskContext();

  const handleCreateTask = (formData) => {
    createTask(formData);
    document.getElementById('task-modal').close();
  };

  const handleEditTask = (formData) => {
    updateTask(formData);
    setEditingTask(null);
    document.getElementById('task-modal').close();
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
      
      <TaskList tasks={tasks} onEdit={openEditModal} onDelete={deleteTask} />

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