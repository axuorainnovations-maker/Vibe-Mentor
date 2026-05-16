import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseView from './pages/CourseView';
import LessonPlayer from './pages/LessonPlayer';
import Certificates from './pages/Certificates';
import Settings from './pages/Settings';
import VerifyCertificate from './pages/VerifyCertificate';
import Admin from './pages/Admin';
import Layout from './components/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-text-primary border-t-transparent" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-text-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={isSignedIn ? <Navigate to="/dashboard" replace /> : <Landing />} />
      {/* Splats required: Clerk path routing uses nested URLs (e.g. verify-email-address). */}
      <Route path="/login/*" element={<Login />} />
      <Route path="/signup/*" element={<Signup />} />
      <Route path="/verify/:certId" element={<VerifyCertificate />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route
        path="/courses"
        element={<ProtectedRoute><Layout><Courses /></Layout></ProtectedRoute>}
      />
      <Route
        path="/courses/:id"
        element={<ProtectedRoute><Layout><CourseView /></Layout></ProtectedRoute>}
      />
      <Route
        path="/lessons/:id"
        element={<ProtectedRoute><Layout><LessonPlayer /></Layout></ProtectedRoute>}
      />
      <Route
        path="/certificates"
        element={<ProtectedRoute><Layout><Certificates /></Layout></ProtectedRoute>}
      />
      <Route
        path="/settings"
        element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>}
      />
      <Route
        path="/admin"
        element={<ProtectedRoute><Admin /></ProtectedRoute>}
      />
    </Routes>
  );
}

export default App;
