export default function WeeklyProgress({ progress = 0 }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-ink">Weekly Progress</h3>
        <span className="text-sm font-medium text-primary">{progress}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
      </div>
    </div>
  );
}
