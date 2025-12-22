import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['match', 'message', 'claim', 'status', 'system']
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        default: null
    },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    // We store isRead to match the required notifications schema.
    // We also keep the legacy `read` field because older records and parts of the UI
    // may still rely on it. Controllers should query/update both to stay consistent.
    isRead: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);