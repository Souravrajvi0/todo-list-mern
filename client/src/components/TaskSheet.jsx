import { useEffect, useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import { formatLongDate, parseTaskDate, toDateInput } from '../utils/date';

const emptyForm = (date) => ({
  title: '',
  description: '',
  date: toDateInput(date || new Date()),
  startTime: '',
  endTime: '',
  priority: 'Medium',
});

export default function TaskSheet({ open, mode = 'create', task, defaultDate, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm(defaultDate));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        date: toDateInput(parseTaskDate(task.date)),
        startTime: task.startTime || '',
        endTime: task.endTime || '',
        priority: task.priority || 'Medium',
      });
    } else {
      setForm(emptyForm(defaultDate));
    }
    setError('');
  }, [open, mode, task, defaultDate]);

  if (!open) return null;

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!form.date) {
      setError('Date is required');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        date: new Date(`${form.date}T12:00:00`).toISOString(),
        startTime: form.startTime,
        endTime: form.endTime,
        priority: form.priority,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not save task');
    } finally {
      setSaving(false);
    }
  };

  const datePreview = form.date
    ? formatLongDate(new Date(`${form.date}T12:00:00`))
    : 'Pick a date';

  return (
    <div className="sheet-backdrop absolute inset-0 z-50 flex items-end bg-black/40">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="sheet-panel relative z-10 max-h-[92%] w-full overflow-y-auto rounded-t-[28px] bg-white px-5 pb-6 pt-5 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between">
          <h2 className="text-xl font-bold text-ink">
            {mode === 'edit' ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted hover:bg-surface"
            aria-label="Close sheet"
          >
            <X size={22} />
          </button>
        </div>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Task Title</span>
          <input
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="Doing Homework"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] outline-none transition focus:border-primary"
          />
        </label>

        <div className="mb-4">
          <span className="mb-1.5 block text-sm font-medium text-ink">Set Time</span>
          <div className="grid grid-cols-2 gap-3">
            <label className="relative">
              <span className="mb-1 block text-xs text-muted">Start</span>
              <div className="relative">
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setField('startTime', e.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 pr-10 text-[15px] outline-none focus:border-primary"
                />
                <Clock size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              </div>
            </label>
            <label className="relative">
              <span className="mb-1 block text-xs text-muted">Ends</span>
              <div className="relative">
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setField('endTime', e.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 pr-10 text-[15px] outline-none focus:border-primary"
                />
                <Clock size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              </div>
            </label>
          </div>
        </div>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Set Date</span>
          <div className="relative">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setField('date', e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 pr-10 text-[15px] text-transparent caret-transparent outline-none focus:border-primary"
            />
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-ink">
              {datePreview}
            </span>
            <Calendar size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>
        </label>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Priority</span>
          <div className="grid grid-cols-3 gap-2">
            {['Low', 'Medium', 'High'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setField('priority', p)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  form.priority === p
                    ? 'border-primary bg-primary-soft text-primary'
                    : 'border-line text-muted hover:bg-surface'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </label>

        <label className="mb-5 block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="Add Description"
            rows={3}
            className="w-full resize-none rounded-xl border border-line bg-white px-4 py-3 text-[15px] outline-none focus:border-primary"
          />
        </label>

        {error && <p className="mb-3 text-sm text-pending">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create task'}
        </button>
      </form>
    </div>
  );
}
