import { Outlet, NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import BrandLogo from "./BrandLogo.jsx";

function SignInIcon({ to = "/login" }) {
  return (
    <Link
      to={to}
      title="Sign in"
      className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-600 text-white shadow-lg shadow-slate-900/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-teal-600 hover:shadow-emerald-500/35 active:translate-y-0"
    >
      <svg
        className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
      <span className="absolute inset-0 rounded-full ring-2 ring-white/30 transition group-hover:ring-white/50" />
    </Link>
  );
}

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();

  const profileHref =
    user?.role === "student"
      ? "/profile/student"
      : user?.role === "owner"
        ? "/profile/owner"
        : "/admin";

  const navClass = ({ isActive }) =>
    `nav-link ${isActive ? "nav-link-active" : ""}`;

  return (
    <div className="min-h-screen flex flex-col bg-hero-mesh">
      <header className="glass-header sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-8">
          <BrandLogo />

          <nav className="hidden items-center gap-1 sm:flex ml-40">
            <NavLink to="/" className={navClass} end>
              Home
            </NavLink>
            <NavLink to="/boardings" className={navClass}>
              Boardings
            </NavLink>
            <NavLink to="/feedback" className={navClass}>
              Feedback
            </NavLink>
            
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
            <nav className="flex md:hidden">
              <NavLink
                to="/boardings"
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white/60"
              >
                List
              </NavLink>
              <NavLink
                to="/feedback"
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white/60"
              >
                Rate
              </NavLink>
            </nav>

            {isAuthenticated ? (
              <>
                <a
                  href={profileHref}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden rounded-full border border-emerald-200/80 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md sm:inline-flex"
                >
                  Profile
                </a>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-slate-200/80 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:bg-white sm:text-sm"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <SignInIcon />
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-8 text-center text-xs text-slate-400">
        <p className="font-medium text-slate-300">SLIIT Boarding Finder</p>
        <p className="mt-1">Reservations · Live chat · Community feedback</p>
      </footer>
    </div>
  );
}
