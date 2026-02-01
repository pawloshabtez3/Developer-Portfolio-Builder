import { notFound } from "next/navigation";
import type { Metadata } from "next";

type PublicPortfolio = {
  profile: {
    name: string;
    username: string;
    role?: string;
    bio?: string;
  };
  skills: string[];
  projects: Array<{
    _id: string;
    title: string;
    description: string;
    liveUrl?: string;
  }>;
  experience: Array<{
    _id: string;
    company: string;
    role: string;
    startDate: string;
    endDate?: string | null;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return {
    title: `${params.username} | Developer Portfolio`,
    description: `View ${params.username}'s developer portfolio.`,
  };
}

async function getPortfolio(username: string): Promise<PublicPortfolio | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return null;
  }

  const res = await fetch(`${apiUrl}/api/public/${username}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to load portfolio");
  }

  const payload = await res.json();
  return payload.data as PublicPortfolio;
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: { username: string };
}) {
  const data = await getPortfolio(params.username);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-blob gradient-blob-primary absolute -right-32 top-20 h-72 w-72 opacity-50" />
        <div className="gradient-blob gradient-blob-secondary absolute -left-32 bottom-1/3 h-64 w-64 opacity-40" />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
        {/* Header Card */}
        <header className="card-glass animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-sky-50 to-sky-100 border border-sky-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                    @{data.profile.username}
                  </span>
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                {data.profile.name}
              </h1>
              {data.profile.role ? (
                <p className="mt-2 text-lg text-sky-600 font-medium">
                  {data.profile.role}
                </p>
              ) : null}
              {data.profile.bio ? (
                <p className="mt-4 text-slate-600 leading-relaxed max-w-xl">
                  {data.profile.bio}
                </p>
              ) : null}
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-sky-400/20 to-indigo-400/20 rounded-2xl blur-lg" />
                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center text-3xl font-bold text-sky-600">
                  {data.profile.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Skills Section */}
        <section className="card animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="section-title">Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills.length === 0 ? (
              <p className="text-sm text-slate-500">No skills listed.</p>
            ) : (
              data.skills.map((skill, index) => (
                <span
                  key={skill}
                  className="badge-primary animate-scale-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {skill}
                </span>
              ))
            )}
          </div>
        </section>

        {/* Projects Section */}
        <section className="card animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="section-title">Projects</h2>
            {data.projects.length > 0 && (
              <span className="ml-auto text-xs font-medium text-slate-400">
                {data.projects.length} project{data.projects.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="grid gap-4">
            {data.projects.length === 0 ? (
              <p className="text-sm text-slate-500">No public projects yet.</p>
            ) : (
              data.projects.map((project, index) => (
                <div
                  key={project._id}
                  className="group card-inner animate-fade-in-up"
                  style={{ animationDelay: `${(index + 1) * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-700 hover:bg-sky-100 hover:text-sky-700 transition-all group/link"
                      >
                        <span>View</span>
                        <svg className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Experience Section */}
        <section className="card animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="section-title">Experience</h2>
          </div>
          <div className="relative">
            {/* Timeline line */}
            {data.experience.length > 1 && (
              <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-sky-200 via-slate-200 to-transparent" />
            )}
            <div className="grid gap-4">
              {data.experience.length === 0 ? (
                <p className="text-sm text-slate-500">No experience listed.</p>
              ) : (
                data.experience.map((item, index) => (
                  <div
                    key={item._id}
                    className="relative flex gap-4 animate-fade-in-up"
                    style={{ animationDelay: `${(index + 1) * 50}ms` }}
                  >
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 z-10 ring-4 ring-white">
                      {item.company.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 card-inner">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {item.role}
                          </h3>
                          <p className="text-sm text-sky-600 font-medium">
                            {item.company}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — {item.endDate ? new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Present"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <span>Built with</span>
            <a href="/" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-sky-600 transition-colors font-medium">
              <span className="w-4 h-4 rounded bg-gradient-to-br from-sky-400 to-sky-500" />
              LiveResume
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
