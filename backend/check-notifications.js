const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://LF_db_user:EojgXh2EKr1AtLkq@cluster0.ewobb1o.mongodb.net/?appName=Cluster0')
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    const Notification = require('./models/Notification');
    const notifications = await Notification.find().sort({createdAt: -1}).limit(10);
    console.log(`Found ${notifications.length} notifications:`);
    notifications.forEach(n => {
      console.log(`- User: ${n.userId}, Title: ${n.title}, Message: ${n.message}, isRead: ${n.isRead}, Created: ${n.createdAt}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
