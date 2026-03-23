const router = require("express").Router();
const { auth } = require("../middleware/auth");

router.post("/create-order", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const orderId = `pay_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    res.json({
      orderId,
      amount: amount * 100,
      currency: "INR",
      message: "Mock payment order created. Use orderId for verification.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/verify", auth, async (req, res) => {
  try {
    const { orderId } = req.body;
    res.json({
      success: true,
      paymentId: orderId,
      message: "Mock payment verified successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
