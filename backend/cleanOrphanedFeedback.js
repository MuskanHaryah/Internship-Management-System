const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Feedback = require('./models/Feedback');
const Task = require('./models/Task');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/internship-management';
console.log('Connecting to MongoDB...');
mongoose.connect(mongoUri);

const cleanOrphanedFeedback = async () => {
  try {
    console.log('🔍 Checking for orphaned feedback...');
    
    // Find all feedback
    const allFeedback = await Feedback.find();
    console.log(`📊 Total feedback: ${allFeedback.length}`);
    
    let orphanedCount = 0;
    const orphanedIds = [];
    
    // Check each feedback to see if its task exists
    for (const feedback of allFeedback) {
      if (!feedback.task) {
        orphanedIds.push(feedback._id);
        orphanedCount++;
      } else {
        const taskExists = await Task.findById(feedback.task);
        if (!taskExists) {
          orphanedIds.push(feedback._id);
          orphanedCount++;
          console.log(`  ⚠️  Found orphaned feedback: ${feedback._id} (references deleted task: ${feedback.task})`);
        }
      }
    }
    
    console.log(`🗑️  Orphaned feedback found: ${orphanedCount}`);
    
    if (orphanedIds.length > 0) {
      // Delete orphaned feedback
      const result = await Feedback.deleteMany({ _id: { $in: orphanedIds } });
      console.log(`✅ Deleted ${result.deletedCount} orphaned feedback entries`);
    } else {
      console.log('✅ No orphaned feedback found - database is clean!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanOrphanedFeedback();
