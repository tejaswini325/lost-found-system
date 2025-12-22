const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://LF_db_user:EojgXh2EKr1AtLkq@cluster0.ewobb1o.mongodb.net/?appName=Cluster0')
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    const Item = require('./models/Item');
    const items = await Item.find().select('_id title category userId userName status').limit(10);
    console.log(`Found ${items.length} items:`);
    items.forEach(item => {
      console.log(`- ID: ${item._id}, Title: ${item.title}, Category: ${item.category}, User: ${item.userId}, Status: ${item.status}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
