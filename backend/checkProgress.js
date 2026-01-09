require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Progress = require('./models/Progress');
const Task = require('./models/Task');

const checkProgress = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const progress = await Progress.find()
      .populate('intern', 'name email')
      .populate('task', 'title status');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Total Progress Records: ${progress.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    progress.forEach((p, index) => {
      console.log(`Progress ${index + 1}:`);
      console.log(`  Intern: ${p.intern?.name || 'Unknown'} (${p.intern?.email || 'N/A'})`);
      console.log(`  Task: ${p.task?.title || 'Unknown'}`);
      console.log(`  Task Status: ${p.task?.status || 'N/A'}`);
      console.log(`  Progress Status: ${p.status}`);
      console.log(`  Percentage: ${p.percentage}%`);
      console.log(`  Last Note: ${p.notes || 'None'}`);
      console.log(`  Updates Count: ${p.updates?.length || 0}`);
      console.log(`  Last Updated: ${p.updatedAt}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkProgress();
