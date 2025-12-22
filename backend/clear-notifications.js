const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://LF_db_user:EojgXh2EKr1AtLkq@cluster0.ewobb1o.mongodb.net/?appName=Cluster0')
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    const Notification = require('./models/Notification');
    
    // Clear old notifications with undefined userId
    const result = await Notification.deleteMany({ userId: { $in: [undefined, null] } });
    console.log(`Deleted ${result.deletedCount} old notifications with undefined userId`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
