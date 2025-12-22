const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://LF_db_user:EojgXh2EKr1AtLkq@cluster0.ewobb1o.mongodb.net/?appName=Cluster0')
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    const Item = require('./models/Item');
    
    // Update items with undefined userId to have valid user IDs
    const result = await Item.updateMany(
      { userId: { $in: [undefined, null] } },
      { userId: '692179ce4452ac1fe53c8c7d' } // Assign to user Tejaswini M V
    );
    
    console.log(`Updated ${result.modifiedCount} items with valid userId`);
    
    // Verify the update
    const items = await Item.find().select('_id title category userId status').limit(5);
    console.log('Sample items after update:');
    items.forEach(item => {
      console.log(`- ID: ${item._id}, Title: ${item.title}, User: ${item.userId}, Status: ${item.status}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
