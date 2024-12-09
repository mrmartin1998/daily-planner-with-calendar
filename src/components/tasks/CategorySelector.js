'use client';
import { useTaskContext } from '@/context/TaskContext';

export default function CategorySelector({ value, onChange }) {
  const { categories } = useTaskContext();

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Category</span>
      </label>
      <select 
        className="select select-bordered w-full" 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">No category</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
