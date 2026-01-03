const Feedback = require('../models/Feedback');

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

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
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

    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('intern', 'name email')
      .populate('task', 'title')
      .populate('givenBy', 'name email');

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
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

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

    // Calculate average rating
    const avgRating = feedback.length > 0
      ? feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length
      : 0;

    res.status(200).json({
      success: true,
      count: feedback.length,
      averageRating: avgRating.toFixed(2),
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
