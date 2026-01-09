const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Task = require('./models/Task');
const Progress = require('./models/Progress');
const Feedback = require('./models/Feedback');

const clearData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/internship-management');
    console.log('Connected to MongoDB');
    
    // Delete all tasks
    const tasksDeleted = await Task.deleteMany({});
    console.log(' Deleted', tasksDeleted.deletedCount, 'tasks');
    
    // Delete all progress
    const progressDeleted = await Progress.deleteMany({});
    console.log(' Deleted', progressDeleted.deletedCount, 'progress records');
    
    // Delete all feedback
    const feedbackDeleted = await Feedback.deleteMany({});
    console.log(' Deleted', feedbackDeleted.deletedCount, 'feedback records');
    
    console.log(' All fake data cleared!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

clearData();
