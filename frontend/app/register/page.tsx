"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "../components/Spinner";
import { apiFetch, setAuthToken } from "../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!name || !username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch<{ token?: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, username, email, password }),
      });
      if (data?.token) {
        setAuthToken(data.token);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!password) return { width: "0%", color: "bg-slate-200", label: "" };
    if (password.length < 4) return { width: "25%", color: "bg-red-400", label: "Weak" };
    if (password.length < 6) return { width: "50%", color: "bg-orange-400", label: "Fair" };
    if (password.length < 8) return { width: "75%", color: "bg-sky-400", label: "Good" };
    return { width: "100%", color: "bg-emerald-400", label: "Strong" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-blob gradient-blob-primary absolute -right-32 top-1/4 h-80 w-80" />
        <div className="gradient-blob gradient-blob-secondary absolute -left-32 bottom-1/4 h-64 w-64" />
      </div>

      <div className="relative mx-auto flex w-full max-w-md flex-col gap-8 px-6 py-12 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-sky-400/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
              <img
                src="/live-resume-logo.svg"
                alt="LiveResume"
                className="relative h-10 w-10 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              LiveResume
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-slate-500">
            Start building your developer portfolio.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="card-glass animate-scale-in"
          style={{ animationDelay: "100ms" }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full name
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'transform scale-[1.02]' : ''}`}>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-11 pr-4 text-sm text-slate-900 bg-white border-2 border-slate-200 rounded-xl outline-none transition-all duration-200 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'username' ? 'transform scale-[1.02]' : ''}`}>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-11 pr-4 text-sm text-slate-900 bg-white border-2 border-slate-200 rounded-xl outline-none transition-all duration-200 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  placeholder="johndoe"
                />
              </div>
              {username && (
                <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Your portfolio: liveresume.com/{username || "username"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-11 pr-4 text-sm text-slate-900 bg-white border-2 border-slate-200 rounded-xl outline-none transition-all duration-200 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-11 pr-4 text-sm text-slate-900 bg-white border-2 border-slate-200 rounded-xl outline-none transition-all duration-200 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  placeholder="••••••••"
                />
              </div>
              {/* Password Strength Indicator */}
              <div className="mt-2">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all duration-500`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
                {passwordStrength.label && (
                  <p className="mt-1 text-xs text-slate-400 text-right">
                    {passwordStrength.label}
                  </p>
                )}
              </div>
            </div>
          </div>

          {error ? (
            <div className="alert-error mt-4">
              <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 group"
          >
            {loading ? <Spinner size={16} /> : null}
            <span>{loading ? "Creating account..." : "Create account"}</span>
            {!loading && (
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </button>

          {/* Terms */}
          <p className="text-xs text-slate-400 text-center mt-4">
            By creating an account, you agree to our{" "}
            <span className="text-sky-600 cursor-pointer hover:text-sky-700">Terms</span> and{" "}
            <span className="text-sky-600 cursor-pointer hover:text-sky-700">Privacy Policy</span>.
          </p>
        </form>

        {/* Footer Links */}
        <p className="text-center text-sm text-slate-500 animate-fade-in" style={{ animationDelay: "200ms" }}>
          Already have an account?{" "}
          <Link href="/login" className="link-dark">
            Sign in
          </Link>
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center animate-fade-in" style={{ animationDelay: "300ms" }}>
          {[
            { icon: "⚡", label: "Quick Setup" },
            { icon: "🎨", label: "Custom Styles" },
            { icon: "📄", label: "PDF Export" },
          ].map((feature) => (
            <div key={feature.label} className="flex flex-col items-center gap-1">
              <span className="text-xl">{feature.icon}</span>
              <span className="text-xs text-slate-400">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
