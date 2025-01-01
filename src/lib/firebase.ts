import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC5iYMq9VUkpIivk6pGte7qVa6P0aOEGjo",
  authDomain: "Clam.firebaseapp.com",
  projectId: "relish-clam",
  storageBucket: "relish-clam.firebasestorage.app",
  messagingSenderId: "355823759831",
  appId: "1:355823759831:web:5a2c8ca466d32befa25b92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence enabled in first tab only');
    } else if (err.code === 'unimplemented') {
      console.warn('Browser doesn\'t support persistence');
    }
  });

export { app, db, storage };