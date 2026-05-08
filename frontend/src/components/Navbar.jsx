import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const isAuth = !!localStorage.getItem('token');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        🗳️ SecureVote
      </Link>
      <div className="nav-links">
        <Link to="/results" className={isActive('/results')}>📊 Results</Link>
        {isAuth ? (
          <>
            <Link to="/dashboard" className={isActive('/dashboard')}>🏠 Vote</Link>
            <Link to="/profile" className={isActive('/profile')}>👤 Profile</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className={isActive('/admin')}>
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
            <Link to="/login" className={isActive('/login')}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '.88rem', marginLeft: '.5rem' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
