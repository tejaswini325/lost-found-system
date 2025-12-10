const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['lost', 'found']
  },
  itemType: {
    type: String,
    required: true,
    enum: [
      'Mobile Phone', 'Laptop', 'Tablet', 'Headphones', 'Charger', 'Power Bank',
      'Wallet', 'Purse', 'ID Card', 'Student ID', 'Driver License', 'Passport',
      'Keys', 'House Keys', 'Car Keys', 'Bike Keys',
      'Books', 'Notebooks', 'Textbooks', 'Study Material',
      'Water Bottle', 'Lunch Box', 'Tiffin Box',
      'Jacket', 'Sweater', 'Cap', 'Scarf', 'Gloves',
      'Bag', 'Backpack', 'Handbag', 'Laptop Bag',
      'Watch', 'Bracelet', 'Necklace', 'Earrings',
      'Glasses', 'Sunglasses', 'Spectacles',
      'Sports Equipment', 'Cricket Bat', 'Football', 'Badminton Racket',
      'Calculator', 'Pen Drive', 'Hard Disk',
      'Umbrella', 'Raincoat',
      'Other Electronics',
      'Other Accessories',
      'Other Personal Items'
    ]
  },
  location: { type: String, required: true },
  exactLocation: { type: String, default: "" },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'matched', 'claimed', 'returned', 'closed'],
    default: 'pending'
  },
  image: { type: String, default: "" },
  contactInfo: { type: String, required: true },
  color: { type: String, default: "" },
  brand: { type: String, default: "" },

  // Smart matching fields
  keywords: [{ type: String }],
  matchScore: { type: Number, default: 0 },
  matchedItems: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    score: { type: Number },
    matchReason: { type: String }
  }],

  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },

  // For found items - claim details
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claimedAt: { type: Date },
  handoverLocation: { type: String },
  handoverDate: { type: Date }
}, { timestamps: true });

// Add text index for search
itemSchema.index({ title: 'text', description: 'text', keywords: 'text' });

module.exports = mongoose.model('Item', itemSchema);