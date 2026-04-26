import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import ImageCarousel from "../components/ImageCarousel.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function RoomOption({ label, available, selected, onSelect }) {
  if (!available) {
    return (
      <div className="flex flex-1 cursor-not-allowed items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400 line-through">
        {label}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-1 items-center justify-center rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
        selected
          ? "border-brand-500 bg-emerald-50 text-emerald-900 ring-2 ring-brand-200"
          : "border-emerald-400 bg-emerald-50 text-emerald-800 hover:border-emerald-500"
      }`}
    >
      {label}
      <span className="ml-2 h-2 w-2 rounded-full bg-emerald-500" />
    </button>
  );
}

export default function BoardingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [boarding, setBoarding] = useState(null);
  const [loadErr, setLoadErr] = useState("");
  const [hint, setHint] = useState("");
  const [roomChoice, setRoomChoice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/boarding/${id}`);
        if (!cancelled) {
          setBoarding(data);
          if (data.singleAvailable && !data.sharingAvailable) {
            setRoomChoice("single");
          } else if (!data.singleAvailable && data.sharingAvailable) {
            setRoomChoice("sharing");
          } else {
            setRoomChoice(null);
          }
        }
      } catch {
        if (!cancelled) setLoadErr("Could not load this boarding.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const goRequest = () => {
    setHint("");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user?.role !== "student") {
      setHint("Only student accounts can send a reservation request.");
      return;
    }
    if (!roomChoice) {
      setHint("Choose single or sharing when both are open.");
      return;
    }
    navigate(`/boarding/${id}/request?type=${roomChoice}`);
  };

  if (loadErr && !boarding) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-red-600">{loadErr}</p>
        <Link to="/" className="mt-4 inline-block text-brand-600 hover:underline">
          Back home
        </Link>
      </div>
    );
  }

  if (!boarding) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Loader
          variant="inline"
          title="Opening listing"
          subtitle="Fetching photos, distance, and room options…"
          tips={[
            "Carousel images loading",
            "Owner preferences in sync",
            "Hang tight",
          ]}
        />
      </div>
    );
  }

  const both = boarding.singleAvailable && boarding.sharingAvailable;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link
        to="/"
        className="text-sm font-medium text-brand-600 hover:text-brand-500"
      >
        ← Back
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <ImageCarousel images={boarding.images} alt={boarding.title} />
          <h1 className="mt-6 font-display text-3xl font-bold text-slate-900">
            {boarding.title}
          </h1>
          <p className="mt-2 text-slate-600">{boarding.address}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            {boarding.description}
          </p>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Distance from SLIIT campus
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-brand-700">
              {boarding.distanceMeters.toLocaleString()}{" "}
              <span className="text-lg font-semibold text-slate-600">meters</span>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">Availability</p>
            <p className="mt-1 text-xs text-slate-500">
              Options the owner opened show in green; closed types are disabled.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <RoomOption
                label="Single room"
                available={boarding.singleAvailable}
                selected={roomChoice === "single"}
                onSelect={() => both && setRoomChoice("single")}
              />
              <RoomOption
                label="Sharing"
                available={boarding.sharingAvailable}
                selected={roomChoice === "sharing"}
                onSelect={() => both && setRoomChoice("sharing")}
              />
            </div>
            {both && (
              <p className="mt-3 text-xs text-slate-500">
                Selected:{" "}
                <span className="font-medium text-brand-700">
                  {roomChoice || "tap an option"}
                </span>
              </p>
            )}
          </div>

          {hint && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {hint}
            </p>
          )}

          <button
            type="button"
            onClick={goRequest}
            className="w-full rounded-2xl bg-slate-900 py-4 font-semibold text-white shadow-lg transition hover:bg-slate-800"
          >
            Request this boarding
          </button>
          {!isAuthenticated && (
            <p className="text-center text-xs text-slate-500">
              You can browse freely; signing in as a student unlocks the request
              form.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
