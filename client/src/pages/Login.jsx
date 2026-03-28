import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const openProfileTab = (role) => {
    if (role === "admin") window.open("/admin", "_blank");
    else if (role === "student") window.open("/profile/student", "_blank");
    else if (role === "owner") window.open("/profile/owner", "_blank");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const user = await login(email, password);
      openProfileTab(user.role);
      navigate("/");
    } catch {
      setErr("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="absolute inset-x-0 top-8 mx-auto h-36 max-w-md rounded-full bg-gradient-to-r from-emerald-200/60 to-cyan-200/50 blur-2xl" />

      <div className="relative rounded-3xl border border-white/60 bg-white/85 p-8 shadow-xl shadow-emerald-900/10 backdrop-blur-xl">
        <h1 className="font-display text-2xl font-bold text-slate-900">Sign in</h1>
        <p className="mt-3 space-y-1 text-xs leading-relaxed text-slate-600">
          <span className="block">
            <strong className="text-slate-800">Owner (all requests):</strong>{" "}
            <code className="rounded bg-slate-100 px-1">owner@gmail.com</code> /{" "}
            <code className="rounded bg-slate-100 px-1">Abc123</code>
          </span>
          <span className="block">
            <strong className="text-slate-800">Admin:</strong>{" "}
            <code className="rounded bg-slate-100 px-1">admin@gmail.com</code> /{" "}
            <code className="rounded bg-slate-100 px-1">Abc123</code>
          </span>
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {err && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </p>
          )}
          <div>
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white/90  px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          No account?{" "}
          <Link
            to="/register"
            className="font-bold text-emerald-700 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
