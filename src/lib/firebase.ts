import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3Mxt3JPNomB14Z8-PKuQFfi2KPO72Al0",
  authDomain: "eplandoktor.firebaseapp.com",
  projectId: "eplandoktor",
  storageBucket: "eplandoktor.appspot.com", // Usually generic format. The original said eplandoktor.firebasestorage.app
  messagingSenderId: "915433230869",
  appId: "1:915433230869:web:06db7d3c5413a29f70741c",
  measurementId: "G-NMCRW65DQM"
};

// Use the original storage bucket as defined before
firebaseConfig.storageBucket = "eplandoktor.appspot.com";

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
