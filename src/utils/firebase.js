// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfCLa9PkByLHs-S5BERWs3oi6ckvTusfs",
  authDomain: "supertodolist-16bd4.firebaseapp.com",
  projectId: "supertodolist-16bd4",
  storageBucket: "supertodolist-16bd4.appspot.com",
  messagingSenderId: "208026423482",
  appId: "1:208026423482:web:c0512f058a9e260f5a3283",
  measurementId: "G-KX6WVBFTVP",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
