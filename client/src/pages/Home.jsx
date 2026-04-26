import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { StarRow } from "../components/StarRow.jsx";

export default function Home() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/feedback/home");
        if (!cancelled) setFeedback(data);
      } catch {
        if (!cancelled) setFeedback([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openRandom = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/boarding/random");
      navigate(`/boarding/${data.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-sliit opacity-80"
        style={{ backgroundSize: "26px 26px" }}
      />
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-300/40 to-teal-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-300/35 to-violet-200/25 blur-3xl" />

      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="animate-float mb-4 inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-emerald-700 shadow-md backdrop-blur">
            SLIIT · Malabe
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Boardings{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
              near campus
            </span>
            , simplified
          </h1>
          <p className="mt-5 text-lg text-slate-600">
            Browse ten curated listings, see distance in meters, and send one
            streamlined request — every booking lands with{" "}
            <span className="font-semibold text-emerald-800">owner@gmail.com</span>{" "}
            for clear follow-up and live chat.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={openRandom}
              disabled={loading}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-8 py-3.5 font-bold text-white shadow-xl shadow-emerald-600/35 transition hover:-translate-y-1 hover:shadow-emerald-500/45 disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-card-shine bg-[length:200%_100%] opacity-0 transition duration-700 group-hover:animate-shimmer group-hover:opacity-40" />
              <span className="relative">
                {loading ? "Loading…" : "Surprise me · random listing"}
              </span>
            </button>
            <Link
              to="/boardings"
              className="relative rounded-full border border-slate-200/80 bg-white/80 px-8 py-3.5 font-bold text-slate-800 shadow-md backdrop-blur transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg"
            >
              View all boardings
            </Link>
            <Link
              to="/feedback"
              className="rounded-full border border-transparent bg-slate-900/5 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-900/10"
            >
              Leave feedback
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl gap-5 sm:grid-cols-3">
          {[
            {
              t: "Distance IQ",
              d: "Meters from SLIIT on every card — plan your walk or bus hop.",
              g: "from-emerald-500/20 to-teal-500/10",
            },
            {
              t: "Room signals",
              d: "Single vs sharing toggles match what owners actually offer.",
              g: "from-cyan-500/15 to-emerald-500/10",
            },
            {
              t: "Chat + decisions",
              d: "Talk live, then accept or reject — students get instant toasts.",
              g: "from-violet-500/15 to-teal-500/10",
            },
          ].map((c) => (
            <div
              key={c.t}
              className={`rounded-2xl border border-white/60 bg-gradient-to-br ${c.g} p-6 shadow-lg shadow-slate-900/5 backdrop-blur-md transition duration-300 hover:-translate-y-1`}
            >
              <h3 className="font-display text-lg font-semibold text-slate-900">
                {c.t}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative border-t border-white/50 bg-gradient-to-b from-white/40 via-white/20 to-transparent py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Community feedback
              </h2>
              <p className="text-sm text-slate-600">
                Live star ratings and comments from students & owners.
              </p>
            </div>
            <Link
              to="/feedback"
              className="inline-flex w-fit items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Add yours
            </Link>
          </div>

          {feedback.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white/60 py-12 text-center text-slate-500 backdrop-blur">
              No public feedback yet — be the first to rate your stay.
            </p>
          ) : (
            <ul className="mt-10 grid gap-5 md:grid-cols-2">
              {feedback.map((f, i) => (
                <li
                  key={f._id}
                  className="group rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-emerald-900/5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{
                    animationDelay: `${Math.min(i * 80, 640)}ms`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {f.user?.name || "Member"}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">
                        {f.user?.role}
                      </p>
                    </div>
                    <StarRow value={f.rating} size="sm" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    {f.comment}
                  </p>
                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(f.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
