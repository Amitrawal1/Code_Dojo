import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./assets/pages/LandingPage";
import LoginPage from "./assets/pages/LoginPage";
import HomePage from "./assets/pages/HomePage";
import Dashboard from "./assets/pages/Dashboard";
import DojoMap from "./assets/pages/DojoMap";
import Workspace from "./assets/pages/Workspace";
import EditNamePage from "./assets/pages/EditNamePage";
import EditEmailPage from "./assets/pages/EditEmailPage";
import EditPasswordPage from "./assets/pages/EditPasswordPage";
import { useAuth0 } from "@auth0/auth0-react";
import { ProgressProvider } from "./context/ProgressContext";
import Navbar from "./assets/components/Navbar";
import "./App.css";

// Protected Route — redirects to landing if not logged in
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const user = localStorage.getItem("codedojo_user");
  if (isLoading) return <div>Loading...</div>;
  return user || isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const user = localStorage.getItem('codedojo_user');
  
  if (isLoading) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-cyan-400 font-mono">Loading App...</div>;

  const isLoggedIn = user || isAuthenticated;

  return (
    <ProgressProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
        {/* Public Routes - Redirect to Home if already logged in */}
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/home" replace /> : <LandingPage />}
        />
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/home" replace /> : <LoginPage />} 
        />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dojomap" element={<ProtectedRoute><DojoMap /></ProtectedRoute>} />
        <Route path="/problem/:id" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
        <Route path="/profile/edit-name" element={<ProtectedRoute><EditNamePage /></ProtectedRoute>} />
        <Route path="/profile/edit-email" element={<ProtectedRoute><EditEmailPage /></ProtectedRoute>} />
        <Route path="/profile/edit-password" element={<ProtectedRoute><EditPasswordPage /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </BrowserRouter>
    </ProgressProvider>
  );
}

export default App;
