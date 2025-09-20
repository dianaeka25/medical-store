// pages/index.js
import { useState, useEffect } from 'react';
import { addToCart } from '../lib/cart';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { mockProducts } from '../lib/products';


// Data produk palsu
// Data produk palsu


const HomePage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAddToCart = async (productId, quantity = 1) => {
    if (!user) {
      setMessage('Silakan login untuk menambahkan produk ke keranjang.');
      return;
    }
    try {
      await addToCart(user.uid, productId, quantity);
      setMessage(`Produk berhasil ditambahkan ke keranjang.`);
    } catch (error) {
      setMessage(`Gagal menambahkan produk: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8 text-gray-800">Daftar Produk</h1>
      {message && <div className="text-center p-4 mb-4 text-green-700 bg-green-100 rounded">{message}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h2>
              <p className="text-gray-700 mb-2">{product.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-2xl font-bold text-green-600">Rp {product.price.toLocaleString('id-ID')}</span>
                <button
                  onClick={() => handleAddToCart(product.id, 1)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  Tambahkan ke Keranjang
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;