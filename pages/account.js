// pages/account.js (Contoh halaman Akun)
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const AccountPage = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [feedback, setFeedback] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      };
      fetchUserData();
    }
  }, [user, loading, router]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    try {
      await addDoc(collection(db, 'feedback'), {
        userId: user.uid,
        feedback,
        createdAt: new Date(),
      });
      alert('Feedback berhasil dikirim!');
      setFeedback('');
    } catch (error) {
      console.error('Gagal mengirim feedback:', error);
      alert('Gagal mengirim feedback.');
    }
  };

  if (loading || !userData) {
    return <div className="text-center py-10">Memuat data akun...</div>;
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Pengaturan Akun</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">Informasi Pengguna</h3>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        {/* Tampilkan informasi lain yang relevan */}
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Berikan Feedback</h3>
          <form onSubmit={handleFeedbackSubmit}>
            <textarea
              className="w-full h-32 p-2 border rounded-md"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tulis feedback Anda di sini..."
              required
            ></textarea>
            <button type="submit" className="mt-4 w-full bg-blue-600 text-white font-bold py-2 rounded-lg">
              Kirim Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;