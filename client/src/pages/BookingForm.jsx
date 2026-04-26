import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import {
  nameLettersOnly,
  gmailValid,
  phoneValid,
  nicValid,
  positiveInt,
} from "../utils/validation.js";

const initial = {
  fullName: "",
  gmail: "",
  gender: "",
  phone: "",
  nic: "",
  address: "",
  monthsStay: "",
  age: "",
  rulesAcknowledgement: "",
};

export default function BookingForm() {
  const { id: boardingId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomType = params.get("type");

  const [boarding, setBoarding] = useState(null);
  const [boardingLoading, setBoardingLoading] = useState(true);
  const [form, setForm] = useState(initial);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitErr, setSubmitErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBoardingLoading(true);
      try {
        const { data } = await api.get(`/boarding/${boardingId}`);
        if (!cancelled) setBoarding(data);
      } catch {
        if (!cancelled) setBoarding(null);
      } finally {
        if (!cancelled) setBoardingLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [boardingId]);

  useEffect(() => {
    if (!roomType || !["single", "sharing"].includes(roomType)) {
      setSubmitErr("Invalid room type. Go back and choose from the boarding page.");
    }
  }, [roomType]);

  const validate = () => {
    const e = {};
    if (!nameLettersOnly(form.fullName)) {
      e.fullName = "Full name: letters and spaces only.";
    }
    if (!gmailValid(form.gmail)) {
      e.gmail = "Use a valid Gmail ending with @gmail.com.";
    }
    if (!form.gender) e.gender = "Select gender.";
    if (!phoneValid(form.phone)) {
      e.phone = "Phone must be 10 digits starting with 07.";
    }
    if (!nicValid(form.nic)) {
      e.nic = "NIC: 10 digits or 9 digits + V.";
    }
    if (!form.address?.trim()) e.address = "Address is required.";
    if (!positiveInt(form.monthsStay)) {
      e.monthsStay = "Months must be a whole number greater than zero.";
    }
    if (!positiveInt(form.age)) {
      e.age = "Age must be a whole number greater than zero.";
    }
    if (!form.rulesAcknowledgement?.trim()) {
      e.rulesAcknowledgement =
        "Confirm you have read the owner rules (required).";
    }
    if (!file) e.file = "Please attach an image.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setSubmitErr("");
    if (!boarding || !roomType || !["single", "sharing"].includes(roomType)) {
      setSubmitErr("Invalid booking context.");
      return;
    }
    if (roomType === "single" && !boarding.singleAvailable) {
      setSubmitErr("Single is not available for this listing.");
      return;
    }
    if (roomType === "sharing" && !boarding.sharingAvailable) {
      setSubmitErr("Sharing is not available for this listing.");
      return;
    }
    if (!validate()) return;

    const fd = new FormData();
    fd.append("boardingId", boardingId);
    fd.append("roomType", roomType);
    fd.append("fullName", form.fullName.trim());
    fd.append("gmail", form.gmail.trim());
    fd.append("gender", form.gender);
    fd.append("phone", form.phone.trim());
    fd.append("nic", form.nic.trim());
    fd.append("address", form.address.trim());
    fd.append("monthsStay", String(form.monthsStay));
    fd.append("age", String(form.age));
    fd.append("rulesAcknowledgement", form.rulesAcknowledgement.trim());
    fd.append("attachment", file);

    setSaving(true);
    try {
      await api.post("/bookings", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/profile/student");
    } catch (err) {
      const msg = err.response?.data?.message || "Could not submit request.";
      setSubmitErr(msg);
    } finally {
      setSaving(false);
    }
  };

  if (boardingLoading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Loader
          variant="inline"
          title="Reservation form"
          subtitle="Loading boarding details for your request…"
          tips={[
            "Fetching listing metadata",
            "Preparing validation rules",
            "Almost there",
          ]}
        />
      </div>
    );
  }

  if (!boarding) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-slate-600">This boarding could not be loaded.</p>
        <Link to="/" className="mt-4 inline-block font-semibold text-emerald-600 hover:underline">
          Back home
        </Link>
      </div>
    );
  }

  const field =
    "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
  const errText = "mt-1 text-xs text-red-600";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        to={`/boarding/${boardingId}`}
        className="text-sm font-medium text-brand-600 hover:text-brand-500"
      >
        ← Back to listing
      </Link>
      <h1 className="mt-6 font-display text-2xl font-bold text-slate-900">
        Reservation request · {boarding.title}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Room type:{" "}
        <span className="font-semibold capitalize text-brand-700">
          {roomType}
        </span>
        . All fields are required. The owner is notified after you submit.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {submitErr && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitErr}
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <input
            className={field}
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Letters only"
          />
          {errors.fullName && <p className={errText}>{errors.fullName}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Gmail</label>
          <input
            type="email"
            className={field}
            value={form.gmail}
            onChange={(e) => setForm({ ...form, gmail: e.target.value })}
            placeholder="you@gmail.com"
          />
          {errors.gmail && <p className={errText}>{errors.gmail}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Photo</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:font-medium file:text-brand-700"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {errors.file && <p className={errText}>{errors.file}</p>}
        </div>

        <div>
          <span className="text-sm font-medium text-slate-700">Gender</span>
          <div className="mt-2 flex gap-4">
            {["male", "female"].map((g) => (
              <label key={g} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="gender"
                  checked={form.gender === g}
                  onChange={() => setForm({ ...form, gender: g })}
                  className="text-brand-600"
                />
                <span className="capitalize">{g}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className={errText}>{errors.gender}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Phone (07xxxxxxxx)
          </label>
          <input
            className={field}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="0712345678"
            maxLength={10}
          />
          {errors.phone && <p className={errText}>{errors.phone}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">NIC</label>
          <input
            className={field}
            value={form.nic}
            onChange={(e) => setForm({ ...form, nic: e.target.value })}
            placeholder="9 digits + V or 10 digits"
          />
          {errors.nic && <p className={errText}>{errors.nic}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Address</label>
          <textarea
            rows={3}
            className={field}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Your current address"
          />
          {errors.address && <p className={errText}>{errors.address}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Months staying
            </label>
            <input
              type="number"
              min={1}
              className={field}
              value={form.monthsStay}
              onChange={(e) => setForm({ ...form, monthsStay: e.target.value })}
            />
            {errors.monthsStay && (
              <p className={errText}>{errors.monthsStay}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Age</label>
            <input
              type="number"
              min={1}
              className={field}
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
            {errors.age && <p className={errText}>{errors.age}</p>}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Rules & regulations — type your understanding or acceptance
          </label>
          <textarea
            rows={4}
            className={field}
            value={form.rulesAcknowledgement}
            onChange={(e) =>
              setForm({ ...form, rulesAcknowledgement: e.target.value })
            }
            placeholder="I have read and agree to respect the owner's house rules…"
          />
          {errors.rulesAcknowledgement && (
            <p className={errText}>{errors.rulesAcknowledgement}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-2xl bg-brand-600 py-3.5 font-semibold text-white shadow-md hover:bg-brand-500 disabled:opacity-60"
        >
          {saving ? "Submitting…" : "Submit & notify owner"}
        </button>
      </form>
    </div>
  );
}
