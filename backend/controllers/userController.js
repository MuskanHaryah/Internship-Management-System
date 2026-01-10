const User = require('../models/User');
const Task = require('../models/Task');
const checkInactiveInterns = require('../utils/checkInactiveInterns');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    // Auto-check and update inactive interns
    await checkInactiveInterns();

    const users = await User.find().select('-password').populate('assignedTasks');

    // Add task statistics for interns
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const userObj = user.toObject();
      
      if (user.role === 'intern') {
        // Count total assigned tasks
        const totalTasks = await Task.countDocuments({ assignedTo: user._id });
        
        // Count completed tasks (reviewed status)
        const completedTasks = await Task.countDocuments({ 
          assignedTo: user._id,
          status: 'reviewed'
        });
        
        userObj.taskStats = {
          assigned: totalTasks,
          completed: completedTasks
        };
      }
      
      return userObj;
    }));

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      data: usersWithStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all interns
// @route   GET /api/users/interns
// @access  Private/Admin
exports.getInterns = async (req, res) => {
  try {
    // Auto-check and update inactive interns
    await checkInactiveInterns();

    const interns = await User.find({ role: 'intern' })
      .select('-password')
      .populate('assignedTasks');

    // Add task statistics
    const internsWithStats = await Promise.all(interns.map(async (intern) => {
      const internObj = intern.toObject();
      
      // Count total assigned tasks
      const totalTasks = await Task.countDocuments({ assignedTo: intern._id });
      
      // Count completed tasks (reviewed status)
      const completedTasks = await Task.countDocuments({ 
        assignedTo: intern._id,
        status: 'reviewed'
      });
      
      internObj.taskStats = {
        assigned: totalTasks,
        completed: completedTasks
      };
      
      return internObj;
    }));

    res.status(200).json({
      success: true,
      count: internsWithStats.length,
      data: internsWithStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all admins
// @route   GET /api/users/admins
// @access  Private/Admin
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('assignedTasks');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'intern'
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    // Don't allow password update here
    if (req.body.password) {
      delete req.body.password;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
