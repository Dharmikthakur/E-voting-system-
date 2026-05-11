import './globals.css';
import Navbar from '@/components/Navbar';
import { Toast } from '@/components/Toast';

export const metadata = {
  title: 'SecureVote - Digital Democracy',
  description: 'A secure, transparent, and modern electronic voting platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="container">
          {children}
        </div>
        <Toast />
      </body>
    </html>
  );
}
