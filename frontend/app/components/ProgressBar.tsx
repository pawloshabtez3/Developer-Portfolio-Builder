export default function ProgressBar({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>Profile completion</span>
        <span>{clamped}%</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-slate-900"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
