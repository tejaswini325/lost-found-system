import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

/* ===== USER PAGES ===== */
import Home from "./pages/Home";
import Lost from "./pages/Lost";
import Found from "./pages/Found";
import Items from "./pages/Items";
import Login from "./pages/Login";
import Login1 from "./pages/Login1";
import Dashboard from "./pages/Dashboard";
import MyItems from "./pages/MyItems";
import HelpForm from "./pages/Help";

/* ===== ADMIN PAGES ===== */
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import PendingItems from "./admin/pages/PendingItems";
import AllItems from "./admin/pages/AllItems";
import Users from "./admin/pages/Users";
import Reports from "./admin/pages/Reports";
import Settings from "./admin/pages/Settings";
import Analytics from "./admin/pages/Analytics";

/* ===== COMPONENTS ===== */
import Navbar from "./components/Navbar";
import Footbar from "./components/Footbar";

/* ===== PRIVATE ROUTE FOR USERS ===== */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

/* ===== APP CONTENT ===== */
function AppContent() {
  const location = useLocation();

  const hideNavbarPaths = ["/", "/login", "/login1", "/admin/login"];
  const shouldShowNavbar =
    !hideNavbarPaths.includes(location.pathname) &&
    !location.pathname.startsWith("/admin");

  return (
    <>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        {/* ===== USER ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/lost" element={<Lost />} />
        <Route path="/found" element={<Found />} />
        <Route path="/items" element={<Items />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login1" element={<Login1 />} />
        <Route path="/contact" element={<HelpForm />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-items"
          element={
            <PrivateRoute>
              <MyItems />
            </PrivateRoute>
          }
        />

        {/* ===== ADMIN ROUTES ===== */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pending"
          element={
            <ProtectedRoute>
              <PendingItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/all-items"
          element={
            <ProtectedRoute>
              <AllItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* Optional */}
        <Route path="/footbar" element={<Footbar />} />
      </Routes>
    </>
  );
}

/* ===== MAIN APP ===== */
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
