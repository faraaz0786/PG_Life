// server/src/routes/authFirebase.js
const express = require("express");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/* ---------- Firebase Admin Setup ---------- */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

/* ---------- POST /api/auth/firebase ---------- */
/**
 * Verifies Firebase ID token (Google or Phone),
 * creates/updates user in DB, and returns your JWT.
 */
router.post("/", async (req, res) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Missing idToken" });
    }

    // Verify token with Firebase
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Extract info
    const { uid, email, phone_number, name, picture } = decoded;

    // Find or create user
    let user = await User.findOne({
      $or: [{ firebaseUid: uid }, { email }, { phone: phone_number }],
    });

    if (!user) {
      user = new User({
        name: name || "User",
        email: email || undefined,
        phone: phone_number || undefined,
        firebaseUid: uid,
        authProvider: phone_number ? "phone" : "google",
        role: role || "seeker",
      });
      await user.save();
    }

    // Issue your own JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Firebase login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("Firebase auth error:", err);
    res.status(500).json({ message: "Authentication failed" });
  }
});

module.exports = router;
