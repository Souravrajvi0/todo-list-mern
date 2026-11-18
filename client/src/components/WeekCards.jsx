import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import TaskItem, { EmptyTasks } from './TaskItem';

export default function WeekCards({ weeks = [], onToggle, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(null);

  if (!weeks.length) return null;

  return (
    <section className="mt-6">
      <h3 className="mb-3 text-[15px] font-semibold text-ink">Weeks Overview</h3>
      <div className="space-y-2">
        {weeks.map((week) => {
          const open = expanded === week.weekStart;
          return (
            <div key={week.weekStart} className="overflow-hidden rounded-2xl border border-line bg-white">
              <button
                type="button"
                onClick={() => setExpanded(open ? null : week.weekStart)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{week.label}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {week.completed} completed · {week.open} open
                  </p>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-muted transition ${open ? 'rotate-180' : ''}`}
                />
              </button>
              {open && (
                <div className="border-t border-line px-4 pb-3">
                  {week.tasks?.length ? (
                    week.tasks.map((task) => (
                      <TaskItem
                        key={task._id}
                        task={task}
                        onToggle={onToggle}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))
                  ) : (
                    <EmptyTasks label="No tasks this week" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
