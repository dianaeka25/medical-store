// pages/checkout.js
import { useState, useEffect } from 'react';
import { getCart, clearCart } from '../lib/cart';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { mockProducts } from '../lib/products';
import Link from 'next/link';

const CheckoutPage = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('prepaid');
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      
      const cartData = await getCart(currentUser.uid);
      if (cartData && Array.isArray(cartData.items) && cartData.items.length > 0) {
        const itemsWithDetails = cartData.items.map(item => {
          const productDetail = mockProducts.find(p => p.id === item.productId);
          if (!productDetail) return null;
          
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
        const total = itemsWithDetails.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalPrice(total);
      } else {
        router.push('/cart');
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, [router]);

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Keranjang Anda kosong.');
      return;
    }

    try {
      if (paymentMethod === 'prepaid') {
        alert('Anda akan dialihkan ke halaman pembayaran Prepaid.');
      } else {
        alert('Pesanan Anda akan dikirimkan. Bayar di tempat saat barang tiba.');
      }
      
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: user.email,
          orderDetails: cartItems,
          totalAmount: totalPrice,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengirim faktur');
      }

      await clearCart(user.uid);
      router.push('/order-success');
    } catch (error) {
      console.error('Gagal menyelesaikan pembayaran:', error);
      alert(`Pembayaran gagal: ${error.message}. Silakan coba lagi.`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold my-8 text-gray-900">Memuat ringkasan pesanan...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center my-8 text-gray-900">Ringkasan Pembayaran</h1>
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Item Pesanan</h2>
        <ul className="space-y-4">
          {cartItems.map(item => (
            <li key={item.id} className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center space-x-4">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md shadow-md" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-semibold text-gray-800">Rp {item.totalPrice.toLocaleString('id-ID')}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Pilih Metode Pembayaran</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setPaymentMethod('prepaid')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold border-2 transition-colors duration-200 ${paymentMethod === 'prepaid' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'}`}
              >
                Prepaid
              </button>
              <button
                onClick={() => setPaymentMethod('postpaid')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold border-2 transition-colors duration-200 ${paymentMethod === 'postpaid' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'}`}
              >
                Postpaid (COD)
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Total Pembayaran</h2>
            <span className="text-3xl font-bold text-green-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>
          
          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors duration-200"
          >
            {paymentMethod === 'prepaid' ? 'Lanjut ke Pembayaran' : 'Selesaikan Pesanan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;