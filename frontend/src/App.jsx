import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './utils/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ManageInterns from './pages/ManageInterns';
import ManageTasks from './pages/ManageTasks';
import ManageFeedback from './pages/ManageFeedback';
import InternDashboard from './pages/InternDashboard';
import InternTaskList from './pages/InternTaskList';
import InternProgress from './pages/InternProgress';
import InternSubmissions from './pages/InternSubmissions';
import InternFeedback from './pages/InternFeedback';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/interns"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageInterns />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tasks"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageTasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageFeedback />
                </ProtectedRoute>
              }
            />

            {/* Protected Intern Routes */}
            <Route
              path="/intern/dashboard"
              element={
                <ProtectedRoute allowedRoles={['intern']}>
                  <InternDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/intern/tasks"
              element={
                <ProtectedRoute allowedRoles={['intern']}>
                  <InternTaskList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/intern/progress"
              element={
                <ProtectedRoute allowedRoles={['intern']}>
                  <InternProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/intern/submissions"
              element={
                <ProtectedRoute allowedRoles={['intern']}>
                  <InternSubmissions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/intern/feedback"
              element={
                <ProtectedRoute allowedRoles={['intern']}>
                  <InternFeedback />
                </ProtectedRoute>
              }
            />

            {/* Shared Routes - Both Admin and Intern */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['admin', 'intern']}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'dark:bg-gray-800 dark:text-white',
              style: {
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                backdropFilter: 'blur(8px)',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10B981',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10B981',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: '#EF4444',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#EF4444',
                },
              },
              loading: {
                style: {
                  background: '#3B82F6',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#3B82F6',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
