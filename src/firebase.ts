// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,setPersistence, browserLocalPersistence, } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCzLufBiE8-bDW8j3ALwwzXYLgYbvlUzTs",
  authDomain: "micro-quiz-8c7fd.firebaseapp.com",
  projectId: "micro-quiz-8c7fd",
  storageBucket: "micro-quiz-8c7fd.appspot.com",  // 👈 isko correct kar (pehle galat tha)
  messagingSenderId: "312271895559",
  appId: "1:312271895559:web:aa2537a4c45fb0f2287ea2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Exports
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
