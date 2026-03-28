import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import Loader from "./components/Loader.jsx";
import Home from "./pages/Home.jsx";
import Boardings from "./pages/Boardings.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";
import BoardingDetail from "./pages/BoardingDetail.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProfileStudent from "./pages/ProfileStudent.jsx";
import ProfileOwner from "./pages/ProfileOwner.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function PrivateRoute({ children, roles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ fromPrivate: true }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const { loading: authBootstrapping } = useAuth();

  if (authBootstrapping) {
    return (
      <Loader
        title="SLIIT Stay"
        subtitle="Bootstrapping your boarding finder…"
        tips={[
          "Restoring saved sign-in",
          "Connecting preferences",
          "Ready in a blink",
        ]}
      />
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/boardings" element={<Boardings />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/boarding/:id" element={<BoardingDetail />} />
        <Route
          path="/boarding/:id/request"
          element={
            <PrivateRoute roles={["student"]}>
              <BookingForm />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile/student"
          element={
            <PrivateRoute roles={["student"]}>
              <ProfileStudent />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/owner"
          element={
            <PrivateRoute roles={["owner"]}>
              <ProfileOwner />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
