import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Validate that default placeholder values have been replaced
const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const placeholderValues = ['YOUR_API_KEY_HERE', 'YOUR_PROJECT_ID', 'YOUR_SENDER_ID', 'YOUR_APP_ID', undefined, ''];

const missingKeys = requiredKeys.filter(key => {
  const val = import.meta.env[key];
  return !val || placeholderValues.some(p => val.startsWith('YOUR_'));
});

export const isFirebaseConfigured = missingKeys.length === 0;

if (!isFirebaseConfigured) {
  console.warn(
    `🔥 SmartStudy Firebase Setup Required:\n` +
    `The following environment variables need to be set in your .env file:\n` +
    missingKeys.map(k => `  • ${k}`).join('\n') +
    `\n\nGo to https://console.firebase.google.com → Your Project → Project Settings → copy the config values.`
  );
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
