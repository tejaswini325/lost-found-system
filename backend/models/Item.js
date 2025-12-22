import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    category: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },

    itemType: { type: String },
    location: { type: String },
    exactLocation: { type: String },
    date: { type: Date },
    contactInfo: { type: String },

    color: String,
    brand: String,
    image: String,

    keywords: {
      type: [String],
      default: [],
    },

    matchedItems: {
      type: [
        {
          itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
          },
          score: { type: Number, default: 0 },
          matchReason: { type: String, default: "" },
        },
      ],
      default: [],
    },

    matchScore: {
      type: Number,
      default: 0,
    },

    // ✅ CORRECT FIELD (used everywhere)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: String,
    userEmail: String,

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
    },

    // Return flow is admin-verified to prevent fake claims.
    returnRequestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    returnRequestedAt: {
      type: Date,
      default: null,
    },
    handoverLocation: {
      type: String,
      default: "",
    },
    handoverDate: {
      type: Date,
      default: null,
    },
    returnVerifiedByAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    returnVerifiedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "matched", "claimed", "return_requested", "returned", "archived"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
