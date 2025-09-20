// pages/login.js
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEmail('');
    setPassword('');
    setError(null);
  };

  return (
    <div className="flex justify-center items-center py-10 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Form group untuk Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-black mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="p-2 border border-gray-300 rounded text-black" 
            />
          </div>
          
          {/* Form group untuk Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-black mb-1">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="p-2 border border-gray-300 rounded text-black" 
            />
          </div>
          
          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Masuk...' : 'Login'}
            </button>
            <button 
              type="button" 
              onClick={handleClear} 
              className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Clear
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Belum punya akun?{' '}
          <Link href="/register">
            <span className="text-blue-600 hover:underline cursor-pointer">Registrasi</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;