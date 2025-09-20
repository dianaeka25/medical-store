// pages/register.js
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Link from 'next/link';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const cities = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Yogyakarta', 'Bali', 'Gresik'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== retypePassword) {
      setError('Password dan Retype Password tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        username,
        email: user.email,
        dateOfBirth,
        gender,
        address,
        city,
        contactNo,
        accountNumber,
        createdAt: new Date(),
      });

      router.push('/');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setRetypePassword('');
    setDateOfBirth('');
    setGender('');
    setAddress('');
    setCity('');
    setContactNo('');
    setAccountNumber('');
    setError(null);
  };

  return (
    <div className="flex justify-center items-center py-10 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Registrasi</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Perbaikan pada setiap div untuk label dan input */}
          <div className="flex flex-col">
            <label htmlFor="username" className="text-black mb-1">Username</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="p-2 border border-gray-300 rounded text-black" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-black mb-1">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-2 border border-gray-300 rounded text-black" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-black mb-1">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="p-2 border border-gray-300 rounded text-black" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="retypePassword" className="text-black mb-1">Retype Password</label>
            <input type="password" id="retypePassword" value={retypePassword} onChange={(e) => setRetypePassword(e.target.value)} required className="p-2 border border-gray-300 rounded text-black" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="dateOfBirth" className="text-black mb-1">Date of Birth</label>
            <input type="date" id="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required className="p-2 border border-gray-300 rounded text-black" />
          </div>

          <div className="flex flex-col">
            <label className="text-black mb-1">Gender</label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input type="radio" id="male" name="gender" value="Male" checked={gender === 'Male'} onChange={(e) => setGender(e.target.value)} className="text-black" />
                <label htmlFor="male" className="ml-2 text-black">Male</label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="female" name="gender" value="Female" checked={gender === 'Female'} onChange={(e) => setGender(e.target.value)} className="text-black" />
                <label htmlFor="female" className="ml-2 text-black">Female</label>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="address" className="text-black mb-1">Address</label>
            <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required className="p-2 border border-gray-300 rounded text-black" />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="city" className="text-black mb-1">City</label>
            <select id="city" value={city} onChange={(e) => setCity(e.target.value)} required className="p-2 border border-gray-300 rounded text-black">
              <option value="">Select a city</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="contactNo" className="text-black mb-1">Contact No.</label>
            <input type="tel" id="contactNo" value={contactNo} onChange={(e) => setContactNo(e.target.value)} required className="p-2 border border-gray-300 rounded text-black" />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="accountNumber" className="text-black mb-1">Nomor Rekening</label>
            <input type="text" id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required className="p-2 border border-gray-300 rounded text-black" />
          </div>
          
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
            <button type="button" onClick={handleClear} className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
              Clear
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Sudah punya akun?{' '}
          <Link href="/login">
            <span className="text-blue-600 hover:underline cursor-pointer">Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;