'use client';
import { useTaskContext } from '@/context/TaskContext';

export default function TaskStatistics() {
  const { tasks, categories } = useTaskContext();
  
  const categoryStats = categories.map(category => ({
    ...category,
    count: tasks.filter(task => task.categoryId === category.id).length
  }));

  return (
    <div className="space-y-2">
      {categoryStats.map(cat => (
        <div key={cat.id} className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: cat.color }}
            />
            <span>{cat.name}</span>
          </div>
          <span className="badge">{cat.count}</span>
        </div>
      ))}
    </div>
  );
}