// pages/products.js
import { useState, useEffect } from 'react';
import { addToCart } from '../lib/cart';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

// Data produk palsu yang konsisten dengan file lain
const mockProducts = [
  { id: 'prod-1', name: 'Masker Medis', price: 50000, imageUrl: '/1.jpg', description: 'Masker 3-lapis untuk perlindungan maksimal.' },
  { id: 'prod-2', name: 'Hand Sanitizer', price: 35000, imageUrl: '/2.jpg', description: 'Gel pembersih tangan anti-bakteri.' },
  { id: 'prod-3', name: 'Vitamin C', price: 75000, imageUrl: '/3.jpg', description: 'Suplemen untuk daya tahan tubuh.' },
  { id: 'prod-4', name: 'Termometer Digital', price: 150000, imageUrl: '/4.jpg', description: 'Termometer akurat untuk mengukur suhu tubuh.' },
  { id: 'prod-5', name: 'Sarung Tangan Medis', price: 25000, imageUrl: '/5.jpg', description: 'Sarung tangan lateks untuk sekali pakai.' },
  { id: 'prod-6', name: 'Plester Luka', price: 15000, imageUrl: '/6.jpg', description: 'Plester transparan anti air, isi 10.' },
  { id: 'prod-7', name: 'Tensimeter Digital', price: 350000, imageUrl: '/7.jpg', description: 'Alat pengukur tekanan darah otomatis.' },
  { id: 'prod-8', name: 'Oksimeter Jari', price: 250000, imageUrl: '/8.jpg', description: 'Mengukur kadar oksigen dan detak jantung.' },
];

const ProductsPage = () => {
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

export default ProductsPage;