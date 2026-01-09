import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Target, Award, Plus, History, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { taskAPI, progressAPI } from '../services/api';
import { DashboardLayout, Card, Badge, Button, Modal, Input, Spinner } from '../components';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { SkeletonCard } from '../components/Skeleton';
import ProgressBar from '../components/ProgressBar';
import CircularProgress from '../components/CircularProgress';
import { useAuth } from '../context/AuthContext';

const InternProgress = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    percentage: 0,
    status: 'not-started',
    notes: '',
    submissionUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?._id) {
      fetchData();
    } else if (user === null) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user || !user._id) {
        throw new Error('User not found. Please log in again.');
      }
      
      const [tasksRes, progressRes] = await Promise.all([
        taskAPI.getMyTasks(),
        progressAPI.getInternProgress(user._id)
      ]);

      const fetchedTasks = tasksRes.data.data || tasksRes.data || [];
      const fetchedProgress = progressRes.data.data || progressRes.data || [];
      
      setTasks(fetchedTasks);
      setProgressData(fetchedProgress);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load progress data';
      setError(errorMessage);
      toast.error(errorMessage);
      setTasks([]);
      setProgressData([]);
    } finally {
      setLoading(false);
    }
  };

  // Get progress for a specific task
  const getTaskProgress = (taskId) => {
    if (!Array.isArray(progressData)) return null;
    return progressData.find(p => {
      // Check for null/undefined before accessing properties
      if (!p.task) return false;
      const pTaskId = typeof p.task === 'object' ? p.task._id : p.task;
      return pTaskId === taskId;
    });
  };

  // Filter to only show pending and in-progress tasks
  const activeTasks = Array.isArray(tasks) ? tasks.filter(t => {
    return t && (t.status === 'pending' || t.status === 'in-progress');
  }) : [];

  // Calculate overall statistics
  const calculateStats = () => {
    if (!tasks || tasks.length === 0) {
      return {
        totalTasks: 0,
        submittedTasks: 0,
        approvedTasks: 0,
        inProgressTasks: 0,
        avgProgress: 0
      };
    }

    const totalTasks = tasks.length;
    
    // Count tasks by status
    const submittedTasks = tasks.filter(t => t.status === 'completed').length;
    const approvedTasks = tasks.filter(t => t.status === 'reviewed').length;
    
    const inProgressTasks = tasks.filter(t => {
      const progress = getTaskProgress(t._id);
      return progress?.status === 'in-progress';
    }).length;
    
    // Calculate average progress based on submitted + approved tasks
    const totalSubmissions = submittedTasks + approvedTasks;
    const avgProgress = totalTasks > 0 ? Math.round((totalSubmissions / totalTasks) * 100) : 0;

    return {
      totalTasks,
      submittedTasks,
      approvedTasks,
      inProgressTasks,
      avgProgress
    };
  };

  const stats = calculateStats();

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  // Open update modal
  const openUpdateModal = (task) => {
    // Prevent editing reviewed tasks
    if (task.status === 'reviewed') {
      toast.error('Cannot update a reviewed task');
      return;
    }

    const progress = getTaskProgress(task._id);
    setSelectedTask(task);
    setUpdateForm({
      percentage: progress?.percentage || 0,
      status: progress?.status || 'not-started',
      notes: '',
      submissionUrl: task.submissionUrl || ''
    });
    setShowUpdateModal(true);
  };

  // Handle progress update
  const handleUpdateProgress = async () => {
    // Only require notes when percentage is less than 100%
    if (updateForm.percentage !== 100 && !updateForm.notes.trim()) {
      toast.error('Please add a note about your progress');
      return;
    }

    // If progress is 100%, require submission URL and validate it
    if (updateForm.percentage === 100) {
      if (!updateForm.submissionUrl.trim()) {
        toast.error('Please provide a submission URL for completed task');
        return;
      }

      // Validate URL format
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-._~:/?#[\]@!$&'()*+,;=]*)?$/;
      if (!urlPattern.test(updateForm.submissionUrl.trim())) {
        toast.error('Please provide a valid URL (e.g., https://drive.google.com/... or https://github.com/...)');
        return;
      }
    }

    try {
      setSubmitting(true);
      const existingProgress = getTaskProgress(selectedTask._id);

      // Auto-set status based on percentage
      let autoStatus = 'not-started';
      if (updateForm.percentage === 100) {
        autoStatus = 'completed';
      } else if (updateForm.percentage > 0) {
        autoStatus = 'in-progress';
      }

      const progressData = {
        ...updateForm,
        status: autoStatus
      };

      if (existingProgress) {
        // Update existing progress
        await progressAPI.updateProgress(existingProgress._id, progressData);
      } else {
        // Create new progress
        await progressAPI.createProgress({
          task: selectedTask._id,
          ...progressData
        });
      }

      // If progress is 100%, update task status to submitted
      if (updateForm.percentage === 100) {
        await taskAPI.submitTask(selectedTask._id, {
          submissionUrl: updateForm.submissionUrl
        });
        toast.success('Task submitted successfully!');
      } else {
        toast.success('Progress updated successfully!');
      }

      setShowUpdateModal(false);
      setUpdateForm({ percentage: 0, status: 'not-started', notes: '', submissionUrl: '' });
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update progress');
    } finally {
      setSubmitting(false);
    }
  };

  // Show progress history
  const showHistory = (task) => {
    const progress = getTaskProgress(task._id);
    if (progress && progress.updates && progress.updates.length > 0) {
      setSelectedHistory({ task, updates: progress.updates });
      setShowHistoryModal(true);
    } else {
      toast.error('No progress history available for this task');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'not-started': 'text-gray-500 bg-gray-100 dark:bg-gray-800',
      'in-progress': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      'completed': 'text-green-600 bg-green-100 dark:bg-green-900/30'
    };
    return colors[status] || colors['not-started'];
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

  // Get progress color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 50) return 'text-blue-600';
    if (percentage >= 25) return 'text-yellow-600';
    return 'text-orange-600';
  };

  console.log('📄 About to render main component');

  return (
    <DashboardLayout>
      <FadeIn>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Progress Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your task progress and update your achievements
          </p>
        </div>

        {/* Error State */}
        {error && !loading && (
          <Card className="mb-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-red-600 dark:text-red-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                  Error Loading Data
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                  onClick={fetchData}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StaggerItem>
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium mb-1">Total Tasks</p>
                      <h3 className="text-3xl font-bold">{stats.totalTasks}</h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Target className="h-8 w-8" />
                    </div>
                  </div>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium mb-1">Submitted</p>
                      <h3 className="text-3xl font-bold">{stats.submittedTasks}</h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Clock className="h-8 w-8" />
                    </div>
                  </div>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium mb-1">Approved</p>
                      <h3 className="text-3xl font-bold">{stats.approvedTasks}</h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Award className="h-8 w-8" />
                    </div>
                  </div>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium mb-1">In Progress</p>
                      <h3 className="text-3xl font-bold">{stats.inProgressTasks}</h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <TrendingUp className="h-8 w-8" />
                    </div>
                  </div>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium mb-1">Avg Progress</p>
                      <h3 className="text-3xl font-bold">{stats.avgProgress}%</h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <CircularProgress progress={stats.avgProgress} size={32} strokeWidth={3} showLabel={false} />
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            </StaggerContainer>

            {/* Task Progress Cards */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Task Progress
              </h2>

              {activeTasks.length === 0 ? (
                <Card>
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Active Tasks
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {tasks.length > 0 
                        ? 'All tasks are completed! Great job!' 
                        : 'Tasks will appear here once assigned by your admin'}
                    </p>
                  </div>
                </Card>
              ) : (
                <StaggerContainer className="space-y-6">
                  {activeTasks.map((task) => {
                    const progress = getTaskProgress(task._id);
                    const percentage = progress?.percentage || 0;
                    const status = progress?.status || 'not-started';

                    return (
                      <StaggerItem key={task._id}>
                        <Card className="hover:shadow-lg transition-shadow">
                          <div className="space-y-4">
                            {/* Task Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {task.title}
                                  </h3>
                                  <Badge variant={task.status === 'reviewed' ? 'success' : 'warning'}>
                                    {getStatusLabel(task.status)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                  {task.description}
                                </p>
                              </div>
                              <div className="ml-4">
                                <CircularProgress 
                                  progress={percentage} 
                                  size={60} 
                                  strokeWidth={4}
                                  showLabel={true}
                                  className={getProgressColor(percentage)}
                                />
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className={`font-medium px-2 py-1 rounded ${getStatusColor(status)}`}>
                                  {status === 'in-progress' ? 'In Progress' : 
                                   status === 'not-started' ? 'Not Started' : 'Completed'}
                                </span>
                                <span className={`font-semibold ${getProgressColor(percentage)}`}>
                                  {percentage}%
                                </span>
                              </div>
                              <ProgressBar progress={percentage} showLabel={false} />
                            </div>

                            {/* Task Details */}
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-4">
                                <span>
                                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                                </span>
                                {progress?.updatedAt && (
                                  <span>
                                    Last updated: {new Date(progress.updatedAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {progress?.updates && progress.updates.length > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => showHistory(task)}
                                  >
                                    <History className="h-4 w-4 mr-1" />
                                    History
                                  </Button>
                                )}
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => openUpdateModal(task)}
                                  disabled={task.status === 'reviewed'}
                                  className={task.status === 'reviewed' ? 'opacity-50 cursor-not-allowed' : ''}
                                  title={task.status === 'reviewed' ? 'Task is reviewed and cannot be updated' : 'Update task progress'}
                                >
                                  <Edit2 className="h-4 w-4 mr-1" />
                                  {task.status === 'reviewed' ? 'Reviewed' : 'Update'}
                                </Button>
                              </div>
                            </div>

                            {/* Latest Note */}
                            {progress?.notes && (
                              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm">
                                <p className="text-blue-900 dark:text-blue-100 font-medium mb-1">
                                  Latest Note:
                                </p>
                                <p className="text-blue-700 dark:text-blue-300">
                                  {progress.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </Card>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              )}
            </div>
          </>
        )}

        {/* Update Progress Modal */}
        <Modal
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setUpdateForm({ percentage: 0, status: 'not-started', notes: '', submissionUrl: '' });
          }}
          title="Update Progress"
        >
          {selectedTask && (
            <div className="space-y-5">
              {/* Task Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {selectedTask.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your progress for this task
                </p>
              </div>

              {/* Progress Percentage */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress Percentage <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={updateForm.percentage}
                    onChange={(e) => {
                      const percentage = parseInt(e.target.value);
                      let autoStatus = 'not-started';
                      if (percentage === 100) {
                        autoStatus = 'completed';
                      } else if (percentage > 0) {
                        autoStatus = 'in-progress';
                      }
                      setUpdateForm({ ...updateForm, percentage, status: autoStatus });
                    }}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 min-w-[60px] text-center">
                    {updateForm.percentage}%
                  </span>
                </div>
              </div>

              {/* Status - Auto-updated based on progress - Hidden when 100% */}
              {updateForm.percentage !== 100 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status <span className="text-xs text-gray-500">(Auto-updated)</span>
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <span className="text-gray-900 dark:text-white font-medium">
                      {updateForm.status === 'not-started' && 'Not Started'}
                      {updateForm.status === 'in-progress' && 'In Progress'}
                      {updateForm.status === 'completed' && 'Reviewed'}
                    </span>
                  </div>
                </div>
              )}

              {/* Submission URL - Only show when progress is 100% */}
              {updateForm.percentage === 100 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Submission URL <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Provide the link to your completed work (e.g., GitHub repo, Google Drive, etc.)
                  </p>
                  <Input
                    type="url"
                    placeholder="https://github.com/username/project"
                    value={updateForm.submissionUrl}
                    onChange={(e) => setUpdateForm({ ...updateForm, submissionUrl: e.target.value })}
                  />
                </div>
              )}

              {/* Notes - Hidden when 100% */}
              {updateForm.percentage !== 100 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Progress Notes <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Describe what you've accomplished or any challenges faced
                  </p>
                  <textarea
                    placeholder="Example: Completed the UI design and started implementing the backend API..."
                    value={updateForm.notes}
                    onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setUpdateForm({ percentage: 0, status: 'not-started', notes: '', submissionUrl: '' });
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleUpdateProgress}
                  disabled={
                    submitting || 
                    (updateForm.percentage === 100 ? !updateForm.submissionUrl.trim() : !updateForm.notes.trim())
                  }
                >
                  {submitting ? 'Updating...' : 'Update Progress'}
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Progress History Modal */}
        <Modal
          isOpen={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedHistory(null);
          }}
          title="Progress History"
        >
          {selectedHistory && (
            <div className="space-y-4">
              {/* Task Info */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {selectedHistory.task.title}
                </h4>
              </div>

              {/* Timeline */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedHistory.updates.slice().reverse().map((update, index) => (
                  <div key={index} className="flex gap-4">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      {index < selectedHistory.updates.length - 1 && (
                        <div className="w-0.5 h-full bg-blue-200 dark:bg-blue-800"></div>
                      )}
                    </div>

                    {/* Update Content */}
                    <div className="flex-1 pb-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {update.percentage}%
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(update.timestamp).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {update.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowHistoryModal(false);
                    setSelectedHistory(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </FadeIn>
    </DashboardLayout>
  );
};

export default InternProgress;
