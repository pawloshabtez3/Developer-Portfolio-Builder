export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
      <p className="font-medium text-slate-700">{title}</p>
      {description ? <p className="mt-1">{description}</p> : null}
    </div>
  );
}
