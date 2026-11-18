import { Check, Pencil, Trash2, X } from 'lucide-react';

const priorityDot = {
  Low: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  High: 'bg-rose-500',
};

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const done = task.status === 'Completed';

  return (
    <div className="fade-up flex items-center gap-3 rounded-2xl bg-white py-3.5">
      <button
        type="button"
        onClick={() => onToggle(task)}
        aria-label={done ? 'Mark in progress' : 'Mark completed'}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition ${
          done
            ? 'border-primary bg-primary text-white'
            : 'border-[#c8cce0] bg-white text-transparent hover:border-primary'
        }`}
      >
        {done ? <Check size={16} strokeWidth={3} /> : <span className="h-3 w-3" />}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[15px] font-medium ${
            done ? 'text-muted line-through' : 'text-ink'
          }`}
        >
          {task.title}
        </p>
        {(task.priority || task.startTime) && (
          <p className="mt-0.5 flex items-center gap-2 text-xs text-muted">
            {task.priority && (
              <span className="inline-flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${priorityDot[task.priority] || priorityDot.Medium}`} />
                {task.priority}
              </span>
            )}
            {task.startTime && (
              <span>
                {task.startTime}
                {task.endTime ? ` – ${task.endTime}` : ''}
              </span>
            )}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onDelete(task)}
          aria-label="Delete task"
          className="rounded-lg p-2 text-muted transition hover:bg-pending-bg hover:text-pending"
        >
          <Trash2 size={18} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          className="rounded-lg p-2 text-muted transition hover:bg-primary-soft hover:text-primary"
        >
          <Pencil size={18} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

export function EmptyTasks({ label = 'No tasks for this day' }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center text-muted">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface">
        <X size={20} className="opacity-40" />
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}
