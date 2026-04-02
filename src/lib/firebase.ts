import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3Mxt3JPNomB14Z8-PKuQFfi2KPO72Al0",
  authDomain: "eplandoktor.firebaseapp.com",
  projectId: "eplandoktor",
  storageBucket: "eplandoktor.firebasestorage.app",
  messagingSenderId: "915433230869",
  appId: "1:915433230869:web:06db7d3c5413a29f70741c",
  measurementId: "G-NMCRW65DQM"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
