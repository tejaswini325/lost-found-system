const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/lost-found-system')
  .then(async () => {
    console.log('Connected to DB');
    const Notification = require('./models/Notification');
    const notifications = await Notification.find().sort({createdAt: -1}).limit(5);
    console.log('Recent notifications:', notifications.length);
    notifications.forEach(n => {
      console.log(`- User: ${n.userId}, Title: ${n.title}, Message: ${n.message}, isRead: ${n.isRead}, Created: ${n.createdAt}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
