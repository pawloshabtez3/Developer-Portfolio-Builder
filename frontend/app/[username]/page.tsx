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
    githubUrl?: string;
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
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            {data.profile.username}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            {data.profile.name}
          </h1>
          {data.profile.role ? (
            <p className="mt-2 text-base text-slate-600">
              {data.profile.role}
            </p>
          ) : null}
          {data.profile.bio ? (
            <p className="mt-4 text-sm text-slate-600">{data.profile.bio}</p>
          ) : null}
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.skills.length === 0 ? (
              <p className="text-sm text-slate-500">No skills listed.</p>
            ) : (
              data.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                >
                  {skill}
                </span>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
          <div className="mt-4 grid gap-4">
            {data.projects.length === 0 ? (
              <p className="text-sm text-slate-500">No public projects yet.</p>
            ) : (
              data.projects.map((project) => (
                <div
                  key={project._id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-900">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600">
                    {project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-900"
                      >
                        Live site
                      </a>
                    ) : null}
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-900"
                      >
                        GitHub
                      </a>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Experience</h2>
          <div className="mt-4 grid gap-4">
            {data.experience.length === 0 ? (
              <p className="text-sm text-slate-500">No experience listed.</p>
            ) : (
              data.experience.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-900">
                    {item.role} · {item.company}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.startDate.split("T")[0]} -{" "}
                    {item.endDate ? item.endDate.split("T")[0] : "Present"}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
