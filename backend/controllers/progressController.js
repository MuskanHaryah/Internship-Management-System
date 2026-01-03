const Progress = require('../models/Progress');

// @desc    Get all progress
// @route   GET /api/progress
// @access  Private
exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.find()
      .populate('intern', 'name email')
      .populate('task', 'title description')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create progress
// @route   POST /api/progress
// @access  Private
exports.createProgress = async (req, res) => {
  try {
    const { task, percentage, status, notes } = req.body;

    // Set intern as current user if not admin
    const internId = req.user.role === 'admin' ? req.body.intern : req.user._id;

    const progress = await Progress.create({
      intern: internId,
      task,
      percentage,
      status,
      notes,
      updates: [{
        message: notes || 'Progress created',
        percentage: percentage || 0
      }]
    });

    const populatedProgress = await Progress.findById(progress._id)
      .populate('intern', 'name email')
      .populate('task', 'title description');

    res.status(201).json({
      success: true,
      data: populatedProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update progress
// @route   PUT /api/progress/:id
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    let progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      });
    }

    const { percentage, status, notes } = req.body;

    // Add update to history
    if (percentage !== undefined || notes) {
      progress.updates.push({
        message: notes || `Progress updated to ${percentage}%`,
        percentage: percentage || progress.percentage
      });
    }

    progress = await Progress.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updates: progress.updates
      },
      {
        new: true,
        runValidators: true
      }
    )
      .populate('intern', 'name email')
      .populate('task', 'title description');

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get progress by task
// @route   GET /api/progress/task/:taskId
// @access  Private
exports.getTaskProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ task: req.params.taskId })
      .populate('intern', 'name email')
      .populate('task', 'title description')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get progress by intern
// @route   GET /api/progress/intern/:internId
// @access  Private
exports.getInternProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ intern: req.params.internId })
      .populate('task', 'title description deadline')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
