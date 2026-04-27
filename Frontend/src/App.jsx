import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './assets/pages/LandingPage';
import LoginPage from './assets/pages/LoginPage';
import HomePage from './assets/pages/HomePage';
import Dashboard from './assets/pages/Dashboard';
import DojoMap from './assets/pages/DojoMap';
import Workspace from './assets/pages/Workspace';
import './App.css';

// Protected Route — redirects to landing if not logged in
function ProtectedRoute({ children }) {
  const user = localStorage.getItem('codedojo_user');
  return user ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dojomap" element={<ProtectedRoute><DojoMap /></ProtectedRoute>} />
        <Route path="/problem/:id" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
