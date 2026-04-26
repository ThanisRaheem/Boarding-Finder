import { useState } from "react";
import { Link } from "react-router-dom";

export default function BrandLogo() {
  const [src, setSrc] = useState("/logo.png");

  return (
    <Link
      to="/"
      className="group flex items-center gap-3 outline-none transition-transform duration-300 hover:scale-[1.02]"
    >
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white/80 shadow-lg shadow-emerald-600/25 transition-[box-shadow,transform] duration-300 group-hover:shadow-emerald-500/40 group-hover:ring-emerald-200">
        <img
          src={src}
          alt="SLIIT Boarding Finder"
          className="h-full w-full object-cover"
          onError={() => setSrc("/logo.svg")}
        />
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="hidden flex-col sm:flex">
        <span className="font-display text-base font-bold leading-tight tracking-tight text-slate-900">
          SLIIT{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            Stay
          </span>
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
          Boarding finder
        </span>
      </div>
    </Link>
  );
}
