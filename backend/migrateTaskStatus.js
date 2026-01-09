const mongoose = require('mongoose');
const dotenv = require('dotenv');
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

// Migrate task statuses
const migrateStatuses = async () => {
  try {
    await connectDB();

    console.log('🔄 Starting task status migration...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Update 'completed' to 'reviewed'
    const completedResult = await Task.updateMany(
      { status: 'completed' },
      { $set: { status: 'reviewed' } }
    );

    console.log(`✅ Updated ${completedResult.modifiedCount} tasks from 'completed' to 'reviewed'`);

    // Update 'rejected' to 'not-reviewed'
    const rejectedResult = await Task.updateMany(
      { status: 'rejected' },
      { $set: { status: 'not-reviewed' } }
    );

    console.log(`✅ Updated ${rejectedResult.modifiedCount} tasks from 'rejected' to 'not-reviewed'`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Migration completed successfully!');
    
    // Show current status distribution
    const statusCounts = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    console.log('\n📊 Current Task Status Distribution:');
    statusCounts.forEach(item => {
      console.log(`   ${item._id}: ${item.count} task(s)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

// Run migration
migrateStatuses();
