const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const billingController = require("../controllers/billingController");

const router = express.Router();

router.post("/create-checkout-session", authMiddleware, billingController.createCheckoutSession);
router.post("/create-embedded-session", authMiddleware, billingController.createEmbeddedSession);
router.post("/finalize-session", authMiddleware, billingController.finalizeCheckoutSession);
router.get("/subscription-status", authMiddleware, billingController.getSubscriptionStatus);

module.exports = router;
