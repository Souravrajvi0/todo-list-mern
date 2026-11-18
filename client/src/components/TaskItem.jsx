import { useRef, useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';

const priorityDot = {
  Low: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  High: 'bg-rose-500',
};

const DELETE_WIDTH = 88;

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const done = task.status === 'Completed';
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const dragging = useRef(false);

  // Assignment 4. Delete Task: swipe left on a task in the week's list, then tap "Delete" to remove it.
  const onPointerDown = (e) => {
    dragging.current = true;
    startX.current = e.clientX;
    startOffset.current = offset;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const delta = e.clientX - startX.current;
    const next = Math.min(0, Math.max(-DELETE_WIDTH, startOffset.current + delta));
    setOffset(next);
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    // Snap open if swiped past halfway; otherwise close
    setOffset((prev) => (prev < -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0));
  };

  return (
    <div className="fade-up relative overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={() => onDelete(task)}
        className="absolute inset-y-0 right-0 flex w-[88px] items-center justify-center bg-pending text-sm font-semibold text-white"
        aria-label="Delete"
      >
        Delete
      </button>

      <div
        role="group"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ transform: `translateX(${offset}px)` }}
        className="relative z-10 flex touch-pan-y items-center gap-3 bg-white py-3.5 transition-transform duration-150 ease-out will-change-transform"
      >
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
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      priorityDot[task.priority] || priorityDot.Medium
                    }`}
                  />
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

        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-primary-soft hover:text-primary"
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
