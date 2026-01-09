import { useState, useEffect } from 'react';
import { Users, Search, Plus, Eye, Edit, Trash2, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { userAPI } from '../services/api';
import { DashboardLayout, Card, Badge, Button, Input, Modal, Dropdown } from '../components';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { SkeletonTable } from '../components/Skeleton';

const ManageInterns = () => {
  const [loading, setLoading] = useState(true);
  const [interns, setInterns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register: registerAdd, handleSubmit: handleSubmitAdd, formState: { errors: errorsAdd }, reset: resetAdd } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEdit, setValue } = useForm();

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      const internsList = response.data.data.filter(u => u.role === 'intern');
      setInterns(internsList);
    } catch (error) {
      toast.error('Failed to load interns');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIntern = async (data) => {
    setSubmitting(true);
    try {
      await userAPI.createUser({ ...data, role: 'intern' });
      toast.success('Intern added successfully!');
      setShowAddModal(false);
      resetAdd();
      fetchInterns();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add intern');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditIntern = async (data) => {
    setSubmitting(true);
    try {
      await userAPI.updateUser(selectedIntern._id, data);
      toast.success('Intern updated successfully!');
      setShowEditModal(false);
      resetEdit();
      fetchInterns();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update intern');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteIntern = async () => {
    setSubmitting(true);
    try {
      await userAPI.deleteUser(selectedIntern._id);
      toast.success('Intern deleted successfully!');
      setShowDeleteModal(false);
      setSelectedIntern(null);
      fetchInterns();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete intern');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (intern) => {
    setSelectedIntern(intern);
    setValue('name', intern.name);
    setValue('email', intern.email);
    setShowEditModal(true);
  };

  const openViewModal = (intern) => {
    setSelectedIntern(intern);
    setShowViewModal(true);
  };

  const openDeleteModal = (intern) => {
    setSelectedIntern(intern);
    setShowDeleteModal(true);
  };

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intern.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || intern.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <FadeIn>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Interns
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add, edit, and manage all intern accounts
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Intern
          </Button>
        </div>

        {/* Search & Filter */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </Card>

        {/* Interns Table */}
        <Card>
          {loading ? (
            <SkeletonTable rows={8} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Intern
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Joined
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
                  {filteredInterns.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                          {searchTerm ? 'No interns found matching your search' : 'No interns yet'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredInterns.map((intern) => (
                      <tr key={intern._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">
                                  {intern.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {intern.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {intern._id.slice(-6)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Mail className="h-4 w-4 mr-2" />
                            {intern.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(intern.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openViewModal(intern)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditModal(intern)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openDeleteModal(intern)}
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

        {/* Add Intern Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            resetAdd();
          }}
          title="Add New Intern"
          size="md"
        >
          <form onSubmit={handleSubmitAdd(handleAddIntern)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter intern's full name"
              error={errorsAdd.name?.message}
              {...registerAdd('name', {
                required: 'Name is required',
                minLength: { value: 3, message: 'Name must be at least 3 characters' }
              })}
            />
            
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter intern's email"
              error={errorsAdd.email?.message}
              {...registerAdd('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              error={errorsAdd.password?.message}
              helperText="Minimum 6 characters"
              {...registerAdd('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
            />

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
                Add Intern
              </Button>
            </div>
          </form>
        </Modal>

        {/* Edit Intern Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            resetEdit();
            setSelectedIntern(null);
          }}
          title="Edit Intern"
          size="md"
        >
          <form onSubmit={handleSubmitEdit(handleEditIntern)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter intern's full name"
              error={errorsEdit.name?.message}
              {...registerEdit('name', {
                required: 'Name is required',
                minLength: { value: 3, message: 'Name must be at least 3 characters' }
              })}
            />
            
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter intern's email"
              error={errorsEdit.email?.message}
              {...registerEdit('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowEditModal(false);
                  resetEdit();
                  setSelectedIntern(null);
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

        {/* View Intern Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedIntern(null);
          }}
          title="Intern Details"
          size="lg"
        >
          {selectedIntern && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">
                    {selectedIntern.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedIntern.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">{selectedIntern.email}</p>
                  <Badge variant="success" className="mt-2">Active</Badge>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">User ID</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedIntern._id}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Role</p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">
                    {selectedIntern.role}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Joined Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedIntern.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedIntern.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedIntern);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Intern
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => {
                    setShowViewModal(false);
                    openDeleteModal(selectedIntern);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Intern
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
            setSelectedIntern(null);
          }}
          title="Delete Intern"
          size="sm"
        >
          {selectedIntern && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold">{selectedIntern.name}</span>?
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone. All associated data will be permanently removed.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedIntern(null);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  className="flex-1"
                  onClick={handleDeleteIntern}
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

export default ManageInterns;
