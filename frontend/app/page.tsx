import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16">
        <header className="flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Developer Portfolio Builder
          </p>
          <h1 className="text-4xl font-semibold text-slate-900">
            Build a portfolio that feels like a product.
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            Manage your profile, skills, projects, and experience from a private
            dashboard. Publish a clean, public portfolio in minutes.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
            >
              Create your account
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700"
            >
              Sign in
            </Link>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Secure dashboard",
              description:
                "JWT authentication with httpOnly cookies keeps your data safe.",
            },
            {
              title: "Live portfolio",
              description:
                "Share a public page that updates instantly when you edit.",
            },
            {
              title: "Clean layout",
              description:
                "A minimal, responsive design that feels professional.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
