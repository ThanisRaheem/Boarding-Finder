import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

export default function Boardings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/boarding/list");
        if (!cancelled) setList(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative overflow-hidden pb-20 pt-10">
      <div
        className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 inline-flex rounded-full bg-white/80 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 shadow-sm backdrop-blur">
            10 curated spots
          </p>
          <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Boardings around{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              SLIIT
            </span>
          </h1>
          <p className="mt-3 text-slate-600">
            Tap a card to open photos, distance, and room types. Every request is
            routed to the campus owner inbox for a single clear workflow.
          </p>
        </div>

        {loading ? (
          <div className="mx-auto mt-12 max-w-lg">
            <Loader
              variant="inline"
              title="Gathering stays"
              subtitle="Loading all boardings near SLIIT…"
              tips={[
                "Sorting by distance from campus",
                "Applying room availability",
                "Almost ready to browse",
              ]}
            />
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((b, i) => (
              <Link
                key={b.id}
                to={`/boarding/${b.id}`}
                className="group gradient-border card-hover opacity-0 motion-safe:animate-slide-up"
                style={{ animationDelay: `${Math.min(i * 70, 700)}ms` }}
              >
                <div className="gradient-border-inner overflow-hidden p-0">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={b.images[0]}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-800 shadow">
                      {b.distanceMeters.toLocaleString()} m
                    </span>
                  </div>
                  <div className="space-y-2 p-4">
                    <h2 className="font-display text-lg font-semibold text-slate-900 group-hover:text-emerald-800">
                      {b.title}
                    </h2>
                    <p className="line-clamp-2 text-sm text-slate-600">
                      {b.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          b.singleAvailable
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-400 line-through"
                        }`}
                      >
                        Single
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          b.sharingAvailable
                            ? "bg-teal-100 text-teal-900"
                            : "bg-slate-100 text-slate-400 line-through"
                        }`}
                      >
                        Sharing
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
