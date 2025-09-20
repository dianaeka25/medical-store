// pages/cart.js
import { useState, useEffect } from 'react';
import { getCart, updateCartItemQuantity, removeCartItem } from '../lib/cart';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter
import { mockProducts } from '../lib/products';

const CartPage = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const router = useRouter(); // Inisialisasi useRouter

  useEffect(() => {
    // ... (kode useEffect yang sudah benar)
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          const unsubscribeSnapshot = onSnapshot(doc(db, 'carts', currentUser.uid), (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              
              const items = data.items || [];
  
              const itemsWithDetails = items.map(item => {
                const productDetail = mockProducts.find(p => p.id === item.productId);
  
                if (!productDetail) {
                  console.error(`Product with ID ${item.productId} not found.`);
                  return null;
                }
  
                const quantity = Number(item.quantity);
                const price = Number(productDetail.price);
  
                const safeQuantity = Number.isNaN(quantity) ? 0 : quantity;
                const safePrice = Number.isNaN(price) ? 0 : price;
  
                return {
                  ...item,
                  ...productDetail,
                  totalPrice: safeQuantity * safePrice
                };
              }).filter(item => item !== null);
  
              setCartItems(itemsWithDetails);
            } else {
              setCartItems([]);
            }
          });
          return () => unsubscribeSnapshot();
        } else {
          setCartItems([]);
        }
      });
      return () => unsubscribeAuth();
    }, []);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(productId);
      return;
    }
    try {
      await updateCartItemQuantity(user.uid, productId, newQuantity);
      setMessage('Kuantitas berhasil diperbarui.');
    } catch (error) {
      setMessage(`Gagal memperbarui kuantitas: ${error.message}`);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeCartItem(user.uid, productId);
      setMessage('Produk berhasil dihapus dari keranjang.');
    } catch (error) {
      setMessage(`Gagal menghapus produk: ${error.message}`);
    }
  };
  
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setMessage('Keranjang Anda kosong. Tidak dapat melanjutkan pembayaran.');
      return;
    }
    // Mengarahkan pengguna ke halaman checkout
    router.push('/checkout');
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.totalPrice), 0);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8 text-gray-800">Keranjang Belanja</h1>
      {message && <div className="text-center p-4 mb-4 text-green-700 bg-green-100 rounded">{message}</div>}
      
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          <p>Keranjang Anda kosong.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Yuk, mulai belanja!
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cartItems.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-700">Rp {item.price.toLocaleString('id-ID')}</p>
                  <p className="text-gray-500">Kuantitas: {item.quantity}</p>
                  <p className="font-bold text-green-600">Total: Rp {item.totalPrice.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="bg-yellow-500 text-white p-1 rounded-full hover:bg-yellow-600"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Total Belanja: Rp {calculateTotal().toLocaleString('id-ID')}</h2>
            <button
              onClick={handleCheckout}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Lanjut ke Pembayaran
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;