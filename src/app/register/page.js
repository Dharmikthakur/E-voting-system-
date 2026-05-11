'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from '@/components/Toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      toast('Account created! Welcome. 🗳️', 'success');
      router.push('/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card glass">
        <div className="auth-logo"><span>👋</span></div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Join SecureVote to participate in democracy</p>
        <form onSubmit={handleSubmit}>
          <label className="form-label">Full Name</label>
          <div className="input-group">
            <input
              type="text" name="name" placeholder="John Doe"
              className="input" onChange={handleChange} required
            />
          </div>
          <label className="form-label">Email Address</label>
          <div className="input-group">
            <input
              type="email" name="email" placeholder="you@example.com"
              className="input" onChange={handleChange} required
            />
          </div>
          <label className="form-label">Password</label>
          <div className="input-group">
            <input
              type={showPw ? 'text' : 'password'} name="password" placeholder="••••••••"
              className="input" onChange={handleChange} required
            />
            <span className="input-icon" onClick={() => setShowPw(!showPw)}>
              {showPw ? '🙈' : '👁️'}
            </span>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '.5rem' }} disabled={loading}>
            {loading ? '⏳ Creating account...' : 'Create Account →'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
