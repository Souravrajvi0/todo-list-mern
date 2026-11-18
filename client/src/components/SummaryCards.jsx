import { CheckSquare, X } from 'lucide-react';

export default function SummaryCards({ completed = 0, open = 0 }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-primary-soft p-4">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
          <CheckSquare size={18} strokeWidth={2.25} />
        </div>
        <p className="text-sm font-medium text-primary">Task Complete</p>
        <p className="mt-1 text-lg font-bold text-ink">
          {String(completed).padStart(2, '0')}{' '}
          <span className="text-sm font-medium text-muted">This Week</span>
        </p>
      </div>

      <div className="rounded-2xl bg-pending-bg p-4">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-pending text-white">
          <X size={18} strokeWidth={2.5} />
        </div>
        <p className="text-sm font-medium text-pending">Task Pending</p>
        <p className="mt-1 text-lg font-bold text-ink">
          {String(open).padStart(2, '0')}{' '}
          <span className="text-sm font-medium text-muted">This Week</span>
        </p>
      </div>
    </div>
  );
}
