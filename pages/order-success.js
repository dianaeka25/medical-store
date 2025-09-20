// pages/order-success.js
import Link from 'next/link';

const OrderSuccessPage = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold my-8 text-green-600">Pembayaran Berhasil! 🎉</h1>
      <p className="text-lg text-gray-700">Terima kasih atas pesanan Anda. Kami akan segera memprosesnya.</p>
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;