"use client"

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  User,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC2Zv0nHKheL4Z2zKJrEovfoFsiPjfLXK8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "echo12.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "echo12",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "echo12.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "842877359776",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:842877359776:web:f15571082b1a33ba195bc5",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-V7LTPKF6ZD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set persistence to LOCAL by default (this is important for maintaining login state)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Add OAuth scopes for Google provider
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Set custom parameters for the Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Add these parameters to improve session persistence
  access_type: 'offline',
  include_granted_scopes: 'true'
});

// Sign in with email and password
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    // Persistence is already set at initialization so we don't need to set it again
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error("Email sign-in error:", error);
    return { user: null, error: error.message };
  }
};

// Sign up with email and password
export const registerWithEmailAndPassword = async (email: string, password: string) => {
  try {
    // Persistence is already set at initialization so we don't need to set it again
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error("Email registration error:", error);
    return { user: null, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    // Simple approach: only use popup (no redirect fallback)
    // Reset any previous auth state
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // Use popup for sign-in
    const userCredential = await signInWithPopup(auth, googleProvider);
    console.log("Google Sign-In successful");

    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error("Google Sign-In error:", error.code, error.message);

    // Return user-friendly error messages
    if (error.code === 'auth/popup-blocked') {
      return { user: null, error: "Pop-up was blocked by your browser. Please enable pop-ups for this site." };
    } else if (error.code === 'auth/popup-closed-by-user') {
      return { user: null, error: "Sign-in was cancelled." };
    } else if (error.code === 'auth/network-request-failed') {
      return { user: null, error: "Network error. Please check your internet connection." };
    }

    return { user: null, error: "Sign-in failed. Please try again." };
  }
};

// Handle redirect result (call this on page load)
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      // User successfully signed in
      console.log("Redirect result processed successfully:", result.user.email);
      return { user: result.user, error: null };
    }
    return { user: null, error: null }; // No redirect result
  } catch (error: any) {
    console.error("Redirect result error:", error);
    return { user: null, error: error.message };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    // Clear any stored auth data
    localStorage.removeItem('userSignedIn');
    return { error: null };
  } catch (error: any) {
    console.error("Sign out error:", error);
    return { error: error.message };
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export default app; 