import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { StarRow } from "../components/StarRow.jsx";
import Loader from "../components/Loader.jsx";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, b, u, f] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/bookings"),
          api.get("/admin/users"),
          api.get("/admin/feedback"),
        ]);
        if (!cancelled) {
          setStats(s.data);
          setBookings(b.data);
          setUsers(u.data);
          setFeedback(f.data);
        }
      } catch {
        if (!cancelled) setErr("Could not load admin data.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (err) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-red-600">
        {err}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Loader
            variant="inline"
            title="Admin console"
            subtitle="Loading stats, bookings, users, and feedback…"
            tips={[
              "Aggregating platform metrics",
              "Pulling latest reservations",
              "Securing your admin view",
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-slate-900">
        Admin dashboard · Campus Admin
      </h1>
      <p className="text-sm text-slate-600">
        Overview of users and reservations across the demo platform.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total users", value: stats.users },
          { label: "Students", value: stats.students },
          { label: "Owners", value: stats.owners },
          { label: "Bookings", value: stats.bookings },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {c.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-brand-700">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-800">{stats.pending}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-900">Accepted</p>
          <p className="mt-1 text-2xl font-bold text-emerald-800">
            {stats.accepted}
          </p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-900">Rejected</p>
          <p className="mt-1 text-2xl font-bold text-red-800">{stats.rejected}</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-lg font-semibold text-slate-900">
          Feedback · stars & comments
        </h2>
        <p className="text-sm text-slate-600">
          Same entries surface on the home page for visitors; this table is the
          full audit trail.
        </p>
        <div className="mt-4 max-h-96 overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Comment</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {feedback.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-500">
                    No feedback yet.
                  </td>
                </tr>
              ) : (
                feedback.map((fb) => (
                  <tr key={fb._id} className="border-t border-slate-100">
                    <td className="p-3 align-top">
                      <span className="font-medium">{fb.user?.name}</span>
                      <br />
                      <span className="text-xs text-slate-500">
                        {fb.user?.email}
                      </span>
                    </td>
                    <td className="p-3 align-top">
                      <StarRow value={fb.rating} size="sm" />
                    </td>
                    <td className="max-w-md p-3 align-top text-slate-700">
                      {fb.comment}
                    </td>
                    <td className="whitespace-nowrap p-3 align-top text-xs text-slate-500">
                      {new Date(fb.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Recent bookings
          </h2>
          <div className="mt-4 max-h-80 overflow-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-3">Boarding</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 20).map((b) => (
                  <tr key={b._id} className="border-t border-slate-100">
                    <td className="p-3">{b.boardingTitle}</td>
                    <td className="p-3">{b.student?.email}</td>
                    <td className="p-3 capitalize">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Accounts
          </h2>
          <div className="mt-4 max-h-80 overflow-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-slate-100">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 capitalize">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
