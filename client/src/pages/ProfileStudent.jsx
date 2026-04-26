import { useEffect, useState, useCallback } from "react";
import api from "../api/axios.js";
import { downloadBookingPdf } from "../api/downloadPdf.js";
import LiveChat from "../components/LiveChat.jsx";
import Loader from "../components/Loader.jsx";
import { useSocket } from "../hooks/useSocket.js";
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE =
  import.meta.env.VITE_API_ORIGIN || "";

export default function ProfileStudent() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [bookings, setBookings] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [chatFor, setChatFor] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await api.get("/bookings/student");
    setBookings(data);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  useEffect(() => {
    if (!socket || !user?.id) return;
    const onNote = (payload) => {
      setToasts((t) => [...t, { id: Date.now(), ...payload }]);
      if (
        payload.type === "booking_status" ||
        payload.type === "booking_submitted"
      ) {
        load();
      }
    };
    socket.on("notification", onNote);
    return () => socket.off("notification", onNote);
  }, [socket, user?.id, load]);

  const dismiss = (id) =>
    setToasts((t) => t.filter((x) => x.id !== id));

  const imgSrc = (path) =>
    path?.startsWith("http") ? path : `${API_BASE}${path}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Student hub
          </h1>
          <p className="text-sm text-slate-600">
            Hi {user?.name} — track requests, download your PDF summary, and chat
            with owners.
          </p>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2">
        {toasts.map((n) => (
          <div
            key={n.id}
            className="rounded-xl border border-brand-200 bg-white p-3 shadow-lg shadow-brand-900/10"
          >
            <p className="text-sm text-slate-800">{n.message}</p>
            <button
              type="button"
              onClick={() => dismiss(n.id)}
              className="mt-2 text-xs font-medium text-brand-600"
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="mx-auto mt-10 max-w-md">
          <Loader
            variant="inline"
            title="Your requests"
            subtitle="Loading bookings and owner updates…"
            tips={[
              "Syncing reservation status",
              "Checking notifications",
              "Nearly done",
            ]}
          />
        </div>
      ) : bookings.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
          You have not submitted a reservation yet. Browse a sample boarding from
          the home page.
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {bookings.map((b) => (
            <li
              key={b._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div>
                  <h2 className="font-display font-semibold text-slate-900">
                    {b.boardingTitle}
                  </h2>
                  <p className="text-sm text-slate-600">
                    Room: <span className="capitalize">{b.roomType}</span> · Owner
                    contact: {b.owner?.email}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Submitted {new Date(b.createdAt).toLocaleString()}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                      b.status === "accepted"
                        ? "bg-emerald-100 text-emerald-800"
                        : b.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                {b.attachmentUrl && (
                  <img
                    src={imgSrc(b.attachmentUrl)}
                    alt=""
                    className="h-24 w-24 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => downloadBookingPdf(b._id)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setChatFor(chatFor === b._id ? null : b._id)
                  }
                  className="rounded-xl border border-brand-300 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100"
                >
                  {chatFor === b._id ? "Hide live chat" : "Live chat"}
                </button>
              </div>
              {chatFor === b._id && (
                <div className="mt-4">
                  <LiveChat bookingId={b._id} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
