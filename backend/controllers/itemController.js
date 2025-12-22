import Item from "../models/Item.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

/* =========================
   Helper: Extract keywords
========================= */
const extractKeywords = (text = "") => {
  const commonWords = ['the','and','or','but','in','on','at','to','for','with','by'];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word));
  return [...new Set(words)].slice(0, 10);
};

/* =========================
   Helper: Match score
========================= */
const calculateMatchScore = (item1, item2) => {
  let score = 0;

  // Opposite category (lost vs found)
  if (item1.category !== item2.category) score += 30;

  if (item1.itemType === item2.itemType) score += 20;
  if (item1.location === item2.location) score += 15;

  const dateDiff = Math.abs(new Date(item1.date) - new Date(item2.date));
  const daysDiff = dateDiff / (1000 * 60 * 60 * 24);
  if (daysDiff <= 7) score += 10 - Math.min(daysDiff, 10);

  const commonKeywords = item1.keywords.filter(k => item2.keywords.includes(k));
  score += commonKeywords.length * 5;

  if (item1.color && item2.color &&
      item1.color.toLowerCase() === item2.color.toLowerCase()) score += 10;

  if (item1.brand && item2.brand &&
      item1.brand.toLowerCase() === item2.brand.toLowerCase()) score += 10;

  return Math.min(score, 100);
};

/* =========================
   REPORT ITEM
========================= */
// Report new item with smart matching
export const reportItem = async (req, res) => {
  try {
    console.log("=== REPORT ITEM START ===");
    console.log("Request body:", req.body);
    console.log("User ID from token:", req.userId);

    const {
      title, description, category, itemType,
      location, exactLocation, date,
      contactInfo, color, brand
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const keywords = extractKeywords(`${title} ${description}`);

    let imageUrl = "";
    if (req.file) imageUrl = `/uploads/${req.file.filename}`;

    const newItem = new Item({
      title,
      description,
      category,
      itemType,
      location,
      exactLocation,
      date,
      contactInfo,
      color: color || "",
      brand: brand || "",
      image: imageUrl,
      keywords,
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      status: "pending"
    });

    await newItem.save();
    console.log("Item saved:", newItem._id);

    const oppositeCategory = category === "lost" ? "found" : "lost";
    const potentialMatches = await Item.find({
      category: oppositeCategory,
      status: "pending",
      itemType,
      userId: { $ne: user._id }
    });

    console.log("Potential matches:", potentialMatches.length);

    let matchesFound = [];

    for (const match of potentialMatches) {
      const score = calculateMatchScore(newItem, match);
      console.log(`Match score with ${match.title}:`, score);

      if (score >= 60) {
        newItem.matchedItems.push({
          itemId: match._id,
          score,
          matchReason: `Similarity based on ${itemType} at ${location}`
        });

        match.matchedItems.push({
          itemId: newItem._id,
          score,
          matchReason: `Similarity based on ${itemType} at ${location}`
        });

        match.matchScore = Math.max(match.matchScore || 0, score);
        match.status = score >= 80 ? "matched" : "pending";
        await match.save();

        await Notification.create({
          userId: match.userId,
          type: "match",
          title: "Potential Match Found!",
          message: `Your ${match.category} item "${match.title}" might match a ${newItem.category} report`,
          data: { matchedItemId: newItem._id, matchScore: score },
          priority: score >= 80 ? "high" : "medium"
        });

        matchesFound.push({ itemId: match._id, title: match.title, score });
      }
    }

    newItem.matchScore = matchesFound.length
      ? Math.max(...matchesFound.map(m => m.score))
      : 0;

    if (newItem.matchScore >= 80) {
      newItem.status = "matched";
      await Notification.create({
        userId: user._id,
        type: "match",
        title: "Match Found Immediately!",
        message: `We found ${matchesFound.length} potential match(es) for your item`,
        data: { matchScore: newItem.matchScore },
        priority: "high"
      });
    }

    await newItem.save();

    console.log("=== REPORT ITEM COMPLETE ===");

    res.status(201).json({
      success: true,
      message: "Item reported successfully",
      item: newItem,
      matchesFound: matchesFound.length,
      matchScore: newItem.matchScore
    });

  } catch (error) {
    console.error("Error reporting item:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   OTHER CONTROLLERS
========================= */
export const getUserItems = async (req, res) => {
  const items = await Item.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json({ success: true, items });
};

export const getAllItems = async (req, res) => {
  const items = await Item.find({}).limit(50);
  res.json({ success: true, items });
};

export const getItemById = async (req, res) => {
  const item = await Item.findById(req.params.id)
    .populate("matchedItems.itemId", "title category location date image");
  if (!item) return res.status(404).json({ success: false, message: "Item not found" });
  res.json({ success: true, item });
};

export const claimItem = async (req, res) => {
  const item = await Item.findById(req.body.itemId);
  item.claimedBy = req.userId;
  item.status = "claimed";
  await item.save();
  res.json({ success: true, item });
};

export const markAsReturned = async (req, res) => {
  const item = await Item.findById(req.body.itemId);
  item.status = "returned";
  await item.save();
  res.json({ success: true, item });
};

export const getStats = async (req, res) => {
  const totalItems = await Item.countDocuments({ userId: req.userId });
  res.json({ success: true, totalItems });
};

export const debugAllItems = async (req, res) => {
  const items = await Item.find({});
  res.json({ success: true, count: items.length, items });
};

export const testUserItems = async (req, res) => {
  const items = await Item.find({ userId: req.userId });
  res.json({ success: true, items });
};
