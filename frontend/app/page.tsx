"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "./lib/api";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

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

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } finally {
      setIsLoggedIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/live-resume-logo.svg"
              alt="LiveResume"
              className="h-10 w-10"
            />
            <span className="text-lg font-semibold text-slate-900">
              LiveResume
            </span>
          </div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="rounded-full border border-black bg-white px-5 py-2 text-sm font-semibold text-black"
            >
              Log out
            </button>
          ) : null}
        </nav>

        <main className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="flex flex-col gap-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Free AI Resume Builder
            </p>
            <h1 className="text-5xl font-semibold text-slate-900 sm:text-6xl">
              Make your resume in minutes with LiveResume.
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              Craft a professional resume and publish a live portfolio from one
              simple dashboard. Customize sections, choose styles, and export a
              polished PDF in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="rounded-full bg-sky-400 px-8 py-4 text-base font-semibold text-black"
                >
                  Build resume
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="rounded-full bg-sky-400 px-8 py-4 text-base font-semibold text-black"
                  >
                    Create account
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-full border border-black bg-white px-8 py-4 text-base font-semibold text-black"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 text-base">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 text-sky-500"
                  fill="currentColor"
                >
                  <path d="M12 6.5c-3.04 0-5.5 2.46-5.5 5.5a1 1 0 1 0 2 0 3.5 3.5 0 1 1 7 0 1 1 0 1 0 2 0c0-3.04-2.46-5.5-5.5-5.5Z" />
                  <path d="M12 3C6.935 3 3 6.048 3 10.5a1 1 0 0 0 2 0C5 7.291 8.134 5 12 5s7 2.291 7 5.5a1 1 0 1 0 2 0C21 6.048 17.065 3 12 3Z" />
                  <circle cx="12" cy="15.5" r="2.5" />
                </svg>
              </span>
              <span className="font-semibold text-sky-600">38,533</span>
              <span className="text-black">resumes created today</span>
            </div>
          </section>

          <section className="relative">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-200/70 blur-3xl" />
            <div className="absolute -bottom-16 right-10 h-44 w-44 rounded-full bg-indigo-200/70 blur-3xl" />
            <div className="relative rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    LiveResume preview
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                    Pawlos Habtemariam
                  </h2>
                  <p className="mt-1 text-base text-slate-500">
                    Product Developer
                  </p>
                  <div className="mt-3 max-w-md text-[11px] text-slate-500">
                    <p className="font-medium text-slate-700">
                      0993806228 | pawloshabtez@gmail.com | leetcode.com/u/GSxAy6gSzJ/
                    </p>
                    <div className="mt-3">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                        Professional Summary
                      </p>
                      <p className="mt-2">
                        Product-Focused Developer focused on building scalable,
                        user-centered applications from concept to deployment.
                        Experienced in turning ideas into reliable digital
                        products through clean code, problem-solving, and
                        collaboration.
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                        Technical Skills
                      </p>
                      <ul className="mt-2 space-y-1">
                        <li>Languages: JavaScript (ES6+), Python</li>
                        <li>Frameworks & Libraries: React, Next.js, Node.js, Express.js, Django</li>
                        <li>Databases: MongoDB, PostgreSQL</li>
                        <li>Authentication & Security: JWT Authentication, Environment Variables</li>
                        <li>Tools & Platforms: Git, GitHub, npm, VS Code</li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                        Projects
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-4">
                        <li>Portfolio Website: Built a personal portfolio using React and Tailwind CSS to showcase projects and skills.</li>
                        <li>Energy Tracker: Developed a Node.js and Express API with JWT authentication and MongoDB integration.</li>
                        <li>Authentication & User Management System: A secure backend system implementing JWT-based authentication, user registration, login, and role-based access control.</li>
                        <li>HireTrack (Job Tracking App): A job application tracking system that helps users organize applications, monitor statuses, and manage their job search efficiently.</li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                        Education
                      </p>
                      <ul className="mt-2 space-y-1">
                        <li>Diploma | Lideta Catholic Cathedral School</li>
                        <li>B.Sc. in Computer Science | St. Mary University</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <img
                  src="/image.jpg"
                  alt="Developer"
                  className="h-28 w-28 rounded-2xl object-cover object-[center_60%]"
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
