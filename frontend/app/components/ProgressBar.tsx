export default function ProgressBar({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-medium text-slate-600">Profile completion</span>
        <span className="font-bold text-sky-600">{clamped}%</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-bar"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
