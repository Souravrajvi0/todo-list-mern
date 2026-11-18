import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import DateStrip from '../components/DateStrip';
import SummaryCards from '../components/SummaryCards';
import WeeklyProgress from '../components/WeeklyProgress';
import TaskItem, { EmptyTasks } from '../components/TaskItem';
import WeekCards from '../components/WeekCards';
import TaskSheet from '../components/TaskSheet';
import { sameDay } from '../utils/date';

export default function Home() {
  const {
    selectedDate,
    setSelectedDate,
    weekTasks,
    stats,
    weeks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleStatus,
  } = useTasks();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showAllWeek, setShowAllWeek] = useState(false);

  const dayTasks = useMemo(
    () => weekTasks.filter((t) => sameDay(t.date, selectedDate)),
    [weekTasks, selectedDate]
  );

  const visibleTasks = showAllWeek ? weekTasks : dayTasks;

  const openCreate = () => {
    setEditing(null);
    setSheetOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setSheetOpen(true);
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    await deleteTask(task._id);
  };

  const handleSubmit = async (payload) => {
    if (editing) {
      await updateTask(editing._id, payload);
    } else {
      await createTask(payload);
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-white">
      <div className="flex-1 overflow-y-auto px-5 pb-28 pt-6">
        <Link
          to="/search"
          className="mb-5 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 text-muted transition hover:bg-[#e8eaf3]"
        >
          <Search size={18} strokeWidth={2} />
          <span className="text-[15px]">Search for a task.</span>
        </Link>

        <DateStrip selectedDate={selectedDate} onSelect={setSelectedDate} />

        <div className="mt-5">
          <SummaryCards completed={stats.completed} open={stats.open} />
        </div>

        <div className="mt-6">
          <WeeklyProgress progress={stats.progress} />
        </div>

        <section className="mt-7">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-ink">
              {showAllWeek ? 'Tasks This Week' : 'Tasks Today'}
            </h2>
            <button
              type="button"
              onClick={() => setShowAllWeek((v) => !v)}
              className="text-sm font-medium text-primary"
            >
              {showAllWeek ? 'By Day' : 'View All'}
            </button>
          </div>

          {error && (
            <p className="mb-3 rounded-xl bg-pending-bg px-3 py-2 text-sm text-pending">{error}</p>
          )}

          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-surface" />
              ))}
            </div>
          ) : visibleTasks.length ? (
            <div className="divide-y divide-line/80">
              {visibleTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggle={toggleStatus}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <EmptyTasks
              label={showAllWeek ? 'No tasks this week yet' : 'No tasks for this day'}
            />
          )}
        </section>

        <WeekCards
          weeks={weeks}
          onToggle={toggleStatus}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      <button
        type="button"
        onClick={openCreate}
        aria-label="Add task"
        className="absolute bottom-7 left-1/2 z-20 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/40 transition hover:bg-primary-dark active:scale-95"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <TaskSheet
        open={sheetOpen}
        mode={editing ? 'edit' : 'create'}
        task={editing}
        defaultDate={selectedDate}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
