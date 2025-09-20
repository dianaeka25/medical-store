// pages/api/send-invoice.js
import { Resend } from 'resend';

// Ganti dengan kunci API Anda dari Resend atau layanan serupa
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { customerEmail, orderDetails, totalAmount } = req.body;

  if (!customerEmail || !orderDetails || !totalAmount) {
    return res.status(400).json({ message: 'Missing required data' });
  }

  try {
    const invoiceContent = `
      <html>
        <body>
          <h1>Invoice Pesanan Anda</h1>
          <p>Terima kasih telah berbelanja!</p>
          <p>Berikut adalah ringkasan pesanan Anda:</p>
          <ul>
            ${orderDetails.map(item => `
              <li>${item.name} - ${item.quantity} x Rp ${item.price.toLocaleString('id-ID')} = Rp ${item.totalPrice.toLocaleString('id-ID')}</li>
            `).join('')}
          </ul>
          <h3>Total Pembayaran: Rp ${totalAmount.toLocaleString('id-ID')}</h3>
          <p>Faktur ini juga tersedia di riwayat pesanan akun Anda.</p>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Ganti dengan email pengirim Anda
      to: customerEmail,
      subject: 'Faktur Pesanan Anda',
      html: invoiceContent,
    });

    if (error) {
      console.error("Gagal mengirim email:", error);
      return res.status(500).json({ message: 'Failed to send email' });
    }

    res.status(200).json({ message: 'Invoice sent successfully', data });
  } catch (error) {
    console.error("Kesalahan server:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}