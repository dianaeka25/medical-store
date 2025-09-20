//import "@/styles/globals.css";

//export default function App({ Component, pageProps }) {
//  return <Component {...pageProps} />;
//}

import '../styles/globals.css';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Atau tampilkan *loader* saat menunggu di sisi klien
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;