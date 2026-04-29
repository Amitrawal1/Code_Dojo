import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./assets/pages/LandingPage";
import LoginPage from "./assets/pages/LoginPage";
import HomePage from "./assets/pages/HomePage";
import Dashboard from "./assets/pages/Dashboard";
import DojoMap from "./assets/pages/DojoMap";
import Workspace from "./assets/pages/Workspace";
import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";

// Protected Route — redirects to landing if not logged in
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const user = localStorage.getItem("codedojo_user");
  if (isLoading) return <div>Loading...</div>;
  return user || isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  const user = localStorage.getItem('codedojo_user');

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Redirect to Home if already logged in */}
        <Route 
          path="/" 
          element={<LandingPage />} 
        />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/home" replace /> : <LoginPage />} 
        />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dojomap" element={<ProtectedRoute><DojoMap /></ProtectedRoute>} />
        <Route path="/problem/:id" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
