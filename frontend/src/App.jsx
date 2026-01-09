import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './utils/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
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

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
              },
              success: {
                duration: 4000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
