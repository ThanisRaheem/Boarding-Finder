import { useEffect, useState, useCallback } from "react";
import api from "../api/axios.js";
import { downloadBookingPdf } from "../api/downloadPdf.js";
import LiveChat from "../components/LiveChat.jsx";
import Loader from "../components/Loader.jsx";
import { useSocket } from "../hooks/useSocket.js";
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE = import.meta.env.VITE_API_ORIGIN || "";

export default function ProfileOwner() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [bookings, setBookings] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [chatFor, setChatFor] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await api.get("/bookings/owner");
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
      if (payload.type === "new_booking") load();
    };
    socket.on("notification", onNote);
    return () => socket.off("notification", onNote);
  }, [socket, user?.id, load]);

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const setStatus = async (id, status) => {
    await api.patch(`/bookings/${id}/status`, { status });
    await load();
  };

  const imgSrc = (path) =>
    path?.startsWith("http") ? path : `${API_BASE}${path}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-slate-900">
        Owner dashboard
      </h1>
      <p className="text-sm text-slate-600">
        {user?.name} — every student request from all ten listings is assigned to{" "}
        <strong className="text-emerald-800">owner@gmail.com</strong> so you can
        manage one inbox, PDFs, and live chat in one place.
      </p>

      <div className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2">
        {toasts.map((n) => (
          <div
            key={n.id}
            className="rounded-xl border border-brand-200 bg-white p-3 shadow-lg"
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
            title="Inbox sync"
            subtitle="Loading reservation requests…"
            tips={[
              "Fetching latest student forms",
              "Preparing live chat threads",
              "Almost there",
            ]}
          />
        </div>
      ) : bookings.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
          No requests yet. When a student books a listing tied to your email,
          it appears here in real time.
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
                    Student: {b.student?.name} ({b.student?.email})
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {b.fullName} · {b.gmail} · {b.phone}
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
                    className="h-28 w-28 rounded-lg object-cover ring-1 ring-slate-200"
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
                {b.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setStatus(b._id, "accepted")}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(b._id, "rejected")}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
                    >
                      Reject
                    </button>
                  </>
                )}
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
