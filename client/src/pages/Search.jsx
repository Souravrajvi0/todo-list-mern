import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { searchTasks } from '../api/tasks';
import { useTasks } from '../context/TaskContext';
import TaskItem, { EmptyTasks } from '../components/TaskItem';
import TaskSheet from '../components/TaskSheet';

export default function Search() {
  const { updateTask, deleteTask, toggleStatus, refresh } = useTasks();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return undefined;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchTasks(q);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    await deleteTask(task._id);
    setResults((prev) => prev.filter((t) => t._id !== task._id));
  };

  const handleToggle = async (task) => {
    const updated = await toggleStatus(task);
    setResults((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  };

  const handleEdit = (task) => {
    setEditing(task);
    setSheetOpen(true);
  };

  const handleSubmit = async (payload) => {
    const updated = await updateTask(editing._id, payload);
    setResults((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    await refresh();
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-white">
      <div className="flex items-center gap-3 px-4 pb-3 pt-5">
        <Link
          to="/home"
          className="rounded-xl p-2 text-ink hover:bg-surface"
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </Link>
        <div className="flex flex-1 items-center gap-2 rounded-2xl bg-surface px-3 py-3">
          <SearchIcon size={18} className="text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks…"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {!query.trim() && (
          <p className="mt-8 text-center text-sm text-muted">
            Search by title or description
          </p>
        )}

        {query.trim() && loading && (
          <div className="space-y-3 py-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-surface" />
            ))}
          </div>
        )}

        {query.trim() && !loading && results.length === 0 && (
          <EmptyTasks label={`No results for “${query.trim()}”`} />
        )}

        {results.length > 0 && (
          <div className="divide-y divide-line/80">
            {results.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <TaskSheet
        open={sheetOpen}
        mode="edit"
        task={editing}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
