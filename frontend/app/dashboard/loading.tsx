export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-4 px-6 py-24">
        <div className="relative">
          <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-xl animate-pulse" />
          <div className="relative spinner w-8 h-8" />
        </div>
        <p className="text-sm text-slate-500 animate-pulse">Loading your dashboard...</p>
      </div>
    </div>
  );
}
