import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  nameLettersOnly,
  gmailValid,
} from "../utils/validation.js";

const PASS_MIN = 4;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [fieldErrors, setFieldErrors] = useState({});
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const openProfileTab = (r) => {
    if (r === "student") window.open("/profile/student", "_blank");
    else window.open("/profile/owner", "_blank");
  };

  const validate = () => {
    const e = {};
    if (!nameLettersOnly(name)) {
      e.name = "Full name: letters and spaces only.";
    }
    if (!gmailValid(email)) {
      e.email = "Use Gmail ending with @gmail.com.";
    }
    if (password.length < PASS_MIN) {
      e.password = `Password must be at least ${PASS_MIN} characters.`;
    }
    if (password !== confirmPassword) {
      e.confirmPassword = "Passwords do not match.";
    }
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setErr("");
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        role,
      });
      openProfileTab(user.role);
      navigate("/");
    } catch (ex) {
      setErr(ex.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const input =
    "mt-1 w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";
  const fe = "mt-1 text-xs text-red-600";

  return (
    <div className="relative mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="absolute inset-x-0 top-0 mx-auto h-40 max-w-lg rounded-full bg-gradient-to-r from-emerald-200/50 to-cyan-200/40 blur-3xl" />

      <div className="relative rounded-3xl border border-white/60 bg-white/85 p-8 shadow-xl shadow-emerald-900/10 backdrop-blur-xl">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Create account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Gmail only, passwords at least {PASS_MIN} characters, and matching
          confirmation.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {err && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </p>
          )}

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Full name
            </label>
            <input
              required
              className={input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Letters and spaces only"
            />
            {fieldErrors.name && <p className={fe}>{fieldErrors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Gmail</label>
            <input
              type="email"
              required
              className={input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
            />
            {fieldErrors.email && <p className={fe}>{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Password (min {PASS_MIN})
            </label>
            <input
              type="password"
              required
              className={input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && (
              <p className={fe}>{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Confirm password
            </label>
            <input
              type="password"
              required
              className={input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {fieldErrors.confirmPassword && (
              <p className={fe}>{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <div>
            <span className="text-sm font-semibold text-slate-700">I am a</span>
            <div className="mt-2 flex gap-4">
              {[
                { value: "student", label: "Student" },
                { value: "owner", label: "Owner" },
              ].map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm transition hover:border-emerald-200"
                >
                  <input
                    type="radio"
                    name="role"
                    checked={role === o.value}
                    onChange={() => setRole(o.value)}
                    className="text-emerald-600"
                  />
                  {o.label}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Creating…" : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-emerald-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
