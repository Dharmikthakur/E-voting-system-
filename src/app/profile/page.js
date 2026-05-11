'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/Toast';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUser(res.data);
      setLoading(false);
    })
    .catch(err => {
      if (err.response?.status === 401 || err.response?.status === 404) {
        localStorage.removeItem('token');
        router.push('/login');
      }
      toast('Failed to load profile', 'error');
      setLoading(false);
    });
  }, [router]);

  if (loading) return (
    <div className="loader-wrap">
      <div className="spinner"></div>
      <p>Loading profile...</p>
    </div>
  );

  const initials = (user?.name || '').split(' ').map(n => n?.[0] || '').join('').toUpperCase();
  const votedDate = user?.votedAt ? new Date(user.votedAt).toLocaleString() : 'Not yet voted';

  return (
    <div className="animate" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header className="page-header">
        <h1 className="page-title">Voter Profile</h1>
        <p className="page-sub">Manage your account and view voting history</p>
      </header>

      <div className="glass" style={{ padding: '2.5rem' }}>
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-email">{user?.email}</div>
            <div style={{ marginTop: '.5rem' }}>
              <span className={`chip ${user?.role === 'admin' ? 'chip-primary' : 'chip-muted'}`}>
                {user?.role === 'admin' ? '🛡️ Admin' : '👤 Registered Voter'}
              </span>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '1.2rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '.5rem' }}>
          Voting Status
        </h3>
        
        <div className="profile-info-grid">
          <div className="profile-info-item">
            <div className="profile-info-label">Current Status</div>
            <div className="profile-info-value" style={{ color: user?.hasVoted ? 'var(--success)' : 'var(--warning)' }}>
              {user?.hasVoted ? '✅ Vote Cast' : '⏳ Pending'}
            </div>
          </div>
          <div className="profile-info-item">
            <div className="profile-info-label">Timestamp</div>
            <div className="profile-info-value">{votedDate}</div>
          </div>
          <div className="profile-info-item">
            <div className="profile-info-label">Account Created</div>
            <div className="profile-info-value">{new Date(user?.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
