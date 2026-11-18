import { getWeekDays, formatDayLabel, formatDayNum, sameDay } from '../utils/date';

export default function DateStrip({ selectedDate, onSelect }) {
  const days = getWeekDays(selectedDate);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {days.map((day) => {
        const active = sameDay(day, selectedDate);
        return (
          <button
            key={day.toISOString()}
            type="button"
            onClick={() => onSelect(day)}
            className={`flex min-w-[52px] flex-col items-center gap-1 rounded-2xl px-3 py-2.5 transition ${
              active
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'bg-surface text-muted hover:bg-[#e8eaf3]'
            }`}
          >
            <span className={`text-[11px] font-medium ${active ? 'text-white/80' : ''}`}>
              {formatDayLabel(day)}
            </span>
            <span className="text-base font-semibold tabular-nums">{formatDayNum(day)}</span>
          </button>
        );
      })}
    </div>
  );
}
