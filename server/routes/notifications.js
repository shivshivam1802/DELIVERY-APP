const router = require("express").Router();
const webpush = require("web-push");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || "BHw7xd5nz-wt45yKJRQBK0FUqo_MK0g7C8ymJ6cSx5UkGV8mrq7xIOXdXPeFZD7-o1m_e6zoPZK-bJsjIKC4AnU";
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || "REW_k0EQIXM8tLbNdIa4LggEo-_cgqMqwVHc-OZeg1g";

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails("mailto:admin@promart.com", VAPID_PUBLIC, VAPID_PRIVATE);
}

router.post("/subscribe", auth, async (req, res) => {
  try {
    const subscription = req.body;
    await User.findByIdAndUpdate(req.user._id, { pushSubscription: subscription });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/vapid-public", (req, res) => {
  res.json({ publicKey: VAPID_PUBLIC });
});

module.exports = { router, sendPushNotification };

async function sendPushNotification(userId, payload) {
  try {
    const user = await User.findById(userId).select("pushSubscription");
    if (!user?.pushSubscription) return;
    await webpush.sendNotification(user.pushSubscription, JSON.stringify(payload));
  } catch (err) {
    console.error("Push notification error:", err.message);
  }
}
