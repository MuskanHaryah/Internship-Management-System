import { useState, useEffect } from 'react';
import { MessageSquare, Search, Plus, Eye, Edit, Trash2, Star, Calendar, User, ClipboardList, TrendingUp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { feedbackAPI, taskAPI, userAPI } from '../services/api';
import { DashboardLayout, Card, Badge, Button, Input, Modal, Dropdown } from '../components';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { SkeletonTable, SkeletonCard } from '../components/Skeleton';

const ManageFeedback = () => {
  const [loading, setLoading] = useState(true);
  const [feedbackList, setFeedbackList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [interns, setInterns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register: registerAdd, handleSubmit: handleSubmitAdd, formState: { errors: errorsAdd }, reset: resetAdd, watch: watchAdd, setValue: setValueAdd } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEdit, setValue: setValueEdit, watch: watchEdit } = useForm();

  const ratingAdd = watchAdd('rating');
  const ratingEdit = watchEdit('rating');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [feedbackResponse, tasksResponse, usersResponse] = await Promise.all([
        feedbackAPI.getAllFeedback(),
        taskAPI.getAllTasks(),
        userAPI.getAllUsers(),
      ]);
      
      setFeedbackList(feedbackResponse.data.data);
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

  const handleAddFeedback = async (data) => {
    setSubmitting(true);
    try {
      await feedbackAPI.createFeedback(data);
      toast.success('Feedback submitted successfully!');
      setShowAddModal(false);
      resetAdd();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFeedback = async (data) => {
    setSubmitting(true);
    try {
      await feedbackAPI.updateFeedback(selectedFeedback._id, data);
      toast.success('Feedback updated successfully!');
      setShowEditModal(false);
      resetEdit();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFeedback = async () => {
    setSubmitting(true);
    try {
      await feedbackAPI.deleteFeedback(selectedFeedback._id);
      toast.success('Feedback deleted successfully!');
      setShowDeleteModal(false);
      setSelectedFeedback(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (feedback) => {
    setSelectedFeedback(feedback);
    setValueEdit('task', feedback.task?._id || '');
    setValueEdit('intern', feedback.intern?._id || '');
    setValueEdit('rating', feedback.rating);
    setValueEdit('comment', feedback.comment);
    setShowEditModal(true);
  };

  const openViewModal = (feedback) => {
    setSelectedFeedback(feedback);
    setShowViewModal(true);
  };

  const openDeleteModal = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDeleteModal(true);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600 dark:text-green-400';
    if (rating >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const filteredFeedback = feedbackList.filter(feedback => {
    // Filter out orphaned feedback (feedback without a valid task)
    if (!feedback.task) return false;
    
    const matchesSearch = 
      feedback.task?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.intern?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === 'all' || feedback.rating === parseInt(filterRating);
    
    return matchesSearch && matchesRating;
  });

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' },
  ];

  const taskOptions = tasks
    .filter(task => {
      // Only show completed tasks
      if (task.status !== 'completed') return false;
      
      // Exclude tasks that already have feedback
      const hasFeedback = feedbackList.some(feedback => feedback.task?._id === task._id);
      return !hasFeedback;
    })
    .map(task => ({
      value: task._id,
      label: `${task.title} - ${task.assignedTo?.name || 'Unassigned'}`,
    }));

  const internOptions = interns.map(intern => ({
    value: intern._id,
    label: intern.name,
  }));

  // Analytics calculations
  const analytics = {
    totalFeedback: feedbackList.length,
    averageRating: feedbackList.length > 0 
      ? (feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length).toFixed(1)
      : 0,
    fiveStars: feedbackList.filter(f => f.rating === 5).length,
    fourStars: feedbackList.filter(f => f.rating === 4).length,
    threeStars: feedbackList.filter(f => f.rating === 3).length,
    twoStars: feedbackList.filter(f => f.rating === 2).length,
    oneStar: feedbackList.filter(f => f.rating === 1).length,
  };

  const StarRating = ({ rating, readonly = false, onChange }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 transition-colors ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            } ${!readonly ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => !readonly && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  const feedbackFormFields = (register, errors, rating, setValue, watch) => {
    const selectedTask = watch('task');
    
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Task <span className="text-red-600">*</span>
          </label>
          <input type="hidden" {...register('task', { required: 'Please select a task' })} />
          <Dropdown
            placeholder="Choose a task"
            error={errors.task?.message}
            options={taskOptions}
            value={selectedTask || ''}
            onChange={(e) => {
              const taskId = e.target.value;
              setValue('task', taskId);
              // Auto-fill intern based on selected task
              const selectedTaskData = tasks.find(t => t._id === taskId);
              if (selectedTaskData?.assignedTo?._id) {
                setValue('intern', selectedTaskData.assignedTo._id);
              }
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating <span className="text-red-600">*</span>
          </label>
          <input type="hidden" {...register('rating', { required: 'Please provide a rating' })} />
          <StarRating rating={rating || 0} onChange={(value) => setValue('rating', value)} />
          {errors.rating && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.rating.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Comments <span className="text-red-600">*</span>
          </label>
          <textarea
            rows="5"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200"
            placeholder="Write your feedback comments..."
            {...register('comment', {
              required: 'Comments are required',
              minLength: { value: 10, message: 'Comments must be at least 10 characters' }
            })}
          />
          {errors.comment && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.comment.message}
            </p>
          )}
        </div>

        {/* Hidden intern field - auto-filled from task */}
        <input type="hidden" {...register('intern', { required: 'Intern is required' })} />
      </>
    );
  };

  return (
    <DashboardLayout>
      <FadeIn>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Feedback Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Rate tasks, provide feedback, and track performance
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Feedback
          </Button>
        </div>

        {/* Analytics Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StaggerItem>
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Feedback</p>
                  <h3 className="text-3xl font-bold">{analytics.totalFeedback}</h3>
                </div>
                <div className="h-14 w-14 bg-white/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-7 w-7" />
                </div>
              </div>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium mb-1">Average Rating</p>
                  <h3 className="text-3xl font-bold">{analytics.averageRating}</h3>
                </div>
                <div className="h-14 w-14 bg-white/20 rounded-lg flex items-center justify-center">
                  <Star className="h-7 w-7 fill-current" />
                </div>
              </div>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">5 Star Reviews</p>
                  <h3 className="text-3xl font-bold">{analytics.fiveStars}</h3>
                </div>
                <div className="h-14 w-14 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-7 w-7" />
                </div>
              </div>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-purple-100 text-sm font-medium mb-3">Rating Distribution</p>
                  <div className="space-y-1">
                    {[
                      { stars: 5, count: analytics.fiveStars },
                      { stars: 4, count: analytics.fourStars },
                      { stars: 3, count: analytics.threeStars },
                      { stars: 2, count: analytics.twoStars },
                      { stars: 1, count: analytics.oneStar }
                    ].map(({ stars, count }) => (
                      <div key={stars} className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1 w-14">
                          <span className="font-medium">{stars}</span>
                          <Star className="h-3 w-3 fill-current" />
                        </div>
                        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: analytics.totalFeedback > 0 ? `${(count / analytics.totalFeedback) * 100}%` : '0%' }}
                          />
                        </div>
                        <span className="w-8 text-right font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-14 w-14 bg-white/20 rounded-lg flex items-center justify-center ml-4">
                  <ClipboardList className="h-7 w-7" />
                </div>
              </div>
            </Card>
          </StaggerItem>
        </StaggerContainer>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Search feedback by task, intern, or comments..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Dropdown
              label=""
              placeholder="Filter by rating"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              options={ratingOptions}
            />
          </div>
        </Card>

        {/* Feedback Table */}
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
                      Intern
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Comments
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredFeedback.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                          {searchTerm ? 'No feedback found matching your search' : 'No feedback yet'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredFeedback.map((feedback) => (
                      <tr key={feedback._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm">
                            <ClipboardList className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white line-clamp-1">
                              {feedback.task?.title || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <User className="h-4 w-4 mr-2" />
                            {feedback.intern?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Star className={`h-4 w-4 fill-current ${getRatingColor(feedback.rating)}`} />
                            <span className={`text-sm font-semibold ${getRatingColor(feedback.rating)}`}>
                              {feedback.rating}.0
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-xs">
                            {feedback.comment}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openViewModal(feedback)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditModal(feedback)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openDeleteModal(feedback)}
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

        {/* Add Feedback Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            resetAdd();
          }}
          title="Add Feedback"
          size="lg"
        >
          <form onSubmit={handleSubmitAdd(handleAddFeedback)} className="space-y-4">
            {feedbackFormFields(registerAdd, errorsAdd, ratingAdd, setValueAdd, watchAdd)}

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
                Submit Feedback
              </Button>
            </div>
          </form>
        </Modal>

        {/* Edit Feedback Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            resetEdit();
            setSelectedFeedback(null);
          }}
          title="Edit Feedback"
          size="lg"
        >
          <form onSubmit={handleSubmitEdit(handleEditFeedback)} className="space-y-4">
            {feedbackFormFields(registerEdit, errorsEdit, ratingEdit, setValueEdit, watchEdit)}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowEditModal(false);
                  resetEdit();
                  setSelectedFeedback(null);
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

        {/* View Feedback Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedFeedback(null);
          }}
          title="Feedback Details"
          size="lg"
        >
          {selectedFeedback && (
            <div className="space-y-6">
              {/* Rating Header */}
              <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/20 mb-4">
                  <Star className={`h-10 w-10 fill-current ${getRatingColor(selectedFeedback.rating)}`} />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedFeedback.rating}.0
                </h3>
                <StarRating rating={selectedFeedback.rating} readonly />
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Task</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedFeedback.task?.title || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Intern</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedFeedback.intern?.name || 'N/A'}
                  </p>
                  {selectedFeedback.intern?.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {selectedFeedback.intern.email}
                    </p>
                  )}
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Submitted On</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedFeedback.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedFeedback.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Comments</p>
                <p className="text-gray-900 dark:text-white leading-relaxed">
                  {selectedFeedback.comment}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedFeedback);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Feedback
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => {
                    setShowViewModal(false);
                    openDeleteModal(selectedFeedback);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Feedback
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
            setSelectedFeedback(null);
          }}
          title="Delete Feedback"
          size="sm"
        >
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Are you sure you want to delete this feedback?
                </p>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Task:</span> {selectedFeedback.task?.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Rating:</span> {selectedFeedback.rating} stars
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedFeedback(null);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  className="flex-1"
                  onClick={handleDeleteFeedback}
                  loading={submitting}
                  disabled={submitting}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </FadeIn>
    </DashboardLayout>
  );
};

export default ManageFeedback;
