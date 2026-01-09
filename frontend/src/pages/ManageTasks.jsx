import { useState, useEffect } from 'react';
import { ClipboardList, Search, Plus, Eye, Edit, Trash2, Calendar, Flag, User, ExternalLink, MessageSquare, Star, TrendingUp, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { taskAPI, userAPI, feedbackAPI, progressAPI } from '../services/api';
import { DashboardLayout, Card, Badge, Button, Input, Modal, Dropdown } from '../components';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { SkeletonTable } from '../components/Skeleton';

const ManageTasks = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [interns, setInterns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [taskProgress, setTaskProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  const { register: registerAdd, handleSubmit: handleSubmitAdd, formState: { errors: errorsAdd }, reset: resetAdd } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEdit, setValue } = useForm();
  const { register: registerFeedback, handleSubmit: handleSubmitFeedback, formState: { errors: errorsFeedback }, reset: resetFeedback, setValue: setValueFeedback, watch: watchFeedback } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, usersResponse] = await Promise.all([
        taskAPI.getAllTasks(),
        userAPI.getAllUsers(),
      ]);
      
      setTasks(tasksResponse.data.data);
      const internsList = usersResponse.data.data.filter(u => u.role === 'intern');
      setInterns(internsList);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (data) => {
    setSubmitting(true);
    try {
      await taskAPI.createTask(data);
      toast.success('Task created successfully!');
      setShowAddModal(false);
      resetAdd();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTask = async (data) => {
    setSubmitting(true);
    try {
      await taskAPI.updateTask(selectedTask._id, data);
      toast.success('Task updated successfully!');
      setShowEditModal(false);
      resetEdit();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    setSubmitting(true);
    try {
      await taskAPI.deleteTask(selectedTask._id);
      toast.success('Task deleted successfully!');
      setShowDeleteModal(false);
      setSelectedTask(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitTaskFeedback = async (data) => {
    setSubmitting(true);
    try {
      await feedbackAPI.createFeedback({
        task: selectedTask._id,
        intern: selectedTask.assignedTo._id,
        rating: parseInt(data.rating),
        comment: data.comment
      });
      toast.success('Feedback submitted successfully!');
      setShowFeedbackModal(false);
      resetFeedback();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setValue('title', task.title);
    setValue('description', task.description);
    setValue('assignedTo', task.assignedTo?._id || '');
    setValue('deadline', task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '');
    setValue('priority', task.priority);
    setValue('status', task.status);
    setShowEditModal(true);
  };

  const openViewModal = async (task) => {
    setSelectedTask(task);
    setShowViewModal(true);
    
    // Fetch progress data if task is in-progress
    if (task.status === 'in-progress') {
      setLoadingProgress(true);
      try {
        const response = await progressAPI.getTaskProgress(task._id);
        if (response.data.data && response.data.data.length > 0) {
          // Get the most recent progress entry
          setTaskProgress(response.data.data[0]);
        } else {
          setTaskProgress(null);
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
        setTaskProgress(null);
      } finally {
        setLoadingProgress(false);
      }
    } else {
      setTaskProgress(null);
    }
  };

  const openDeleteModal = (task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const openFeedbackModal = (task) => {
    setSelectedTask(task);
    setShowFeedbackModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      'in-progress': 'info',
      completed: 'info',
      reviewed: 'success',
    };
    return variants[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'reviewed': 'Reviewed',
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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // When filtering by 'completed', include completed and reviewed tasks
    let matchesStatus;
    if (filterStatus === 'all') {
      matchesStatus = true;
    } else if (filterStatus === 'completed') {
      matchesStatus = task.status === 'completed' || task.status === 'reviewed';
    } else {
      matchesStatus = task.status === filterStatus;
    }
    
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'reviewed', label: 'Reviewed' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const internOptions = interns.map(intern => ({
    value: intern._id,
    label: intern.name,
  }));

  const taskFormFields = (register, errors, showStatus = true) => (
    <>
      <Input
        label="Task Title"
        type="text"
        placeholder="Enter task title"
        error={errors.title?.message}
        {...register('title', {
          required: 'Title is required',
          minLength: { value: 5, message: 'Title must be at least 5 characters' }
        })}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          rows="4"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200"
          placeholder="Enter task description"
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 10, message: 'Description must be at least 10 characters' }
          })}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errors.description.message}
          </p>
        )}
      </div>

      <Dropdown
        label="Assign to Intern"
        placeholder="Select an intern"
        error={errors.assignedTo?.message}
        options={internOptions}
        {...register('assignedTo', { required: 'Please assign to an intern' })}
      />

      <Input
        label="Deadline"
        type="date"
        error={errors.deadline?.message}
        {...register('deadline', { 
          required: 'Deadline is required',
          validate: (value) => {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today || 'Deadline cannot be in the past';
          }
        })}
      />

      <Dropdown
        label="Priority"
        placeholder="Select priority"
        error={errors.priority?.message}
        options={[
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ]}
        {...register('priority', { required: 'Priority is required' })}
      />

      {showStatus && (
        <Dropdown
          label="Status"
          placeholder="Select status"
          error={errors.status?.message}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'reviewed', label: 'Reviewed' },
          ]}
          {...register('status', { required: 'Status is required' })}
        />
      )}
    </>
  );

  return (
    <DashboardLayout>
      <FadeIn>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create, assign, and track tasks for interns
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Task
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Search tasks..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dropdown
              label=""
              placeholder="Filter by status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={statusOptions}
            />
            <Dropdown
              label=""
              placeholder="Filter by priority"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              options={priorityOptions}
            />
          </div>
        </Card>

        {/* Tasks Table */}
        <Card>
          {loading ? (
            <SkeletonTable rows={8} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Assigned To
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
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                          {searchTerm ? 'No tasks found matching your search' : 'No tasks yet'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => (
                      <tr key={task._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {task.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                              {task.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <User className="h-4 w-4 mr-2" />
                            {task.assignedTo?.name || 'Unassigned'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(task.deadline).toLocaleDateString()}
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
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openViewModal(task)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditModal(task)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openDeleteModal(task)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Add Task Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            resetAdd();
          }}
          title="Create New Task"
          size="lg"
        >
          <form onSubmit={handleSubmitAdd(handleAddTask)} className="space-y-4">
            {taskFormFields(registerAdd, errorsAdd, false)}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowAddModal(false);
                  resetAdd();
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                loading={submitting}
                disabled={submitting}
              >
                Create Task
              </Button>
            </div>
          </form>
        </Modal>

        {/* Edit Task Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            resetEdit();
            setSelectedTask(null);
          }}
          title="Edit Task"
          size="lg"
        >
          <form onSubmit={handleSubmitEdit(handleEditTask)} className="space-y-4">
            {taskFormFields(registerEdit, errorsEdit, false)}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowEditModal(false);
                  resetEdit();
                  setSelectedTask(null);
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                loading={submitting}
                disabled={submitting}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Task Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedTask(null);
            setTaskProgress(null);
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
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedTask.description}
                </p>
                <div className="flex gap-2 mt-4">
                  <Badge variant={getStatusBadge(selectedTask.status)}>
                    {getStatusLabel(selectedTask.status)}
                  </Badge>
                  <Badge variant={getPriorityBadge(selectedTask.priority)}>
                    {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)} Priority
                  </Badge>
                </div>
              </div>

              {/* Progress Section - Only show for in-progress tasks */}
              {selectedTask.status === 'in-progress' && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Current Progress</h4>
                  </div>
                  
                  {loadingProgress ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded animate-pulse"></div>
                      <div className="h-16 bg-blue-200 dark:bg-blue-700 rounded animate-pulse"></div>
                    </div>
                  ) : taskProgress ? (
                    <div className="space-y-3">
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Completion</span>
                          <span className="text-lg font-bold text-blue-900 dark:text-blue-100">{taskProgress.percentage}%</span>
                        </div>
                        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${taskProgress.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Latest Note */}
                      {taskProgress.notes && (
                        <div className="mt-3">
                          <div className="flex items-center mb-2">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Latest Note</span>
                          </div>
                          <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-blue-200 dark:border-blue-700">
                            <p className="text-sm text-gray-700 dark:text-gray-300">{taskProgress.notes}</p>
                          </div>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            Updated {new Date(taskProgress.updatedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-blue-600 dark:text-blue-400">No progress updates yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Assigned To</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedTask.assignedTo?.name || 'Unassigned'}
                  </p>
                  {selectedTask.assignedTo?.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {selectedTask.assignedTo.email}
                    </p>
                  )}
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Deadline</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedTask.deadline).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Created</p>
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

              {/* Submission URL - Only show for completed or reviewed tasks */}
              {(selectedTask.status === 'completed' || selectedTask.status === 'reviewed') && selectedTask.submissionUrl && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-2 font-medium">Submission URL</p>
                  <a 
                    href={selectedTask.submissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors break-all"
                  >
                    <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="underline">{selectedTask.submissionUrl}</span>
                  </a>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {/* Give Feedback Button - Only show for completed tasks */}
                {selectedTask.status === 'completed' && (
                  <Button
                    variant="success"
                    className="flex-1"
                    onClick={() => {
                      setShowViewModal(false);
                      openFeedbackModal(selectedTask);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Give Feedback
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedTask);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => {
                    setShowViewModal(false);
                    openDeleteModal(selectedTask);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedTask(null);
          }}
          title="Delete Task"
          size="sm"
        >
          {selectedTask && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold">"{selectedTask.title}"</span>?
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone. All task data will be permanently removed.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedTask(null);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  className="flex-1"
                  onClick={handleDeleteTask}
                  loading={submitting}
                  disabled={submitting}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Give Feedback Modal */}
        <Modal
          isOpen={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            resetFeedback();
            setSelectedTask(null);
          }}
          title="Give Feedback"
          size="lg"
        >
          {selectedTask && (
            <form onSubmit={handleSubmitFeedback(handleSubmitTaskFeedback)} className="space-y-6">
              {/* Task Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedTask.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Intern: {selectedTask.assignedTo?.name}
                </p>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label
                      key={rating}
                      className="cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={rating}
                        className="sr-only"
                        {...registerFeedback('rating', { required: 'Rating is required' })}
                      />
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          watchFeedback('rating') >= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </label>
                  ))}
                </div>
                {errorsFeedback.rating && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errorsFeedback.rating.message}
                  </p>
                )}
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comments <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="6"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200"
                  placeholder="Provide detailed feedback on the task completion..."
                  {...registerFeedback('comment', {
                    required: 'Comments are required',
                    minLength: { value: 20, message: 'Comments must be at least 20 characters' }
                  })}
                />
                {errorsFeedback.comment && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errorsFeedback.comment.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowFeedbackModal(false);
                    resetFeedback();
                    setSelectedTask(null);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  loading={submitting}
                  disabled={submitting}
                >
                  Submit Feedback
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </FadeIn>
    </DashboardLayout>
  );
};

export default ManageTasks;
