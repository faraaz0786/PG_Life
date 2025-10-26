// client/src/services/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

// ✅ Using your provided config (safe on client)
const firebaseConfig = {
  apiKey: "AIzaSyBx5K3XZ9ySTwMfpcAEQzMyycMkRnMDOyg",
  authDomain: "pg-life-f4d17.firebaseapp.com",
  projectId: "pg-life-f4d17",
  storageBucket: "pg-life-f4d17.firebasestorage.app",
  messagingSenderId: "162099516153",
  appId: "1:162099516153:web:cf094cf8fb95ec639e8828",
  measurementId: "G-RPFSWD5VNZ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.useDeviceLanguage();

export const googleProvider = new GoogleAuthProvider();

/** Ensure an invisible reCAPTCHA exists (required for phone auth) */
export function ensureRecaptcha(containerId = "recaptcha-container") {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => {}, // auto-resolves on submit
    });
  }
  return window.recaptchaVerifier;
}

/** Start Google popup, return Firebase ID token to send to your backend */
export async function googlePopup() {
  const { user } = await signInWithPopup(auth, googleProvider);
  const idToken = await user.getIdToken();
  return { idToken, user };
}

/** Send OTP to phone (E.164 format e.g. +91XXXXXXXXXX), returns confirmation */
export async function sendOtpToPhone(e164Phone) {
  const verifier = ensureRecaptcha();
  const confirmation = await signInWithPhoneNumber(auth, e164Phone, verifier);
  return confirmation; // call confirmation.confirm(code) later
}
