// pages/payment.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCart, clearCart } from '../lib/cart';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const mockProducts = [
  { id: 'prod-1', name: 'Masker Medis', price: 50000 },
  { id: 'prod-2', name: 'Hand Sanitizer', price: 35000 },
  { id: 'prod-3', name: 'Vitamin C', price: 75000 },
  { id: 'prod-4', name: 'Termometer Digital', price: 150000 },
];

const PaymentPage = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const cartData = await getCart(currentUser.uid);
        if (cartData && cartData.items) {
          const itemsWithDetails = cartData.items.map(item => {
            const productDetail = mockProducts.find(p => p.id === item.productId);
            return {
              ...item,
              ...productDetail,
              totalPrice: item.quantity * productDetail.price
            };
          });
          setCartItems(itemsWithDetails);
        } else {
          setCartItems([]);
        }
        setLoading(false);
      } else {
        setLoading(false);
        router.push('/login');
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    // Hapus keranjang setelah pembayaran berhasil
    await clearCart(user.uid);
    
    // Redirect ke halaman nota pembayaran
    router.push('/invoice');
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8 text-gray-800">Pembayaran</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Total Pembayaran: Rp {subtotal.toLocaleString('id-ID')}</h2>
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="cardNumber" className="text-black mb-1">Nomor Kartu</label>
            <input type="text" id="cardNumber" required className="p-2 border border-gray-300 rounded text-black" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="cardName" className="text-black mb-1">Nama Pemilik Kartu</label>
            <input type="text" id="cardName" required className="p-2 border border-gray-300 rounded text-black" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 flex-col">
              <label htmlFor="expiryDate" className="text-black mb-1">Tanggal Kadaluarsa</label>
              <input type="text" id="expiryDate" placeholder="MM/YY" required className="p-2 border border-gray-300 rounded text-black" />
            </div>
            <div className="flex-1 flex-col">
              <label htmlFor="cvv" className="text-black mb-1">CVV</label>
              <input type="text" id="cvv" required className="p-2 border border-gray-300 rounded text-black" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            Bayar Sekarang
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;