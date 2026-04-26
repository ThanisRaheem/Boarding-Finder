import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { StarRow } from "../components/StarRow.jsx";

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div
      className="flex gap-1"
      onMouseLeave={() => setHover(0)}
      role="group"
      aria-label="Star rating"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          className="rounded p-1 transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <svg
            className={`h-9 w-9 ${
              i <= display ? "text-amber-400 drop-shadow" : "text-slate-200"
            } transition-colors`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function FeedbackPage() {
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    if (
      !isAuthenticated ||
      (user?.role !== "student" && user?.role !== "owner")
    ) {
      setErr("Sign in as a student or owner to post feedback.");
      return;
    }
    if (comment.trim().length < 3) {
      setErr("Comment must be at least 3 characters.");
      return;
    }
    setSaving(true);
    try {
      await api.post("/feedback", { rating, comment: comment.trim() });
      setOk("Thank you — your feedback is visible on the home page.");
      setComment("");
    } catch (ex) {
      setErr(ex.response?.data?.message || "Could not submit.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-lg px-4 py-14 sm:px-6">
      <div className="absolute left-1/2 top-0 h-48 w-[120%] -translate-x-1/2 bg-gradient-to-b from-emerald-200/40 to-transparent blur-2xl" />

      <div className="relative rounded-3xl border border-white/60   bg-white/80 p-8 shadow-xl shadow-emerald-900/10 backdrop-blur-xl">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Rate your experience
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Stars and comments appear on the home page. Admins review the full
          feedback log in the dashboard.
        </p>

        {!isAuthenticated && (
          <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <Link to="/login" className="font-semibold text-emerald-700 underline">
              Sign in
            </Link>{" "}
            to leave feedback.{" "}
            <Link to="/register" className="font-semibold text-emerald-700">
              Create an account
            </Link>{" "}
            if you are new.
          </p>
        )}

        <form onSubmit={submit} className="mt-8 space-y-6">
          {err && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </p>
          )}
          {ok && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              {ok}
            </p>
          )}

          <div>
            <p className="text-sm font-semibold text-slate-700">Star rating</p>
            <div className="mt-3">
              <StarInput value={rating} onChange={setRating} />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Your comment
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              placeholder="What went well? What could improve?"
            />
          </div>

          <button
            type="submit"
            disabled={
              saving || !isAuthenticated || user?.role === "admin"
            }
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:-translate-y-0.5 hover:shadow-emerald-500/35 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {saving ? "Sending…" : "Submit feedback"}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Preview
          </p>
          <div className="mt-3 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
            <StarRow value={rating} />
            <p className="text-sm text-slate-600">
              {comment.trim() || "Your comment preview…"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
