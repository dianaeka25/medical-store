// lib/cart.js
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export const getCart = async (userId) => {
  const cartRef = doc(db, 'carts', userId);
  const cartSnap = await getDoc(cartRef);

  if (cartSnap.exists()) {
    const data = cartSnap.data();
    return { ...data, items: Array.isArray(data.items) ? data.items : [] };
  }
  return null;
};

export const addToCart = async (userId, productId, quantity) => {
  const cartRef = doc(db, 'carts', userId);
  const cartSnap = await getDoc(cartRef);
  const safeQuantity = Number.isNaN(Number(quantity)) ? 1 : Number(quantity);

  if (cartSnap.exists()) {
    const cartData = cartSnap.data();
    const items = Array.isArray(cartData.items) ? [...cartData.items] : [];

    const existingItemIndex = items.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      items[existingItemIndex].quantity += safeQuantity;
    } else {
      items.push({ productId, quantity: safeQuantity });
    }
    await updateDoc(cartRef, { items });
  } else {
    await setDoc(cartRef, {
      userId,
      items: [{ productId, quantity: safeQuantity }]
    });
  }
};

export const updateCartItemQuantity = async (userId, productId, newQuantity) => {
  const cartRef = doc(db, 'carts', userId);
  const cartSnap = await getDoc(cartRef);
  const safeQuantity = Number.isNaN(Number(newQuantity)) ? 0 : Number(newQuantity);

  if (cartSnap.exists()) {
    const cartData = cartSnap.data();
    const updatedItems = cartData.items.map(item =>
      item.productId === productId ? { ...item, quantity: safeQuantity } : item
    );
    await updateDoc(cartRef, { items: updatedItems });
  }
};

export const removeCartItem = async (userId, productId) => {
  const cartRef = doc(db, 'carts', userId);
  const cartSnap = await getDoc(cartRef);

  if (cartSnap.exists()) {
    const cartData = cartSnap.data();
    const updatedItems = cartData.items.filter(item => item.productId !== productId);
    await updateDoc(cartRef, { items: updatedItems });
  }
};

export const clearCart = async (userId) => {
  const cartRef = doc(db, 'carts', userId);
  await updateDoc(cartRef, { items: [] });
};