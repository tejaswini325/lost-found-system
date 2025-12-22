import Notification from "../models/Notification.js";

// Get user notifications
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(50);

        // Count unread
        const unreadCount = await Notification.countDocuments({
            userId: req.userId,
            $or: [
                { isRead: false },
                { read: false }
            ]
        });

        res.json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Mark as read
export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;

        await Notification.findByIdAndUpdate(notificationId, {
            isRead: true,
            read: true
        });

        const unreadCount = await Notification.countDocuments({
            userId: req.userId,
            $or: [
                { isRead: false },
                { read: false }
            ]
        });

        res.json({
            success: true,
            unreadCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                userId: req.userId,
                $or: [
                    { isRead: false },
                    { read: false }
                ]
            },
            { isRead: true, read: true }
        );

        res.json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Delete notification
export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        await Notification.findByIdAndDelete(notificationId);

        res.json({
            success: true,
            message: "Notification deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};