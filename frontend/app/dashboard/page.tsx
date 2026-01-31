"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import ProgressBar from "../components/ProgressBar";
import { apiFetch } from "../lib/api";
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
  });
  const [profileSaving, setProfileSaving] = useState(false);

  const [newSkill, setNewSkill] = useState("");
  const [skillsSaving, setSkillsSaving] = useState(false);

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    liveUrl: "",
    githubUrl: "",
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
  const [experienceEditingId, setExperienceEditingId] = useState<string | null>(
    null
  );
  const [experienceSaving, setExperienceSaving] = useState(false);

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
      githubUrl: "",
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
      githubUrl: project.githubUrl || "",
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
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-center px-6 py-24">
          <Spinner size={28} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Dashboard
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Welcome back{profile?.name ? `, ${profile.name}` : ""}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {publicUrl ? (
              <a
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
              >
                View public portfolio
              </a>
            ) : null}
            <button
              onClick={handleLogout}
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
            >
              Log out
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Profile details
              </h2>
              <p className="text-sm text-slate-500">
                Keep your public profile up to date.
              </p>
            </div>
            <div className="w-full max-w-xs">
              <ProgressBar value={completion} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={profileForm.name}
              onChange={(event) =>
                setProfileForm((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              placeholder="Full name"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              value={profileForm.username}
              onChange={(event) =>
                setProfileForm((prev) => ({
                  ...prev,
                  username: event.target.value,
                }))
              }
              placeholder="Username"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              value={profileForm.role}
              onChange={(event) =>
                setProfileForm((prev) => ({
                  ...prev,
                  role: event.target.value,
                }))
              }
              placeholder="Role"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              value={profileForm.bio}
              onChange={(event) =>
                setProfileForm((prev) => ({
                  ...prev,
                  bio: event.target.value,
                }))
              }
              placeholder="Bio"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <button
            onClick={handleProfileSave}
            disabled={profileSaving}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
          >
            {profileSaving ? <Spinner size={14} /> : null}
            Save profile
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
            <p className="text-sm text-slate-500">
              Add the tools and technologies you use.
            </p>

            <div className="mt-4 flex gap-2">
              <input
                value={newSkill}
                onChange={(event) => setNewSkill(event.target.value)}
                placeholder="Add a skill"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <button
                onClick={handleAddSkill}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                Add
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {skills.length === 0 ? (
                <EmptyState title="No skills yet" description="Add your first skill." />
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                  >
                    {skill}
                    <button
                      onClick={() =>
                        setSkills((prev) => prev.filter((item) => item !== skill))
                      }
                      className="text-slate-400 hover:text-slate-700"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>

            <button
              onClick={handleSaveSkills}
              disabled={skillsSaving}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
            >
              {skillsSaving ? <Spinner size={14} /> : null}
              Save skills
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
            <p className="text-sm text-slate-500">
              Highlight your best work and control visibility.
            </p>

            <div className="mt-4 grid gap-3">
              <input
                value={projectForm.title}
                onChange={(event) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                placeholder="Project title"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <textarea
                value={projectForm.description}
                onChange={(event) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Project description"
                className="min-h-[80px] rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={projectForm.liveUrl}
                onChange={(event) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    liveUrl: event.target.value,
                  }))
                }
                placeholder="Live URL"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={projectForm.githubUrl}
                onChange={(event) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    githubUrl: event.target.value,
                  }))
                }
                placeholder="GitHub URL"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <select
                value={projectForm.visibility}
                onChange={(event) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    visibility: event.target.value as "public" | "private",
                  }))
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleProjectSubmit}
                disabled={projectSaving}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              >
                {projectSaving ? <Spinner size={14} /> : null}
                {projectEditingId ? "Update project" : "Add project"}
              </button>
              {projectEditingId ? (
                <button
                  onClick={resetProjectForm}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-3">
              {projects.length === 0 ? (
                <EmptyState
                  title="No projects yet"
                  description="Add your first project."
                />
              ) : (
                projects.map((project, index) => (
                  <div
                    key={project._id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {project.title}
                      </h3>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                        {project.visibility}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-600">
                      {project.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => moveProject(index, -1)}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs"
                      >
                        Up
                      </button>
                      <button
                        onClick={() => moveProject(index, 1)}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs"
                      >
                        Down
                      </button>
                      <button
                        onClick={() => handleProjectEdit(project)}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleProjectDelete(project._id)}
                        className="rounded-full border border-rose-200 px-3 py-1 text-xs text-rose-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Experience</h2>
          <p className="text-sm text-slate-500">
            Share your most relevant roles and timeline.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              value={experienceForm.company}
              onChange={(event) =>
                setExperienceForm((prev) => ({
                  ...prev,
                  company: event.target.value,
                }))
              }
              placeholder="Company"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              value={experienceForm.role}
              onChange={(event) =>
                setExperienceForm((prev) => ({
                  ...prev,
                  role: event.target.value,
                }))
              }
              placeholder="Role"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={experienceForm.startDate}
              onChange={(event) =>
                setExperienceForm((prev) => ({
                  ...prev,
                  startDate: event.target.value,
                }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={experienceForm.endDate}
              onChange={(event) =>
                setExperienceForm((prev) => ({
                  ...prev,
                  endDate: event.target.value,
                }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={handleExperienceSubmit}
              disabled={experienceSaving}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
            >
              {experienceSaving ? <Spinner size={14} /> : null}
              {experienceEditingId ? "Update experience" : "Add experience"}
            </button>
            {experienceEditingId ? (
              <button
                onClick={resetExperienceForm}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3">
            {experience.length === 0 ? (
              <EmptyState
                title="No experience yet"
                description="Add your first role."
              />
            ) : (
              experience.map((item, index) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {item.role} at {item.company}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {item.startDate.split("T")[0]} -{" "}
                      {item.endDate ? item.endDate.split("T")[0] : "Present"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => moveExperience(index, -1)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs"
                    >
                      Up
                    </button>
                    <button
                      onClick={() => moveExperience(index, 1)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs"
                    >
                      Down
                    </button>
                    <button
                      onClick={() => handleExperienceEdit(item)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleExperienceDelete(item._id)}
                      className="rounded-full border border-rose-200 px-3 py-1 text-xs text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
