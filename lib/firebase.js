// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Tambahkan baris ini
import { getFirestore } from "firebase/firestore"; // Tambahkan baris ini jika kamu menggunakannya

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXLwyI-QTkSTi-KORsvvw9_pnFs-Bds4o",
  authDomain: "medical-store-ca48e.firebaseapp.com",
  projectId: "medical-store-ca48e",
  storageBucket: "medical-store-ca48e.firebasestorage.app",
  messagingSenderId: "611325817465",
  appId: "1:611325817465:web:f164975c584b30da381aa8",
  measurementId: "G-9TY3EFPM0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Inisialisasi Auth dan Firestore
const auth = getAuth(app); // Tambahkan baris ini untuk menginisialisasi Auth
const db = getFirestore(app); // Tambahkan baris ini untuk menginisialisasi Firestore

// Ekspor semua objek yang diperlukan
export { app, analytics, auth, db };