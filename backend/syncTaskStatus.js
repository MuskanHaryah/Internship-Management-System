require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');
const Progress = require('./models/Progress');

const syncTaskStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all progress records
    const progressRecords = await Progress.find();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 Syncing task statuses based on progress...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    for (const progress of progressRecords) {
      const taskId = progress.task;
      const task = await Task.findById(taskId);

      if (!task) {
        console.log(`⚠️  Task ${taskId} not found, skipping...`);
        continue;
      }

      let newStatus = task.status;

      // Update task status based on progress
      if (progress.status === 'completed' || progress.percentage === 100) {
        newStatus = 'reviewed';
      } else if (progress.status === 'in-progress' || (progress.percentage > 0 && progress.percentage < 100)) {
        newStatus = 'in-progress';
      }

      if (newStatus !== task.status) {
        await Task.findByIdAndUpdate(taskId, { status: newStatus });
        console.log(`✅ Updated task "${task.title}"`);
        console.log(`   Old status: ${task.status} → New status: ${newStatus}`);
        console.log(`   Based on progress: ${progress.percentage}% (${progress.status})\n`);
      } else {
        console.log(`ℹ️  Task "${task.title}" already has correct status: ${task.status}\n`);
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Task status sync completed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

syncTaskStatus();
