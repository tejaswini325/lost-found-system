import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Page Components
import Home from "./pages/Home";
import Lost from "./pages/Lost";
import Found from "./pages/Found";
import Items from "./pages/Items";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReportItem from "./pages/ReportItem";
import HelpForm from "./pages/Help";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Footbar from "./components/Footbar";
import Login1 from "./pages/Login1";
import MyItems from "./pages/MyItems";

// Navbar Component
import Navbar from "./components/Navbar";

// Admin Components
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Users from "./admin/pages/Users";
import AllItems from "./admin/pages/AllItems";
import Reports from "./admin/pages/Reports";
import Analytics from "./admin/pages/Analytics";
import Settings from "./admin/pages/Settings";
import PendingItems from "./admin/pages/PendingItems";

// --- PRIVATE ROUTE COMPONENT ---
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// --- ADMIN PRIVATE ROUTE COMPONENT ---
const AdminPrivateRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  return adminToken ? children : <Navigate to="/admin/login" />;
};

// --- NEW COMPONENT TO MANAGE CONDITIONAL RENDERING ---
function AppContent() {
  const location = useLocation();

  // Define the path(s) where the Navbar should NOT be shown
  const isExcluded = location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/login1' ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/contact';

  const shouldShowNavbar = !isExcluded;

  // Define paths where Footbar should NOT be shown
  const shouldShowFootbar = !isExcluded;

  return (
    <>
      {/* Conditional Rendering for Navbar */}
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lost" element={<Lost />} />
        <Route path="/lost-items" element={<Lost />} />
        <Route path="/found" element={<Found />} />
        <Route path="/found-items" element={<Found />} />
        <Route path="/items" element={<Items />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login1" element={<Login1 />} />
        <Route path="/contact" element={<HelpForm />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminPrivateRoute>
              <AdminDashboard />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminPrivateRoute>
              <Users />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/all-items"
          element={
            <AdminPrivateRoute>
              <AllItems />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminPrivateRoute>
              <Reports />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminPrivateRoute>
              <Analytics />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminPrivateRoute>
              <Settings />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/pending"
          element={
            <AdminPrivateRoute>
              <PendingItems />
            </AdminPrivateRoute>
          }
        />

        {/* PROTECTED ROUTES - Require Login */}
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
        <Route
          path="/report-item"
          element={
            <PrivateRoute>
              <ReportItem />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* Conditional Rendering for Footbar */}
      {shouldShowFootbar && <Footbar />}
    </>
  );
}

// --- MAIN APP COMPONENT ---
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
