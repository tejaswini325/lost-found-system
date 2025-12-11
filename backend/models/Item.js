const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['lost', 'found'], required: true },
  itemType: { type: String, required: true },
  location: { type: String, required: true },
  exactLocation: { type: String, default: "" },
  date: { type: Date, required: true },
  contactInfo: { type: String, required: true },
  color: { type: String, default: "" },
  brand: { type: String, default: "" },
  image: { type: String, default: "" },

  // CRITICAL: This must be 'userId' (matching your controller)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Also add these for completeness
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },

  status: {
    type: String,
    enum: ['pending', 'matched', 'claimed', 'returned', 'archived'],
    default: 'pending'
  },
  keywords: [String],
  matchedItems: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    score: Number,
    matchReason: String
  }],
  matchScore: { type: Number, default: 0 },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claimedAt: Date,
  handoverLocation: String,
  handoverDate: Date
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);