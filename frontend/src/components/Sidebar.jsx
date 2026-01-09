import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700 z-50 lg:z-30 w-64
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </motion.button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 group
                    ${active
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-white' : ''} group-hover:scale-110 transition-transform`} />
                  <span className="font-medium">{item.label}</span>
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto h-2 w-2 rounded-full bg-white"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-4"
          >
            <p className="text-sm font-semibold text-primary-900 dark:text-primary-300 mb-1">
              Need Help?
            </p>
            <p className="text-xs text-primary-700 dark:text-primary-400 mb-3">
              Contact support for assistance
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md"
            >
              Get Support
            </motion.button>
          </motion.div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
