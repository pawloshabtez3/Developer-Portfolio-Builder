"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch, clearAuthToken } from "./lib/api";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [resumeCount, setResumeCount] = useState(38533);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        await apiFetch("/api/auth/me");
        if (isMounted) setIsLoggedIn(true);
      } catch {
        if (isMounted) setIsLoggedIn(false);
      }
    };

    checkAuth();

    // Animate the resume count
    const interval = setInterval(() => {
      setResumeCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } finally {
      clearAuthToken();
      setIsLoggedIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-sky-50/30 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="gradient-blob gradient-blob-primary absolute -right-32 -top-32 h-96 w-96"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="gradient-blob gradient-blob-secondary absolute -left-32 top-1/3 h-80 w-80"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="gradient-blob gradient-blob-primary absolute right-1/4 bottom-0 h-72 w-72"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
        {/* Navigation */}
        <nav className="flex flex-wrap items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-sky-400/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
              <img
                src="/live-resume-logo.svg"
                alt="LiveResume"
                className="relative h-11 w-11 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
              LiveResume
            </span>
          </div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="btn-secondary btn-small"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log out
            </button>
          ) : null}
        </nav>

        {/* Main Content */}
        <main className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left Section - Hero Content */}
          <section className="flex flex-col gap-6">
            <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-50 to-sky-100/80 border border-sky-200/50">
                <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-700">
                  Free AI Resume Builder
                </span>
              </span>
            </div>

            <h1
              className="hero-title animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              Make your resume in minutes with{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 bg-clip-text text-transparent">
                  LiveResume
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-sky-200/50 -skew-x-3 rounded" />
              </span>
            </h1>

            <p
              className="hero-subtitle animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              Craft a professional resume and publish a live portfolio from one
              simple dashboard. Customize sections, choose styles, and export a
              polished PDF in seconds.
            </p>

            <div
              className="flex flex-wrap gap-4 animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              {isLoggedIn ? (
                <Link href="/dashboard" className="btn-primary group">
                  <span>Build resume</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              ) : (
                <>
                  <Link href="/register" className="btn-primary group">
                    <span>Create account</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                  <Link href="/login" className="btn-secondary group">
                    <span>Sign in</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  </Link>
                </>
              )}
            </div>

            <div
              className="stat-badge animate-fade-in-up"
              style={{ animationDelay: "500ms" }}
            >
              <div className="stat-icon">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 text-sky-600"
                  fill="currentColor"
                >
                  <path d="M12 6.5c-3.04 0-5.5 2.46-5.5 5.5a1 1 0 1 0 2 0 3.5 3.5 0 1 1 7 0 1 1 0 1 0 2 0c0-3.04-2.46-5.5-5.5-5.5Z" />
                  <path d="M12 3C6.935 3 3 6.048 3 10.5a1 1 0 0 0 2 0C5 7.291 8.134 5 12 5s7 2.291 7 5.5a1 1 0 1 0 2 0C21 6.048 17.065 3 12 3Z" />
                  <circle cx="12" cy="15.5" r="2.5" />
                </svg>
              </div>
              <span className="stat-number">{resumeCount.toLocaleString()}</span>
              <span className="stat-label">resumes created today</span>
            </div>
          </section>

          {/* Right Section - Resume Preview */}
          <section
            className="relative animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            {/* Decorative Blobs */}
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-sky-300/60 to-cyan-200/40 blur-3xl animate-float" />
            <div
              className="absolute -bottom-16 right-10 h-52 w-52 rounded-full bg-gradient-to-br from-indigo-300/50 to-purple-200/40 blur-3xl animate-float"
              style={{ animationDelay: "3s" }}
            />

            {/* Resume Card */}
            <div className="resume-preview relative">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-50 border border-sky-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                      <span className="text-[10px] uppercase tracking-widest text-sky-600 font-semibold">
                        Live Preview
                      </span>
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-slate-900 tracking-tight">
                    Pawlos Habtemariam
                  </h2>
                  <p className="mt-1 text-sm font-medium text-sky-600">
                    Product Developer
                  </p>
                  <div className="mt-3 max-w-md text-xs text-slate-500 space-y-0.5">
                    <p className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      0993806228
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      pawloshabtez@gmail.com
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="group">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-4 bg-gradient-to-b from-sky-400 to-sky-500 rounded-full" />
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                          Professional Summary
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed pl-3 border-l-2 border-slate-100 group-hover:border-sky-200 transition-colors">
                        Product-Focused Developer focused on building scalable,
                        user-centered applications from concept to deployment.
                        Experienced in turning ideas into reliable digital
                        products.
                      </p>
                    </div>

                    <div className="group">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-4 bg-gradient-to-b from-sky-400 to-sky-500 rounded-full" />
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                          Technical Skills
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pl-3">
                        {["JavaScript", "React", "Next.js", "Node.js", "Python", "MongoDB"].map(
                          (skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 text-[10px] font-medium text-slate-600 bg-slate-50 rounded-md border border-slate-100 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 transition-all cursor-default"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-4 bg-gradient-to-b from-sky-400 to-sky-500 rounded-full" />
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                          Projects
                        </p>
                      </div>
                      <ul className="text-[11px] text-slate-600 space-y-1 pl-3">
                        <li className="flex items-start gap-2 hover:text-slate-800 transition-colors">
                          <span className="text-sky-400 mt-1">•</span>
                          <span><strong>Portfolio Website:</strong> Built with React and Tailwind CSS</span>
                        </li>
                        <li className="flex items-start gap-2 hover:text-slate-800 transition-colors">
                          <span className="text-sky-400 mt-1">•</span>
                          <span><strong>Energy Tracker:</strong> Node.js API with JWT authentication</span>
                        </li>
                        <li className="flex items-start gap-2 hover:text-slate-800 transition-colors">
                          <span className="text-sky-400 mt-1">•</span>
                          <span><strong>HireTrack:</strong> Job application tracking system</span>
                        </li>
                      </ul>
                    </div>

                    <div className="group">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-4 bg-gradient-to-b from-sky-400 to-sky-500 rounded-full" />
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                          Education
                        </p>
                      </div>
                      <div className="text-[11px] text-slate-600 space-y-1 pl-3">
                        <p className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[8px]">🎓</span>
                          B.Sc. Computer Science · St. Mary University
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-br from-sky-400/20 to-indigo-400/20 rounded-2xl blur-lg" />
                  <img
                    src="/image.jpg"
                    alt="Developer"
                    className="relative h-32 w-32 rounded-2xl object-cover object-[center_60%] ring-4 ring-white shadow-xl"
                  />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 px-3 py-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-lg">
                <span className="text-xs font-bold text-white">✓ ATS Ready</span>
              </div>
            </div>
          </section>
        </main>

        {/* Features Section */}
        <section className="mt-24 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Why choose LiveResume?</h2>
            <p className="mt-2 text-slate-500">Everything you need to land your dream job</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "AI-Powered",
                description: "Smart suggestions and auto-formatting powered by AI",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "ATS Compatible",
                description: "Optimized format to pass applicant tracking systems",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                ),
                title: "Live Portfolio",
                description: "Get a shareable link to showcase your work online",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="card group cursor-default"
                style={{ animationDelay: `${700 + index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 text-sky-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
