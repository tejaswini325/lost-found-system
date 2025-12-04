import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom"; // Added Navigate

// Page Components
import Home from "./pages/Home";
import Lost from "./pages/Lost";
import Found from "./pages/Found";
import Items from "./pages/Items";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReportItem from "./pages/ReportItem";
import Footbar from "./components/Footbar";
import Login1 from "./pages/Login1";
<<<<<<< HEAD:src/App.js
import HelpForm from "./pages/Help";

=======
>>>>>>> b3ff5091b888643cd4b43749d85566ea33650c43:frontend/src/App.js
// Navbar Component
import Navbar from "./components/Navbar";

// --- PRIVATE ROUTE COMPONENT ---
const PrivateRoute = ({ children }) => {
  // Check if user is logged in (has token in localStorage)
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// --- NEW COMPONENT TO MANAGE CONDITIONAL RENDERING ---
function AppContent() {
  const location = useLocation();

  // Define the path(s) where the Navbar should NOT be shown
<<<<<<< HEAD:src/App.js
  const hideNavbarPaths = ['/', '/login', '/login1','/contact','/contact?firstName=Lindsay&lastName=Doe&email=lindsay.doe%40email.com&state=Select+state&employees=Number+of+Employees'];
=======
  const hideNavbarPaths = ['/', '/login', '/login1'];
>>>>>>> b3ff5091b888643cd4b43749d85566ea33650c43:frontend/src/App.js
  // Check if the current path is in the exclusion list
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {/* 💡 Conditional Rendering */}
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lost" element={<Lost />} />
        <Route path="/found" element={<Found />} />
        <Route path="/items" element={<Items />} />

        <Route path="/login" element={<Login />} />
        <Route path="/login1" element={<Login1 />} />
<<<<<<< HEAD:src/App.js
        <Route path="/contact" element={<HelpForm />} />
=======
        <Route path="/contact" element={<p>Contact Details Page Placeholder</p>} />
>>>>>>> b3ff5091b888643cd4b43749d85566ea33650c43:frontend/src/App.js

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
          path="/report-item"
          element={
            <PrivateRoute>
              <ReportItem />
            </PrivateRoute>
          }
        />

        {/* Note: Footbar is typically a component, not a route. 
           If you want the Footbar on all pages, it should be placed 
           outside the <Routes> block like the Navbar. */}
        <Route path="/footbar" element={<Footbar />} />
      </Routes>

      {/* You can optionally render Footbar here if you want it on all pages */}
      {/* <Footbar /> */}
    </>
  );
}

// --- MAIN APP COMPONENT ---
function App() {
  return (
    <Router>
      <AppContent /> {/* Render the new component inside the Router */}
    </Router>
  );
}

export default App;