import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Star, MessageSquare, TrendingUp, Award, Calendar, User, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { feedbackAPI } from '../services/api';
import { DashboardLayout, Card, Badge } from '../components';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { SkeletonCard } from '../components/Skeleton';

const InternFeedback = () => {
  const location = useLocation();
  const feedbackRefs = useRef({});
  const [loading, setLoading] = useState(true);
  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [filterRating, setFilterRating] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Auto-scroll to specific feedback if feedbackId is passed from navigation
  useEffect(() => {
    if (location.state?.feedbackId && feedbackList.length > 0) {
      const feedbackId = location.state.feedbackId;
      const feedbackElement = feedbackRefs.current[feedbackId];
      
      if (feedbackElement) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add highlight effect
          feedbackElement.classList.add('ring-4', 'ring-primary-500', 'ring-opacity-50');
          setTimeout(() => {
            feedbackElement.classList.remove('ring-4', 'ring-primary-500', 'ring-opacity-50');
          }, 2000);
        }, 100);
      }
      
      // Clear the state to prevent re-scrolling on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location.state, feedbackList]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await feedbackAPI.getInternFeedback(user._id);
      
      // Filter out feedback with null/undefined tasks (orphaned feedback)
      const validFeedback = (response.data.data || []).filter(f => f.task !== null && f.task !== undefined);
      
      setFeedbackList(validFeedback);
      setAverageRating(parseFloat(response.data.averageRating) || 0);
    } catch (error) {
      toast.error('Failed to load feedback');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Render star rating
  const renderStars = (rating, size = 'h-5 w-5') => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  // Calculate statistics
  const calculateStats = () => {
    const ratingCounts = {
      5: feedbackList.filter(f => f.rating === 5).length,
      4: feedbackList.filter(f => f.rating === 4).length,
      3: feedbackList.filter(f => f.rating === 3).length,
      2: feedbackList.filter(f => f.rating === 2).length,
      1: feedbackList.filter(f => f.rating === 1).length,
    };

    const categoryStats = {
      quality: feedbackList.filter(f => f.category === 'quality').length,
      timeliness: feedbackList.filter(f => f.category === 'timeliness').length,
      communication: feedbackList.filter(f => f.category === 'communication').length,
      overall: feedbackList.filter(f => f.category === 'overall').length,
    };

    return { ratingCounts, categoryStats };
  };

  const stats = calculateStats();

  // Filter feedback
  const filteredFeedback = feedbackList.filter(feedback => {
    const matchesRating = filterRating === 'all' || feedback.rating === parseInt(filterRating);
    const matchesCategory = filterCategory === 'all' || feedback.category === filterCategory;
    return matchesRating && matchesCategory;
  });

  // Get category badge variant
  const getCategoryBadge = (category) => {
    const variants = {
      quality: 'success',
      timeliness: 'info',
      communication: 'warning',
      overall: 'default',
    };
    return variants[category] || 'default';
  };

  return (
    <DashboardLayout>
      <FadeIn>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View feedback received from your supervisors
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StaggerItem>
                <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium mb-1">Average Rating</p>
                      <h3 className={`text-3xl font-bold`}>
                        {averageRating.toFixed(1)}
                      </h3>
                      <div className="mt-2">
                        {renderStars(Math.round(averageRating), 'h-4 w-4')}
                      </div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Star className="h-8 w-8" />
                    </div>
                  </div>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium mb-1">Total Feedback</p>
                      <h3 className="text-3xl font-bold">{feedbackList.length}</h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <MessageSquare className="h-8 w-8" />
                    </div>
                  </div>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium mb-1">5 Star Reviews</p>
                      <h3 className="text-3xl font-bold">{stats.ratingCounts[5]}</h3>
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
                      <p className="text-purple-100 text-sm font-medium mb-1">This Month</p>
                      <h3 className="text-3xl font-bold">
                        {feedbackList.filter(f => {
                          const feedbackDate = new Date(f.createdAt);
                          const now = new Date();
                          return feedbackDate.getMonth() === now.getMonth() &&
                                 feedbackDate.getFullYear() === now.getFullYear();
                        }).length}
                      </h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <TrendingUp className="h-8 w-8" />
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            </StaggerContainer>

            {/* Rating Distribution */}
            <Card className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Rating Distribution
              </h2>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.ratingCounts[rating];
                  const percentage = feedbackList.length > 0 
                    ? (count / feedbackList.length) * 100 
                    : 0;

                  return (
                    <div key={rating} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-24">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {rating}
                        </span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-16 text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Filters */}
            <Card className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter by Rating:
                  </label>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 flex-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter by Category:
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="quality">Quality</option>
                    <option value="timeliness">Timeliness</option>
                    <option value="communication">Communication</option>
                    <option value="overall">Overall</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Feedback List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Feedback Details ({filteredFeedback.length})
                </h2>
              </div>

              {filteredFeedback.length === 0 ? (
                <Card>
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feedbackList.length === 0 ? 'No Feedback Yet' : 'No Matching Feedback'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feedbackList.length === 0 
                        ? 'Feedback will appear here once provided by your supervisors'
                        : 'Try adjusting your filters to see more results'}
                    </p>
                  </div>
                </Card>
              ) : (
                <StaggerContainer className="space-y-4">
                  {filteredFeedback.map((feedback) => (
                    <StaggerItem key={feedback._id}>
                      <Card 
                        ref={(el) => (feedbackRefs.current[feedback._id] = el)}
                        className="hover:shadow-lg transition-all duration-300"
                      >
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {feedback.task?.title || 'Task'}
                                </h3>
                                <Badge variant={getCategoryBadge(feedback.category)}>
                                  {feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}
                                </Badge>
                              </div>
                              {feedback.task?.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                  {feedback.task.description}
                                </p>
                              )}
                            </div>
                            <div className="ml-4">
                              {renderStars(feedback.rating)}
                            </div>
                          </div>

                          {/* Comment */}
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Feedback:
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {feedback.comment}
                            </p>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>
                                By: <span className="font-medium">{feedback.givenBy?.name || 'Admin'}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </>
        )}
      </FadeIn>
    </DashboardLayout>
  );
};

export default InternFeedback;
