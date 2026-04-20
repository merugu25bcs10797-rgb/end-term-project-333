import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';
import { isFirebaseConfigured } from './services/firebase';

import Navbar from './components/Navbar';

// Lazy-loaded pages — reduces initial bundle size
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Subjects = lazy(() => import('./pages/Subjects'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Revision = lazy(() => import('./pages/Revision'));
const AITools = lazy(() => import('./pages/AITools'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

// Loading fallback shown while pages are being fetched
const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '60vh', flexDirection: 'column', gap: '16px'
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '50%',
      border: '4px solid rgba(139,92,246,0.2)',
      borderTop: '4px solid #8B5CF6',
      animation: 'spin 0.8s linear infinite'
    }} />
    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Loading...</p>
  </div>
);

// Firebase config warning banner shown when .env is not set up
const FirebaseAlert = () => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(245,158,11,0.1))',
    border: '1px solid rgba(239,68,68,0.4)',
    borderRadius: '12px', padding: '20px 24px',
    margin: '24px auto', maxWidth: '700px',
    display: 'flex', gap: '16px', alignItems: 'flex-start'
  }}>
    <span style={{ fontSize: '24px', flexShrink: 0 }}>🔥</span>
    <div>
      <h3 style={{ color: '#EF4444', marginBottom: '8px', fontSize: '16px' }}>Firebase Not Connected</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
        Your <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>.env</code> file
        has placeholder values. To connect Firebase:
      </p>
      <ol style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px', paddingLeft: '20px', lineHeight: '2' }}>
        <li>Go to <strong style={{ color: 'var(--text-primary)' }}>console.firebase.google.com</strong></li>
        <li>Open your project → <strong style={{ color: 'var(--text-primary)' }}>Project Settings</strong></li>
        <li>Scroll to "Your apps" → copy the config values</li>
        <li>Paste them into your <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>.env</code> file</li>
        <li>Restart the dev server (<code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>npm run dev</code>)</li>
      </ol>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!currentUser) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {currentUser && <Navbar />}
        {!isFirebaseConfigured && <FirebaseAlert />}
        <main className="page-container" style={{ flex: 1, width: '100%' }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/signup" element={!currentUser ? <Signup /> : <Navigate to="/dashboard" />} />

              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/revision" element={<ProtectedRoute><Revision /></ProtectedRoute>} />
              <Route path="/ai-tools" element={<ProtectedRoute><AITools /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <ToastContainer theme="dark" position="bottom-right" />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </Router>
  );
}

export default App;
