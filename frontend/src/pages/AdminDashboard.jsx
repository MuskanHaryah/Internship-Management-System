import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ClipboardList, TrendingUp, CheckCircle, Search, Plus, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { userAPI, taskAPI } from '../services/api';
import { DashboardLayout, Card, Badge, Button, Input, Dropdown } from '../components';
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from '../components/Animations';
import { SkeletonStats, SkeletonTable } from '../components/Skeleton';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterns: 0,
    totalTasks: 0,
    completedTasks: 0,
    averageProgress: 0,
  });
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [taskProgressData, setTaskProgressData] = useState([]);
  const [taskStatusData, setTaskStatusData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersResponse, tasksResponse] = await Promise.all([
        userAPI.getAllUsers(),
        taskAPI.getAllTasks(),
      ]);

      const internsList = usersResponse.data.data.filter(u => u.role === 'intern');
      setInterns(internsList);
      setTasks(tasksResponse.data.data);

      // Completed = completed + reviewed (all finished tasks)
      const completedCount = tasksResponse.data.data.filter(t => 
        t.status === 'completed' || t.status === 'reviewed'
      ).length;
      const pendingCount = tasksResponse.data.data.filter(t => t.status === 'pending').length;
      const inProgressCount = tasksResponse.data.data.filter(t => t.status === 'in-progress').length;
      
      setStats({
        totalInterns: internsList.length,
        totalTasks: tasksResponse.data.data.length,
        completedTasks: completedCount,
        averageProgress: tasksResponse.data.data.length > 0 
          ? Math.round((completedCount / tasksResponse.data.data.length) * 100)
          : 0,
      });

      // Set dynamic task status data
      if (tasksResponse.data.data.length > 0) {
        const submittedCount = tasksResponse.data.data.filter(t => t.status === 'completed').length;
        const reviewedCount = tasksResponse.data.data.filter(t => t.status === 'reviewed').length;
        
        setTaskStatusData([
          { name: 'Pending', value: pendingCount, color: '#f59e0b' },
          { name: 'In Progress', value: inProgressCount, color: '#3b82f6' },
          { name: 'Not Reviewed', value: submittedCount, color: '#eab308' },
          { name: 'Reviewed', value: reviewedCount, color: '#10b981' },
        ].filter(item => item.value > 0));
      } else {
        setTaskStatusData([]);
      }

      // Generate weekly task progress data
      const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const progressData = weekDays.map(day => {
        const dayTasks = tasksResponse.data.data.filter(task => {
          const taskDay = new Date(task.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
          return taskDay === day;
        });
        return { name: day, tasks: dayTasks.length };
      });
      
      setTaskProgressData(progressData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intern.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || intern.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <HoverScale>
      <Card className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </h3>
            {change && (
              <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}% from last month
              </p>
            )}
          </div>
          <div className={`p-4 rounded-xl ${color}`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${color}`}></div>
      </Card>
    </HoverScale>
  );

  return (
    <DashboardLayout>
      <FadeIn>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}! Here's what's happening with your interns today.
          </p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <SkeletonStats />
        ) : (
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StaggerItem>
                <StatCard
                  icon={Users}
                  title="Total Interns"
                  value={stats.totalInterns}
                  change={null}
                  color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  icon={ClipboardList}
                  title="Total Tasks"
                  value={stats.totalTasks}
                  change={null}
                  color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  icon={CheckCircle}
                  title="Completed"
                  value={stats.completedTasks}
                  change={null}
                  color="bg-gradient-to-br from-green-500 to-green-600"
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  icon={TrendingUp}
                  title="Average Progress"
                  value={`${stats.averageProgress}%`}
                  change={null}
                  color="bg-gradient-to-br from-orange-500 to-orange-600"
                />
              </StaggerItem>
            </div>
          </StaggerContainer>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Task Progress Chart */}
          <FadeIn delay={0.2}>
            <Card title="Weekly Task Progress" className="h-full">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={taskProgressData}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#7c3aed" 
                    fillOpacity={1} 
                    fill="url(#colorTasks)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </FadeIn>

          {/* Task Status Distribution */}
          <FadeIn delay={0.3}>
            <Card title="Task Status Distribution" className="h-full">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </FadeIn>
        </div>

        {/* Interns Table */}
        <FadeIn delay={0.4}>
          <Card>
            {/* Table Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Intern Management
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage and monitor all interns
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/admin/interns')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Intern
                </Button>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <Input
                  type="text"
                  placeholder="Search by name or email..."
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
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
              />
            </div>

            {/* Table */}
            {loading ? (
              <SkeletonTable rows={5} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Intern
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tasks
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredInterns.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">
                            No interns found
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredInterns.map((intern) => {
                        // Calculate real task count and progress
                        const internTasks = tasks.filter(task => task.assignedTo === intern._id || task.assignedTo?._id === intern._id);
                        const taskCount = internTasks.length;
                        // Completed = completed + reviewed
                        const completedTaskCount = internTasks.filter(task => 
                          task.status === 'completed' || task.status === 'reviewed'
                        ).length;
                        const progressPercentage = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;

                        return (
                          <tr key={intern._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                      {intern.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {intern.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {intern.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-primary-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[3rem] text-right">
                                  {progressPercentage}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="success">
                                Active
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/admin/interns');
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/admin/interns');
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/admin/interns');
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </FadeIn>
      </FadeIn>
    </DashboardLayout>
  );
};

export default AdminDashboard;
