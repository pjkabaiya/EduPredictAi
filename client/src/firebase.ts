import { initializeApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCzLDGFZWnoMHHdZs4dOF3J6YoKerAfkS4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "edupredictai-d30e0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "edupredictai-d30e0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "edupredictai-d30e0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "325513095349",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:325513095349:web:1414a59d2e98df173c36fc",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3H306JVEM2",
};

let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (e) {
  console.warn('Firebase init failed:', e);
}

export { auth };

export { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile };

export function onFirebaseReady(cb: () => void) {
  if (auth) {
    cb();
  }
}

export type { User };
