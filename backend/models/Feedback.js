const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  intern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  givenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    required: [true, 'Feedback comment is required']
  },
  category: {
    type: String,
    enum: ['quality', 'timeliness', 'communication', 'overall'],
    default: 'overall'
  }
}, {
  timestamps: true
});

// Index for faster queries
feedbackSchema.index({ intern: 1 });
feedbackSchema.index({ task: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
