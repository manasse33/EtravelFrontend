// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";

// import SidebarNavigation from "./components/Navigation";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import CityTour from "./pages/CityTour";
import CityTourCalendar from "./pages/CityTourCalendar";
import ForfaitAcces from "./pages/ForfaitAcces";
import ForfaitLibota from "./pages/ForfaitLibota";
import ForfaitLisanga from "./pages/ForfaitLisanga";
import ForfaitElite from "./pages/ForfaitPremium";
import OuikenacPage from "./pages/Weekend";
import AdminDashboard from "./pages/Admin";
import AdminLogin from "./pages/Auth";


// --- composant de protection pour les pages nécessitant une connexion ---
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useApp();
//   return isAuthenticated ? children : <Navigate to="/auth" replace />;
// };

const AppContent = () => {
  const { loading } = useApp();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  // --- Liste des routes sans Sidebar ---
  // const hideSidebarRoutes = ["/", "/auth", "/verify-email"];
  // const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex bg-white">
      {/* On n’affiche le sidebar que si la route ne fait pas partie des pages à masquer */}
      {/* {!shouldHideSidebar && <SidebarNavigation />} */}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
             <Route path="/city-tour" element={<CityTour />} />
             <Route path="/city-tour-calendar" element={<CityTourCalendar />} />
             <Route path="/forfait-acces" element={<ForfaitAcces />} />
             <Route path="/forfait-libota" element={<ForfaitLibota />} />
             <Route path="/forfait-lisanga" element={<ForfaitLisanga />} />
              <Route path="/forfait-premium" element={<ForfaitElite />} />
               <Route path="/weekend" element={<OuikenacPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
              AdminDashboardent={<AdminLogin />} />
          {/* <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          /> */}
          {/* <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} /> */}
          {/* <Route
            path="/project"
            element={
              <ProtectedRoute>
                <ProjectNewPage />
              </ProtectedRoute>
            }
          />
          <Route path="/project/:id" element={<ProjetDetailPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          /> */}
          {/* <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          /> */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <AppProvider>
    {/* <CompetencesConsole /> */}
    <Router>
      <AppContent />
    </Router>
  </AppProvider>
);

export default App;
