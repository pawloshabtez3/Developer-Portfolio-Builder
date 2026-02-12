"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import ProgressBar from "../components/ProgressBar";
import { apiFetch, clearAuthToken, generateResume } from "../lib/api";
import type { Experience, Profile, Project } from "../lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);

  const [profileForm, setProfileForm] = useState({
    name: "",
    username: "",
    role: "",
    bio: "",
    linkedIn: "",
    github: "",
    portfolio: "",
    location: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [resumeGenerating, setResumeGenerating] = useState(false);

  const [newSkill, setNewSkill] = useState("");
  const [skillsSaving, setSkillsSaving] = useState(false);

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    liveUrl: "",
    visibility: "public" as "public" | "private",
  });
  const [projectEditingId, setProjectEditingId] = useState<string | null>(null);
  const [projectSaving, setProjectSaving] = useState(false);

  const [experienceForm, setExperienceForm] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
  });
  const [experienceEditingId, setExperienceEditingId] = useState<string | null>(null);
  const [experienceSaving, setExperienceSaving] = useState(false);

  const [activeTab, setActiveTab] = useState<"profile" | "skills" | "projects" | "experience">("profile");

  const completion = profile?.completion ?? 0;

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [profileData, skillsData, projectsData, experienceData] =
          await Promise.all([
            apiFetch<Profile>("/api/profile"),
            apiFetch<string[]>("/api/skills"),
            apiFetch<Project[]>("/api/projects"),
            apiFetch<Experience[]>("/api/experience"),
          ]);
        setProfile(profileData);
        setProfileForm({
          name: profileData.name || "",
          username: profileData.username || "",
          role: profileData.role || "",
          bio: profileData.bio || "",
          linkedIn: profileData.linkedIn || "",
          github: profileData.github || "",
          portfolio: profileData.portfolio || "",
          location: profileData.location || "",
        });
        setSkills(skillsData || []);
        setProjects(projectsData || []);
        setExperience(experienceData || []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load data";
        if (
          message.toLowerCase().includes("authentication") ||
          message.toLowerCase().includes("token")
        ) {
          router.push("/login");
          return;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } finally {
      clearAuthToken();
      router.push("/login");
    }
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setError(null);
    try {
      const data = await apiFetch<Profile>("/api/profile", {
        method: "PUT",
        body: JSON.stringify(profileForm),
      });
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleGenerateResume = async () => {
    setResumeGenerating(true);
    setError(null);
    try {
      const blob = await generateResume();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${profile?.name?.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate resume");
    } finally {
      setResumeGenerating(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) return;
    setSkills((prev) => [...prev, newSkill.trim()]);
    setNewSkill("");
  };

  const handleSaveSkills = async () => {
    setSkillsSaving(true);
    setError(null);
    try {
      const data = await apiFetch<string[]>("/api/skills", {
        method: "PUT",
        body: JSON.stringify({ skills }),
      });
      setSkills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update skills");
    } finally {
      setSkillsSaving(false);
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: "",
      description: "",
      liveUrl: "",
      visibility: "public",
    });
    setProjectEditingId(null);
  };

  const handleProjectSubmit = async () => {
    if (!projectForm.title || !projectForm.description) {
      setError("Project title and description are required.");
      return;
    }

    setProjectSaving(true);
    setError(null);
    try {
      const path = projectEditingId
        ? `/api/projects/${projectEditingId}`
        : "/api/projects";
      const method = projectEditingId ? "PUT" : "POST";
      const data = await apiFetch<Project[]>(path, {
        method,
        body: JSON.stringify(projectForm),
      });
      setProjects(data);
      resetProjectForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setProjectSaving(false);
    }
  };

  const handleProjectEdit = (project: Project) => {
    setProjectEditingId(project._id);
    setProjectForm({
      title: project.title,
      description: project.description,
      liveUrl: project.liveUrl || "",
      visibility: project.visibility,
    });
  };

  const handleProjectDelete = async (id: string) => {
    setProjectSaving(true);
    setError(null);
    try {
      const data = await apiFetch<Project[]>(`/api/projects/${id}`, {
        method: "DELETE",
      });
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setProjectSaving(false);
    }
  };

  const reorderProjects = async (ordered: Project[]) => {
    setProjects(ordered);
    await apiFetch<Project[]>("/api/projects/reorder", {
      method: "PUT",
      body: JSON.stringify({ orderedIds: ordered.map((item) => item._id) }),
    });
  };

  const moveProject = async (index: number, direction: number) => {
    const updated = [...projects];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    [updated[index], updated[targetIndex]] = [
      updated[targetIndex],
      updated[index],
    ];
    try {
      await reorderProjects(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder");
    }
  };

  const resetExperienceForm = () => {
    setExperienceForm({
      company: "",
      role: "",
      startDate: "",
      endDate: "",
    });
    setExperienceEditingId(null);
  };

  const handleExperienceSubmit = async () => {
    if (!experienceForm.company || !experienceForm.role || !experienceForm.startDate) {
      setError("Company, role, and start date are required.");
      return;
    }

    setExperienceSaving(true);
    setError(null);
    try {
      const path = experienceEditingId
        ? `/api/experience/${experienceEditingId}`
        : "/api/experience";
      const method = experienceEditingId ? "PUT" : "POST";
      const data = await apiFetch<Experience[]>(path, {
        method,
        body: JSON.stringify(experienceForm),
      });
      setExperience(data);
      resetExperienceForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save experience");
    } finally {
      setExperienceSaving(false);
    }
  };

  const handleExperienceEdit = (item: Experience) => {
    setExperienceEditingId(item._id);
    setExperienceForm({
      company: item.company,
      role: item.role,
      startDate: item.startDate.split("T")[0],
      endDate: item.endDate ? item.endDate.split("T")[0] : "",
    });
  };

  const handleExperienceDelete = async (id: string) => {
    setExperienceSaving(true);
    setError(null);
    try {
      const data = await apiFetch<Experience[]>(`/api/experience/${id}`, {
        method: "DELETE",
      });
      setExperience(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete experience");
    } finally {
      setExperienceSaving(false);
    }
  };

  const reorderExperience = async (ordered: Experience[]) => {
    setExperience(ordered);
    await apiFetch<Experience[]>("/api/experience/reorder", {
      method: "PUT",
      body: JSON.stringify({ orderedIds: ordered.map((item) => item._id) }),
    });
  };

  const moveExperience = async (index: number, direction: number) => {
    const updated = [...experience];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    [updated[index], updated[targetIndex]] = [
      updated[targetIndex],
      updated[index],
    ];
    try {
      await reorderExperience(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder");
    }
  };

  const [publicUrl, setPublicUrl] = useState("");

  useEffect(() => {
    if (!profile?.username) {
      setPublicUrl("");
      return;
    }
    setPublicUrl(`${window.location.origin}/${profile.username}`);
  }, [profile?.username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-center px-6 py-24">
          <div className="flex flex-col items-center gap-4">
            <Spinner size={32} />
            <p className="text-sm text-slate-500 animate-pulse">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "profile" as const, label: "Profile", icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: "skills" as const, label: "Skills", icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ), count: skills.length
    },
    {
      id: "projects" as const, label: "Projects", icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ), count: projects.length
    },
    {
      id: "experience" as const, label: "Experience", icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ), count: experience.length
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-blob gradient-blob-primary absolute -right-32 top-1/4 h-80 w-80 opacity-40" />
        <div className="gradient-blob gradient-blob-secondary absolute -left-32 bottom-1/4 h-64 w-64 opacity-40" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 animate-fade-in">
          <div>
            <p className="section-label">Dashboard</p>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ""} 👋
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {publicUrl ? (
              <a
                className="btn-ghost group"
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View portfolio
              </a>
            ) : null}
            <button onClick={handleLogout} className="btn-dark">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </button>
          </div>
        </header>

        {/* Error Alert */}
        {error ? (
          <div className="alert-error animate-scale-in">
            <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : null}

        {/* Progress Card */}
        <div className="card animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#f1f5f9"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${completion * 1.76} 176`}
                    className="transition-all duration-700"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">
                  {completion}%
                </span>
              </div>
              <div>
                <h2 className="section-title">Profile Completion</h2>
                <p className="section-desc mt-1">
                  {completion < 70
                    ? `Add ${70 - completion}% more to unlock resume generation`
                    : "Great job! Your profile is ready for resume generation"
                  }
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGenerateResume}
                disabled={resumeGenerating || completion < 70}
                className={`btn-primary group ${completion < 70 ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={completion < 70 ? `Profile must be at least 70% complete` : "Generate AI-powered resume"}
              >
                {resumeGenerating ? <Spinner size={16} /> : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                <span>{resumeGenerating ? "Generating..." : "Generate Resume"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-white/20" : "bg-slate-100"
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="card space-y-6">
              <div>
                <h2 className="section-title flex items-center gap-2">
                  <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Details
                </h2>
                <p className="section-desc mt-1">Keep your public profile up to date.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="form-label">Full name</label>
                  <input
                    value={profileForm.name}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="John Doe"
                    className="input"
                  />
                </div>
                <div>
                  <label className="form-label">Username</label>
                  <input
                    value={profileForm.username}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, username: event.target.value }))}
                    placeholder="johndoe"
                    className="input"
                  />
                </div>
                <div>
                  <label className="form-label">Role</label>
                  <input
                    value={profileForm.role}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, role: event.target.value }))}
                    placeholder="Software Engineer"
                    className="input"
                  />
                </div>
                <div>
                  <label className="form-label">Location</label>
                  <input
                    value={profileForm.location}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, location: event.target.value }))}
                    placeholder="San Francisco, CA"
                    className="input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Bio</label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, bio: event.target.value }))}
                    placeholder="Tell us about yourself..."
                    className="input textarea"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Social Links
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">LinkedIn</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </span>
                      <input
                        value={profileForm.linkedIn}
                        onChange={(event) => setProfileForm((prev) => ({ ...prev, linkedIn: event.target.value }))}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full h-12 pl-11 pr-4 text-sm text-slate-900 bg-white border-2 border-slate-200 rounded-xl outline-none transition-all duration-200 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">GitHub</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </span>
                      <input
                        value={profileForm.github}
                        onChange={(event) => setProfileForm((prev) => ({ ...prev, github: event.target.value }))}
                        placeholder="https://github.com/username"
                        className="w-full h-12 pl-11 pr-4 text-sm text-slate-900 bg-white border-2 border-slate-200 rounded-xl outline-none transition-all duration-200 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Portfolio</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </span>
                      <input
                        value={profileForm.portfolio}
                        onChange={(event) => setProfileForm((prev) => ({ ...prev, portfolio: event.target.value }))}
                        placeholder="https://yourportfolio.com"
                        className="w-full h-12 pl-11 pr-4 text-sm text-slate-900 bg-white border-2 border-slate-200 rounded-xl outline-none transition-all duration-200 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleProfileSave}
                  disabled={profileSaving}
                  className="btn-primary"
                >
                  {profileSaving ? <Spinner size={16} /> : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span>{profileSaving ? "Saving..." : "Save profile"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="card space-y-6">
              <div>
                <h2 className="section-title flex items-center gap-2">
                  <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Skills
                </h2>
                <p className="section-desc mt-1">Add the tools and technologies you use.</p>
              </div>

              <div className="flex gap-3">
                <input
                  value={newSkill}
                  onChange={(event) => setNewSkill(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleAddSkill()}
                  placeholder="Add a skill (e.g., React, Python, AWS)"
                  className="input flex-1"
                />
                <button onClick={handleAddSkill} className="btn-secondary btn-small">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[100px]">
                {skills.length === 0 ? (
                  <EmptyState title="No skills yet" description="Add your first skill above." />
                ) : (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="badge group animate-scale-in"
                    >
                      {skill}
                      <button
                        onClick={() => setSkills((prev) => prev.filter((item) => item !== skill))}
                        className="badge-close group-hover:text-rose-500 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={handleSaveSkills}
                  disabled={skillsSaving}
                  className="btn-primary"
                >
                  {skillsSaving ? <Spinner size={16} /> : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span>{skillsSaving ? "Saving..." : "Save skills"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="card">
                <div className="mb-4">
                  <h2 className="section-title flex items-center gap-2">
                    <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {projectEditingId ? "Edit Project" : "Add New Project"}
                  </h2>
                  <p className="section-desc mt-1">Highlight your best work and control visibility.</p>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="form-label">Project title</label>
                    <input
                      value={projectForm.title}
                      onChange={(event) => setProjectForm((prev) => ({ ...prev, title: event.target.value }))}
                      placeholder="My Awesome Project"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      value={projectForm.description}
                      onChange={(event) => setProjectForm((prev) => ({ ...prev, description: event.target.value }))}
                      placeholder="Describe what you built and the technologies used..."
                      className="input textarea"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="form-label">Live URL (optional)</label>
                      <input
                        value={projectForm.liveUrl}
                        onChange={(event) => setProjectForm((prev) => ({ ...prev, liveUrl: event.target.value }))}
                        placeholder="https://myproject.com"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Visibility</label>
                      <select
                        value={projectForm.visibility}
                        onChange={(event) => setProjectForm((prev) => ({ ...prev, visibility: event.target.value as "public" | "private" }))}
                        className="input select"
                      >
                        <option value="public">🌍 Public</option>
                        <option value="private">🔒 Private</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={handleProjectSubmit}
                    disabled={projectSaving}
                    className="btn-primary"
                  >
                    {projectSaving ? <Spinner size={16} /> : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                    <span>{projectEditingId ? "Update project" : "Add project"}</span>
                  </button>
                  {projectEditingId && (
                    <button onClick={resetProjectForm} className="btn-ghost">
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Projects List */}
              <div className="grid gap-4">
                {projects.length === 0 ? (
                  <EmptyState title="No projects yet" description="Add your first project above." />
                ) : (
                  projects.map((project, index) => (
                    <div key={project._id} className="card-inner group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-900">{project.title}</h3>
                            <span className={project.visibility === "public" ? "status-public" : "status-private"}>
                              {project.visibility}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-slate-600 line-clamp-2">{project.description}</p>
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-sky-600 hover:text-sky-700 transition-colors">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              View live
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveProject(index, -1)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all" title="Move up">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button onClick={() => moveProject(index, 1)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all" title="Move down">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button onClick={() => handleProjectEdit(project)} className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all" title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleProjectDelete(project._id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="card">
                <div className="mb-4">
                  <h2 className="section-title flex items-center gap-2">
                    <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {experienceEditingId ? "Edit Experience" : "Add Experience"}
                  </h2>
                  <p className="section-desc mt-1">Share your most relevant roles and timeline.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="form-label">Company</label>
                    <input
                      value={experienceForm.company}
                      onChange={(event) => setExperienceForm((prev) => ({ ...prev, company: event.target.value }))}
                      placeholder="Google, Microsoft, etc."
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Role</label>
                    <input
                      value={experienceForm.role}
                      onChange={(event) => setExperienceForm((prev) => ({ ...prev, role: event.target.value }))}
                      placeholder="Software Engineer"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      value={experienceForm.startDate}
                      onChange={(event) => setExperienceForm((prev) => ({ ...prev, startDate: event.target.value }))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="form-label">End Date (leave empty for current)</label>
                    <input
                      type="date"
                      value={experienceForm.endDate}
                      onChange={(event) => setExperienceForm((prev) => ({ ...prev, endDate: event.target.value }))}
                      className="input"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={handleExperienceSubmit}
                    disabled={experienceSaving}
                    className="btn-primary"
                  >
                    {experienceSaving ? <Spinner size={16} /> : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                    <span>{experienceEditingId ? "Update experience" : "Add experience"}</span>
                  </button>
                  {experienceEditingId && (
                    <button onClick={resetExperienceForm} className="btn-ghost">
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Experience List */}
              <div className="grid gap-4">
                {experience.length === 0 ? (
                  <EmptyState title="No experience yet" description="Add your first role above." />
                ) : (
                  experience.map((item, index) => (
                    <div key={item._id} className="card-inner group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                              {item.company.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-slate-900">{item.role}</h3>
                              <p className="text-xs text-slate-500">{item.company}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>
                              {new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — {item.endDate ? new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Present"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveExperience(index, -1)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all" title="Move up">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button onClick={() => moveExperience(index, 1)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all" title="Move down">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button onClick={() => handleExperienceEdit(item)} className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all" title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleExperienceDelete(item._id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
