const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://LF_db_user:EojgXh2EKr1AtLkq@cluster0.ewobb1o.mongodb.net/?appName=Cluster0')
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    
    // Check if new items are being created
    const Item = require('./models/Item');
    const recentItems = await Item.find().sort({createdAt: -1}).limit(5);
    console.log('Most recent items:');
    recentItems.forEach(item => {
      console.log(`- ${item.title || 'No title'} (${item.category}) by User: ${item.userId}, Created: ${item.createdAt}`);
    });
    
    // Check if any items have itemType for matching
    const itemsWithItemType = await Item.find({itemType: {$ne: ''}}).limit(5);
    console.log(`\nItems with itemType for matching: ${itemsWithItemType.length}`);
    itemsWithItemType.forEach(item => {
      console.log(`- ${item.title} - Type: ${item.itemType}, Category: ${item.category}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
