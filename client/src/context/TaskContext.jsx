import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../api/tasks';
import { weekStartISO } from '../utils/date';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [weekTasks, setWeekTasks] = useState([]);
  const [stats, setStats] = useState({ completed: 0, open: 0, total: 0, progress: 0 });
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async (date = selectedDate) => {
    setLoading(true);
    setError('');
    try {
      const start = weekStartISO(date);
      const [weekly, overview] = await Promise.all([
        api.getWeeklyStats(start),
        api.getWeeksOverview(6),
      ]);
      setWeekTasks(weekly.tasks || []);
      setStats({
        completed: weekly.completed,
        open: weekly.open,
        total: weekly.total,
        progress: weekly.progress,
      });
      setWeeks(overview);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    refresh(selectedDate);
  }, [selectedDate, refresh]);

  const createTask = async (payload) => {
    const task = await api.createTask(payload);
    await refresh();
    return task;
  };

  const updateTask = async (id, payload) => {
    const task = await api.updateTask(id, payload);
    await refresh();
    return task;
  };

  const deleteTask = async (id) => {
    await api.deleteTask(id);
    await refresh();
  };

  const toggleStatus = async (task) => {
    const next = task.status === 'Completed' ? 'In Progress' : 'Completed';
    return updateTask(task._id, { status: next });
  };

  const value = useMemo(
    () => ({
      selectedDate,
      setSelectedDate,
      weekTasks,
      stats,
      weeks,
      loading,
      error,
      refresh,
      createTask,
      updateTask,
      deleteTask,
      toggleStatus,
    }),
    [selectedDate, weekTasks, stats, weeks, loading, error, refresh]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
