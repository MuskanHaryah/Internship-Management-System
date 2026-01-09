const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Task = require('./models/Task');

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/internship-management');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Check user's tasks
const checkUserTasks = async () => {
  try {
    await connectDB();

    // Get email from command line argument
    const email = process.argv[2] || 'usama@gmail.com';

    // Find user
    const user = await User.findOne({ email }).populate('assignedTasks');

    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      process.exit(1);
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 User Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('User ID:', user._id.toString());
    console.log('Status:', user.status);
    console.log('');

    // Find all tasks assigned to this user
    const tasks = await Task.find({ assignedTo: user._id })
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📋 Tasks Assigned to ${user.name}:`, tasks.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    if (tasks.length === 0) {
      console.log('❌ No tasks found assigned to this user');
      console.log('');
      console.log('💡 Tip: Make sure tasks are assigned to this user in the admin panel');
    } else {
      tasks.forEach((task, index) => {
        console.log(`Task ${index + 1}:`);
        console.log('  ID:', task._id.toString());
        console.log('  Title:', task.title);
        console.log('  Status:', task.status);
        console.log('  Priority:', task.priority);
        console.log('  Deadline:', task.deadline);
        console.log('  Assigned By:', task.assignedBy ? task.assignedBy.name : 'N/A');
        console.log('  Assigned To ID:', task.assignedTo?.toString());
        console.log('  Created:', task.createdAt);
        console.log('');
      });
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    // Also check the user's assignedTasks array
    console.log('📌 User\'s assignedTasks array:', user.assignedTasks.length, 'tasks');
    if (user.assignedTasks.length > 0) {
      console.log('Task IDs in assignedTasks:');
      user.assignedTasks.forEach((task, index) => {
        console.log(`  ${index + 1}. ${task._id || task}`);
      });
    }
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Run the check
checkUserTasks();
