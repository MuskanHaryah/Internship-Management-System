import { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, FileText, Calendar, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { taskAPI } from '../services/api';
import { DashboardLayout, Card, Badge, Button } from '../components';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { SkeletonTable } from '../components/Skeleton';

const InternSubmissions = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getMyTasks();
      const tasks = response.data.data || response.data || [];
      
      // Filter only completed and reviewed tasks
      const submittedTasks = tasks.filter(
        task => task.status === 'completed' || task.status === 'reviewed'
      );
      
      setSubmissions(submittedTasks);
    } catch (error) {
      toast.error('Failed to load submissions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'default', // White/default badge for under review
      reviewed: 'success',   // Green badge for reviewed
    };
    return variants[status] || 'default';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <FadeIn>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Submissions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View all your submitted and completed tasks
            </p>
          </div>

          {/* Stats Cards */}
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StaggerItem>
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white relative group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium mb-1">Total Submissions</p>
                      <h3 className="text-3xl font-bold">{submissions.length}</h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <FileText className="h-8 w-8" />
                    </div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Total number of tasks you have submitted or completed
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white relative group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium mb-1">Under Review</p>
                      <h3 className="text-3xl font-bold">
                        {submissions.filter(s => s.status === 'completed').length}
                      </h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Clock className="h-8 w-8" />
                    </div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Tasks waiting for admin review and approval
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white relative group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium mb-1">Reviewed</p>
                      <h3 className="text-3xl font-bold">
                        {submissions.filter(s => s.status === 'reviewed').length}
                      </h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Tasks that have been reviewed and approved by admin
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </Card>
              </StaggerItem>
            </div>
          </StaggerContainer>

          {/* Submissions List */}
          <Card>
            <div className="overflow-x-auto">
              {loading ? (
                <SkeletonTable rows={5} />
              ) : submissions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No submissions yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete and submit your tasks to see them here
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Task
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Submitted On
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Submission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {submissions.map((task) => (
                      <tr key={task._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {task.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                              {task.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            {task.submittedAt ? formatDate(task.submittedAt) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {task.submissionUrl ? (
                            <a
                              href={task.submissionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                            >
                              View Submission
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">No URL</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusBadge(task.status)}>
                            {task.status === 'completed' ? 'Under Review' : 'Reviewed'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.location.href = `/intern/tasks`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </FadeIn>
    </DashboardLayout>
  );
};

export default InternSubmissions;
