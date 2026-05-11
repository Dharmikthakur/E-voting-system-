'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    setIsAuth(!!token);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuth(false);
    setUser(null);
    router.push('/login');
  };

  const isActive = (path) => pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link href="/" className="nav-brand">
        🗳️ SecureVote
      </Link>
      <div className="nav-links">
        <Link href="/results" className={isActive('/results')}>📊 Results</Link>
        {isAuth ? (
          <>
            <Link href="/dashboard" className={isActive('/dashboard')}>🏠 Vote</Link>
            <Link href="/profile" className={isActive('/profile')}>👤 Profile</Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className={isActive('/admin')}>
                ⚙️ Admin <span className="nav-badge">ADMIN</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-ghost"
              style={{ padding: '7px 16px', fontSize: '.88rem', marginLeft: '.25rem' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={isActive('/login')}>Login</Link>
            <Link href="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '.88rem', marginLeft: '.5rem' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
