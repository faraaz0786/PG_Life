import admin from "firebase-admin";

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env;

// Render/Vercel: keep \n newlines
const privateKey = (FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export const verifyFirebaseIdToken = (idToken) =>
  admin.auth().verifyIdToken(idToken);
