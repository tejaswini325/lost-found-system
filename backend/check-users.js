const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://LF_db_user:EojgXh2EKr1AtLkq@cluster0.ewobb1o.mongodb.net/?appName=Cluster0')
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    const User = require('./models/User');
    const users = await User.find().select('_id name email').limit(10);
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ID: ${user._id}, Name: ${user.name}, Email: ${user.email}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
