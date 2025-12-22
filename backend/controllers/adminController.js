import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Item from "../models/Item.js";
import Activity from "../models/Activity.js";
import Notification from "../models/Notification.js";

/* ================= LOGIN ================= */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = admin.getSignedJwtToken();

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= DASHBOARD STATS ================= */
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const lostItems = await Item.countDocuments({ category: "lost" });
    const foundItems = await Item.countDocuments({ category: "found" });
    const pendingItems = await Item.countDocuments({ status: "pending" });
    const resolvedItems = await Item.countDocuments({ status: "resolved" });

    res.json({
      success: true,
      data: {
        totalUsers,
        lostItems,
        foundItems,
        pendingApproval: pendingItems,
        resolvedCases: resolvedItems
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Dashboard error" });
  }
};

/* ================= RECENT ACTIVITY ================= */
export const getRecentActivities = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: {
        activities
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Activity error" });
  }
};

/* ================= USERS ================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Users error" });
  }
};

/* ================= ITEMS ================= */
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        items
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Items error" });
  }
};

/* ================= UPDATE ITEM ================= */
export const updateItemStatus = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.status = req.body.status;
    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update error" });
  }
};

/* ================= VERIFY RETURN (ADMIN) ================= */
export const verifyReturn = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    // Security: only admin can finalize a return.
    // Users can only request return; this prevents fake "returned" status updates.
    if (item.status !== 'return_requested') {
      return res.status(400).json({
        success: false,
        message: "Item is not pending return verification"
      });
    }

    item.status = 'returned';
    item.returnVerifiedByAdminId = req.admin._id;
    item.returnVerifiedAt = new Date();
    item.handoverDate = new Date();
    await item.save();

    // Trust score is updated only after admin verification.
    await User.findByIdAndUpdate(item.userId, { $inc: { trustScore: 10 } });
    if (item.claimedBy) {
      await User.findByIdAndUpdate(item.claimedBy, { $inc: { trustScore: 10 } });
    }

    // Notifications are intentionally vague and do NOT include full item description.
    // This reduces information leakage and discourages fake claims.
    await Notification.create({
      userId: item.userId,
      type: 'status',
      title: 'Return Verified',
      message: 'An admin has verified the return and marked the item as returned.',
      data: { itemId: item._id },
      priority: 'medium'
    });

    if (item.claimedBy) {
      await Notification.create({
        userId: item.claimedBy,
        type: 'status',
        title: 'Return Verified',
        message: 'An admin has verified the return and marked the item as returned.',
        data: { itemId: item._id },
        priority: 'medium'
      });
    }

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: "Verify return error" });
  }
};
