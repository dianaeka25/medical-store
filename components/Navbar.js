// components/Navbar.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [cartItemCount, setCartItemCount] = useState(0);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  useEffect(() => {
    // TODO: Ambil jumlah item keranjang dari Firestore
    // Ini akan membutuhkan setup listener Firestore di komponen terpisah atau context
    if (user) {
      // Contoh placeholder
    } else {
      setCartItemCount(0);
    }
  }, [user]);

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <p className="text-white text-2xl font-bold cursor-pointer">MedStore</p>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/">
            <p className="text-white hover:text-blue-200 cursor-pointer">Produk</p>
          </Link>
          {user && (
            <Link href="/cart">
              <p className="text-white hover:text-blue-200 cursor-pointer relative">
                Keranjang {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                      {cartItemCount}
                    </span>
                )}
              </p>
            </Link>
          )}

          {loading ? (
            <span className="text-white">Memuat...</span>
          ) : user ? (
            <>
              <span className="text-white">Halo, {user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <p className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer">Login</p>
              </Link>
              <Link href="/register">
                <p className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded cursor-pointer">Registrasi</p>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;