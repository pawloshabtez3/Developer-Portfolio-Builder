"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "../components/Spinner";
import { apiFetch } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">
          Sign in to manage your portfolio.
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />

          <label className="mt-4 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />

          {error ? (
            <p className="mt-3 text-sm text-rose-600">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
          >
            {loading ? <Spinner size={16} /> : null}
            Sign in
          </button>
        </form>

        <p className="text-sm text-slate-500">
          New here?{" "}
          <Link href="/register" className="font-medium text-slate-900">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
