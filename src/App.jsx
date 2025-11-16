// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";

// Pages publiques
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import CityTour from "./pages/CityTour";
import CityTourCalendar from "./pages/CityTourCalendar";
import ForfaitAcces from "./pages/ForfaitAcces";
import ForfaitLibota from "./pages/ForfaitLibota";
import ForfaitLisanga from "./pages/ForfaitLisanga";
import ForfaitElite from "./pages/ForfaitPremium";
import OuikenacPage from "./pages/Weekend";

// Pages admin / auth
import AdminDashboard from "./pages/Admin";
import AdminLogin from "./pages/Auth";

// 🔐 ProtectedRoute
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useApp();
  const location = useLocation();

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p>Chargement...</p>
    </div>
  );

  if (!isAuthenticated) {
    // Redirige vers /auth avec l'état "from" pour revenir après login
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
};

const AppContent = () => {
  const { loading } = useApp();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      <div className="flex-1">
        <Routes>
          {/* Pages publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/city-tour" element={<CityTour />} />
          <Route path="/city-tour-calendar" element={<CityTourCalendar />} />
          <Route path="/forfait-acces" element={<ForfaitAcces />} />
          <Route path="/forfait-libota" element={<ForfaitLibota />} />
          <Route path="/forfait-lisanga" element={<ForfaitLisanga />} />
          <Route path="/forfait-premium" element={<ForfaitElite />} />
          <Route path="/weekend" element={<OuikenacPage />} />

          {/* 🔐 Page protégée */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Auth */}
          <Route path="/auth" element={<AdminLogin />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <AppProvider>
    <Router>
      <AppContent />
    </Router>
  </AppProvider>
);

export default App;
