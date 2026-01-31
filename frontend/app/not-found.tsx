import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
        <p className="text-sm text-slate-500">
          We couldn&apos;t find that portfolio.
        </p>
        <Link
          href="/"
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
