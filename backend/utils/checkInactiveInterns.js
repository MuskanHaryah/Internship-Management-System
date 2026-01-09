const User = require('../models/User');
const Task = require('../models/Task');

/**
 * Check and update inactive interns
 * If an intern hasn't completed any task in 3+ days, mark as inactive
 */
const checkInactiveInterns = async () => {
  try {
    // Get all active interns
    const activeInterns = await User.find({ 
      role: 'intern', 
      status: 'active' 
    });

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    for (const intern of activeInterns) {
      // Find the latest reviewed task for this intern
      const lastCompletedTask = await Task.findOne({
        assignedTo: intern._id,
        status: 'reviewed'
      }).sort({ updatedAt: -1 });

      // Check if intern has no completed tasks or last completion was 3+ days ago
      if (!lastCompletedTask || lastCompletedTask.updatedAt < threeDaysAgo) {
        // Update status to inactive
        intern.status = 'inactive';
        await intern.save();
        console.log(`✅ Intern ${intern.name} marked as inactive (no activity for 3+ days)`);
      }
    }
  } catch (error) {
    console.error('Error checking inactive interns:', error);
  }
};

module.exports = checkInactiveInterns;
