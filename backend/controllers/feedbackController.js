const Feedback = require('../models/Feedback');
const Task = require('../models/Task');
const { createNotification } = require('./notificationController');

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('intern', 'name email')
      .populate('task', 'title')
      .populate('givenBy', 'name email')
      .sort({ createdAt: -1 });

    // Filter out feedback where task was deleted (task is null after populate)
    const validFeedback = feedback.filter(f => f.task !== null);

    // Clean up orphaned feedback in the background (don't await)
    const orphanedIds = feedback.filter(f => f.task === null).map(f => f._id);
    if (orphanedIds.length > 0) {
      Feedback.deleteMany({ _id: { $in: orphanedIds } })
        .then(() => console.log(`Cleaned up ${orphanedIds.length} orphaned feedback entries`))
        .catch(err => console.error('Error cleaning orphaned feedback:', err));
    }

    res.status(200).json({
      success: true,
      count: validFeedback.length,
      data: validFeedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Private
exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('intern', 'name email')
      .populate('task', 'title description')
      .populate('givenBy', 'name email');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Private/Admin
exports.createFeedback = async (req, res) => {
  try {
    const { task, intern, rating, comment, category } = req.body;

    req.body.givenBy = req.user._id;

    const feedback = await Feedback.create(req.body);

    // Update task status to 'reviewed' when feedback is created
    await Task.findByIdAndUpdate(task, { status: 'reviewed' });

    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('intern', 'name email')
      .populate('task', 'title')
      .populate('givenBy', 'name email');

    // Create notification for intern
    await createNotification(
      intern,
      'feedback_received',
      'New Feedback Received',
      `You received ${rating} star${rating > 1 ? 's' : ''} for task: ${populatedFeedback.task?.title || 'Unknown Task'}`,
      `/intern/feedback`,
      req.user._id,
      { feedbackId: feedback._id, rating, taskId: task }
    );

    res.status(201).json({
      success: true,
      data: populatedFeedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private/Admin
exports.updateFeedback = async (req, res) => {
  try {
    let feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('intern', 'name email')
      .populate('task', 'title')
      .populate('givenBy', 'name email');

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Store task ID before deleting feedback
    const taskId = feedback.task;

    // Delete the feedback
    await Feedback.findByIdAndDelete(req.params.id);

    // Set task status back to 'completed' when feedback is deleted
    await Task.findByIdAndUpdate(taskId, { status: 'completed' });

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get intern feedback
// @route   GET /api/feedback/intern/:internId
// @access  Private
exports.getInternFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ intern: req.params.internId })
      .populate('task', 'title description')
      .populate('givenBy', 'name email')
      .sort({ createdAt: -1 });

    // Filter out feedback where task was deleted
    const validFeedback = feedback.filter(f => f.task !== null);

    // Clean up orphaned feedback in the background
    const orphanedIds = feedback.filter(f => f.task === null).map(f => f._id);
    if (orphanedIds.length > 0) {
      Feedback.deleteMany({ _id: { $in: orphanedIds } })
        .then(() => console.log(`Cleaned up ${orphanedIds.length} orphaned feedback entries for intern`))
        .catch(err => console.error('Error cleaning orphaned feedback:', err));
    }

    // Calculate average rating
    const avgRating = validFeedback.length > 0
      ? validFeedback.reduce((acc, curr) => acc + curr.rating, 0) / validFeedback.length
      : 0;

    res.status(200).json({
      success: true,
      count: validFeedback.length,
      averageRating: avgRating.toFixed(2),
      data: validFeedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
