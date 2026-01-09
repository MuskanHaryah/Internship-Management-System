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

// Migrate 'submitted' status to 'completed'
const migrateSubmittedToCompleted = async () => {
  try {
    await connectDB();

    console.log('🔄 Starting status migration: submitted → completed');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Update 'submitted' to 'completed'
    const result = await Task.updateMany(
      { status: 'submitted' },
      { $set: { status: 'completed' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} tasks from 'submitted' to 'completed'`);

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
migrateSubmittedToCompleted();
