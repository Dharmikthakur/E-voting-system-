import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '../components/Toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      // Fetch user profile and store it
      const userRes = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${res.data.token}` }
      });
      localStorage.setItem('user', JSON.stringify(userRes.data));
      toast('Welcome back! 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card glass">
        <div className="auth-logo"><span>🗳️</span></div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-sub">Sign in to cast your vote</p>
        <form onSubmit={handleSubmit}>
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
            {loading ? '⏳ Signing in...' : '→ Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}
