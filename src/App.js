import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

/* ===== USER PAGES ===== */
import Home from "./pages/Home";
import Lost from "./pages/Lost";
import Found from "./pages/Found";
import Items from "./pages/Items";
import Login from "./pages/Login";
import Login1 from "./pages/Login1";
import Dashboard from "./pages/Dashboard";
import ReportItem from "./pages/ReportItem";
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

/* ===== PRIVATE ROUTE ===== */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

/* ===== APP CONTENT ===== */
function AppContent() {
  const location = useLocation();

  const hideNavbarPaths = ["/", "/login", "/login1", "/contact"];
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
          path="/report-item"
          element={
            <PrivateRoute>
              <ReportItem />
            </PrivateRoute>
          }
        />

        {/* ===== ADMIN ROUTES ===== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/pending" element={<PendingItems />} />
        <Route path="/admin/all-items" element={<AllItems />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/analytics" element={<Analytics />} />

        {/* Optional */}
        <Route path="/footbar" element={<Footbar />} />
      </Routes>
    </>
  );
}

/* ===== MAIN APP ===== */
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
