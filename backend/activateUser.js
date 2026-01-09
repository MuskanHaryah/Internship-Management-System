const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/internship-management';
console.log('Connecting to MongoDB...');
mongoose.connect(mongoUri);

const activateUser = async () => {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.log('❌ Please provide an email address');
      console.log('Usage: node activateUser.js <email>');
      process.exit(1);
    }

    console.log(`🔍 Looking for user: ${email}`);
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ User not found with email: ${email}`);
      process.exit(1);
    }
    
    console.log(`📋 Current status: ${user.status}`);
    
    if (user.status === 'active') {
      console.log('✅ User is already active!');
      process.exit(0);
    }
    
    // Update status to active
    user.status = 'active';
    await user.save();
    
    console.log('✅ User activated successfully!');
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🎭 Role: ${user.role}`);
    console.log(`📊 Status: ${user.status}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

activateUser();
