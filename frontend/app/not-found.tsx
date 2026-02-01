import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-blob gradient-blob-primary absolute right-1/4 top-1/4 h-64 w-64 opacity-40" />
        <div className="gradient-blob gradient-blob-secondary absolute left-1/4 bottom-1/4 h-56 w-56 opacity-30" />
      </div>

      <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-6 px-6 py-24 text-center animate-fade-in-up">
        {/* 404 Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Page not found
          </h2>
          <p className="mt-3 text-slate-500 leading-relaxed">
            We couldn&apos;t find that portfolio. It might have been moved or doesn&apos;t exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/" className="btn-primary group">
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Go back home</span>
          </Link>
          <Link href="/register" className="btn-secondary">
            <span>Create your portfolio</span>
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-xs text-slate-400 animate-fade-in" style={{ animationDelay: "200ms" }}>
          Need help?{" "}
          <span className="text-sky-600 cursor-pointer hover:text-sky-700 transition-colors">
            Contact support
          </span>
        </p>
      </div>
    </div>
  );
}
