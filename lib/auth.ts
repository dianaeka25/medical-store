// lib/auth.ts
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    // Tampilkan pesan error yang sesuai
    console.error("Login failed:", error.message);
    throw error; 
  }
};