import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDi92bYTC0NWdA6Koc_plE9rQKcvJDxvMM",
  authDomain: "signspace-aslguide.firebaseapp.com",
  projectId: "signspace-aslguide",
  storageBucket: "signspace-aslguide.firebasestorage.app",
  messagingSenderId: "1062988835377",
  appId: "1:1062988835377:web:3edd730e8ce99817768310",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
