import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, ClipboardList, Calendar, Flag, Clock, Eye, CheckCircle, XCircle, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { taskAPI } from '../services/api';
import { DashboardLayout, Card, Badge, Button, Input, Modal } from '../components';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { SkeletonTable } from '../components/Skeleton';

const InternTaskList = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, pending, in-progress, completed
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Auto-open task modal if task ID is passed from navigation
  useEffect(() => {
    if (location.state?.taskId && tasks.length > 0) {
      const task = tasks.find(t => t._id === location.state.taskId);
      if (task) {
        handleViewTask(task);
        // Clear the state to prevent re-opening on re-render
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, tasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getMyTasks();
      setTasks(response.data.data || response.data || []);
    } catch (error) {
      toast.error('Failed to load tasks');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowViewModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      'in-progress': 'info',
      submitted: 'info',
      completed: 'success',
      rejected: 'danger',
    };
    return variants[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'reviewed': 'Reviewed'
    };
    return labels[status] || status;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      low: 'default',
      medium: 'warning',
      high: 'danger',
    };
    return variants[priority] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-600 dark:text-gray-400',
      medium: 'text-yellow-600 dark:text-yellow-400',
      high: 'text-red-600 dark:text-red-400',
    };
    return colors[priority] || 'text-gray-600';
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600 dark:text-red-400' };
    if (diffDays === 0) return { text: 'Today', color: 'text-orange-600 dark:text-orange-400' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'text-yellow-600 dark:text-yellow-400' };
    if (diffDays <= 3) return { text: `${diffDays} days`, color: 'text-yellow-600 dark:text-yellow-400' };
    return { text: `${diffDays} days`, color: 'text-gray-600 dark:text-gray-400' };
  };

  // Handle task submission
  const handleSubmitTask = async () => {
    if (!submissionUrl.trim()) {
      toast.error('Please provide a submission URL');
      return;
    }

    // Validate URL format
    const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    if (!urlPattern.test(submissionUrl.trim())) {
      toast.error('Please provide a valid URL (e.g., https://drive.google.com/... or https://github.com/...)');
      return;
    }

    try {
      setSubmitting(true);
      await taskAPI.submitTask(selectedTask._id, { submissionUrl });
      toast.success('Task submitted successfully!');
      setShowSubmitModal(false);
      setShowViewModal(false);
      setSubmissionUrl('');
      fetchTasks(); // Refresh the task list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit task');
    } finally {
      setSubmitting(false);
    }
  };

  // Open submit modal
  const openSubmitModal = (task) => {
    setSelectedTask(task);
    setSubmissionUrl(task.submissionUrl || '');
    setShowSubmitModal(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || task.status === activeTab;
    
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesTab && matchesPriority;
  });

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'reviewed').length,
    submitted: tasks.filter(t => t.status === 'completed').length,
  };

  const tabs = [
    { id: 'all', label: 'All Tasks', count: taskCounts.all, icon: ClipboardList },
    { id: 'pending', label: 'Pending', count: taskCounts.pending, icon: Clock },
    { id: 'in-progress', label: 'In Progress', count: taskCounts['in-progress'], icon: CheckCircle },
    { id: 'submitted', label: 'Completed', count: taskCounts.submitted, icon: Upload },
    { id: 'completed', label: 'Reviewed', count: taskCounts.completed, icon: CheckCircle },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
  ];

  return (
    <DashboardLayout>
      <FadeIn>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all your assigned tasks
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Search tasks by title or description..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Tasks List */}
        <Card>
          {loading ? (
            <SkeletonTable rows={8} />
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                {searchTerm || filterPriority !== 'all' 
                  ? 'No tasks found matching your filters' 
                  : activeTab === 'all'
                  ? 'No tasks assigned yet'
                  : `No ${activeTab.replace('-', ' ')} tasks`
                }
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                {searchTerm || filterPriority !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Tasks will appear here once assigned by your admin'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTasks.map((task) => {
                    const deadlineInfo = getDaysUntilDeadline(task.deadline);
                    return (
                      <tr key={task._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {task.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {task.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <div>
                              <div className={`font-medium ${deadlineInfo.color}`}>
                                {deadlineInfo.text}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(task.deadline).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getPriorityBadge(task.priority)}>
                            <Flag className="h-3 w-3 mr-1" />
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusBadge(task.status)}>
                            {getStatusLabel(task.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewTask(task)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* View Task Details Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedTask(null);
          }}
          title="Task Details"
          size="lg"
        >
          {selectedTask && (
            <div className="space-y-6">
              {/* Task Header */}
              <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {selectedTask.title}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant={getStatusBadge(selectedTask.status)}>
                    {getStatusLabel(selectedTask.status)}
                  </Badge>
                  <Badge variant={getPriorityBadge(selectedTask.priority)}>
                    {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)} Priority
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Description
                </h4>
                <p className="text-gray-900 dark:text-white leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Deadline</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedTask.deadline).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className={`text-sm font-medium mt-1 ${getDaysUntilDeadline(selectedTask.deadline).color}`}>
                    {getDaysUntilDeadline(selectedTask.deadline).text}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Assigned By</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedTask.assignedBy?.name || 'Admin'}
                  </p>
                  {selectedTask.assignedBy?.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {selectedTask.assignedBy.email}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Created On</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedTask.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedTask.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Submission Info (if task is submitted) */}
              {selectedTask.submissionUrl && (selectedTask.status === 'completed' || selectedTask.status === 'reviewed') && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                        Submission Details
                      </h4>
                    </div>
                    {selectedTask.submittedAt && (
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        {new Date(selectedTask.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                  <a
                    href={selectedTask.submissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all block"
                  >
                    {selectedTask.submissionUrl}
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </Button>
                {selectedTask.status !== 'reviewed' && selectedTask.status !== 'completed' && (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      setShowViewModal(false);
                      openSubmitModal(selectedTask);
                    }}
                  >
                    Submit Task
                  </Button>
                )}
                {selectedTask.status === 'completed' && (
                  <div className="flex-1 text-center py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium">
                    ✓ Submitted on {new Date(selectedTask.submittedAt).toLocaleDateString()}
                  </div>
                )}
                {selectedTask.status === 'reviewed' && (
                  <div className="flex-1 text-center py-2 px-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg font-medium">
                    ✓ Approved
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* Submit Task Modal */}
        <Modal
          isOpen={showSubmitModal}
          onClose={() => {
            setShowSubmitModal(false);
            setSubmissionUrl('');
          }}
          title="Submit Task"
        >
          {selectedTask && (
            <div className="space-y-5">
              {/* Task Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {selectedTask.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Deadline: {new Date(selectedTask.deadline).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* Submission Instructions */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Submission URL <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Provide a link to your completed work (Google Drive, GitHub, Dropbox, etc.)
                </p>
                <Input
                  type="url"
                  placeholder="https://drive.google.com/... or https://github.com/..."
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Previous Submission Info */}
              {selectedTask.submissionUrl && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium mb-1">
                    Previous Submission
                  </p>
                  <a
                    href={selectedTask.submissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {selectedTask.submissionUrl}
                  </a>
                  {selectedTask.submittedAt && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Submitted on {new Date(selectedTask.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSubmissionUrl('');
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleSubmitTask}
                  disabled={submitting || !submissionUrl.trim()}
                >
                  {submitting ? 'Submitting...' : 'Submit Task'}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </FadeIn>
    </DashboardLayout>
  );
};

export default InternTaskList;
