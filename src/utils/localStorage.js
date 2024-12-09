const TASKS_KEY = 'daily_planner_tasks';
const CATEGORIES_KEY = 'daily_planner_categories';

export const loadTasks = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(TASKS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveTasks = (tasks) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const loadCategories = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CATEGORIES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCategories = (categories) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};
