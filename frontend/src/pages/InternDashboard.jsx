import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, Star, ClipboardList, ArrowRight } from 'lucide-react';
import { taskAPI, feedbackAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout, Card, Badge, Button, ProgressBar } from '../components';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { SkeletonCard } from '../components/Skeleton';

const InternDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    overallProgress: 0,
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks assigned to the current intern
      const tasksResponse = await taskAPI.getMyTasks();
      const tasks = tasksResponse.data.data || tasksResponse.data || [];

      // Calculate stats
      const submitted = tasks.filter(t => t.status === 'completed').length;
      const approved = tasks.filter(t => t.status === 'reviewed').length;
      const completedTasks = submitted + approved; // All tasks that have been submitted
      const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length; // Yet to do
      const total = tasks.length;
      const totalSubmissions = submitted + approved;
      const progress = total > 0 ? Math.round((totalSubmissions / total) * 100) : 0;

      setStats({
        totalTasks: total,
        completedTasks: completedTasks,
        pendingTasks: pendingTasks,
        overallProgress: progress,
      });

      // Get upcoming deadlines (next 7 days, sorted by deadline)
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const upcoming = tasks
        .filter(task => {
          const deadline = new Date(task.deadline);
          // Only show pending and in-progress tasks, exclude submitted, completed, and rejected
          const isActiveTask = task.status === 'pending' || task.status === 'in-progress';
          return deadline >= today && deadline <= nextWeek && isActiveTask;
        })
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 1); // Top 1 most urgent

      setUpcomingDeadlines(upcoming);

      // Fetch recent feedback
      const feedbackResponse = await feedbackAPI.getInternFeedback(user._id);
      const feedbacks = (feedbackResponse.data.data || feedbackResponse.data || []).slice(0, 1); // Latest 1
      setRecentFeedback(feedbacks);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      'in-progress': 'info',
      reviewed: 'success',
    };
    return variants[status] || 'default';
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
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  return (
    <DashboardLayout>
      <FadeIn>
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getGreeting()}, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your internship progress overview
          </p>
        </div>

        {/* Stats Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StaggerItem>
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Tasks</p>
                  <h3 className="text-3xl font-bold">{stats.totalTasks}</h3>
                  <p className="text-xs text-blue-100 mt-2">Assigned to you</p>
                </div>
                <div className="h-14 w-14 bg-white/20 rounded-lg flex items-center justify-center">
                  <ClipboardList className="h-7 w-7" />
                </div>
              </div>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Completed</p>
                  <h3 className="text-3xl font-bold">{stats.completedTasks}</h3>
                  <p className="text-xs text-green-100 mt-2">Tasks submitted</p>
                </div>
                <div className="h-14 w-14 bg-white/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-7 w-7" />
                </div>
              </div>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium mb-1">Pending</p>
                  <h3 className="text-3xl font-bold">{stats.pendingTasks}</h3>
                  <p className="text-xs text-yellow-100 mt-2">Yet to submit</p>
                </div>
                <div className="h-14 w-14 bg-white/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-7 w-7" />
                </div>
              </div>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-purple-100 text-sm font-medium mb-1">Overall Progress</p>
                  <h3 className="text-3xl font-bold text-white mb-3">{stats.overallProgress}%</h3>
                  <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-green-400 rounded-full transition-all duration-500"
                      style={{ width: `${stats.overallProgress}%` }}
                    />
                  </div>
                </div>
                <div className="h-14 w-14 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-7 w-7" />
                </div>
              </div>
            </Card>
          </StaggerItem>
        </StaggerContainer>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                Upcoming Deadlines
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/intern/tasks')}
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : upcomingDeadlines.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No upcoming deadlines</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  in the next 7 days 🎉
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((task) => (
                  <div
                    key={task._id}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => navigate('/intern/tasks', { state: { taskId: task._id } })}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex-1 mr-2">
                        {task.title}
                      </h3>
                      <Badge variant={getStatusBadge(task.status)} size="sm">
                        {task.status === 'in-progress' ? 'In Progress' : task.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="font-medium">
                          {getDaysUntilDeadline(task.deadline)}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{new Date(task.deadline).toLocaleDateString()}</span>
                      </div>
                      <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Feedback */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Star className="h-5 w-5 mr-2 text-primary-600" />
                Recent Feedback
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/intern/feedback')}
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : recentFeedback.length === 0 ? (
              <div className="text-center py-8">
                <Star className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No feedback yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Complete tasks to receive feedback
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentFeedback.map((feedback) => (
                  <div
                    key={feedback._id}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => navigate('/intern/feedback', { state: { feedbackId: feedback._id } })}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {feedback.task?.title || 'Task'}
                        </h3>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= feedback.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                            {feedback.rating}.0
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {feedback.comments}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/intern/tasks')}
              className="justify-start"
            >
              <ClipboardList className="h-5 w-5 mr-3" />
              View All Tasks
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/intern/progress')}
              className="justify-start"
            >
              <TrendingUp className="h-5 w-5 mr-3" />
              Track Progress
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/intern/feedback')}
              className="justify-start"
            >
              <Star className="h-5 w-5 mr-3" />
              View Feedback
            </Button>
          </div>
        </Card>
      </FadeIn>
    </DashboardLayout>
  );
};

export default InternDashboard;
