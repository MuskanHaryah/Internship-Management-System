import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  MessageSquare, 
  TrendingUp,
  CheckCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Manage Interns', path: '/admin/interns' },
    { icon: ClipboardList, label: 'Manage Tasks', path: '/admin/tasks' },
    { icon: MessageSquare, label: 'Feedback', path: '/admin/feedback' },
  ];

  const internMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/intern/dashboard' },
    { icon: ClipboardList, label: 'My Tasks', path: '/intern/tasks' },
    { icon: TrendingUp, label: 'Progress', path: '/intern/progress' },
    { icon: CheckCircle, label: 'Submissions', path: '/intern/submissions' },
    { icon: MessageSquare, label: 'Feedback', path: '/intern/feedback' },
  ];

  const menuItems = isAdmin ? adminMenuItems : internMenuItems;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700
          transition-transform duration-300 ease-in-out
          z-50 lg:z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64
        `}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${active
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-white' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-4">
            <p className="text-sm font-semibold text-primary-900 dark:text-primary-300 mb-1">
              Need Help?
            </p>
            <p className="text-xs text-primary-700 dark:text-primary-400 mb-3">
              Contact support for assistance
            </p>
            <button className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
              Get Support
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
