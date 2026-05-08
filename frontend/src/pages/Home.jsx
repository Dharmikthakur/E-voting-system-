import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [stats, setStats] = useState(null);
  const isAuth = !!localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/voting/stats')
      .then(r => setStats(r.data))
      .catch(() => {});
  }, []);

  const features = [
    { icon: '🔐', title: 'Secure Authentication', desc: 'JWT-based login with encrypted passwords' },
    { icon: '🗳️', title: 'One Person, One Vote', desc: 'Each voter can cast exactly one ballot' },
    { icon: '📊', title: 'Live Results', desc: 'Real-time results with live vote counts' },
    { icon: '🛡️', title: 'Tamper-Proof', desc: 'Every vote recorded immutably in MongoDB' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">🟢 Election is {stats?.electionOpen ? 'Open' : 'Closed'}</div>
        <h1 className="hero-title">
          The Future of<br /><span>Digital Democracy</span>
        </h1>
        <p className="hero-sub">
          A secure, transparent, and modern electronic voting platform.
          Cast your vote from anywhere — your voice matters.
        </p>
        <div className="hero-cta">
          {isAuth ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '14px 32px' }}>
              🗳️ Cast Your Vote
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '14px 32px' }}>
                Get Started →
              </Link>
              <Link to="/login" className="btn btn-ghost" style={{ fontSize: '1.05rem', padding: '14px 32px' }}>
                Sign In
              </Link>
            </>
          )}
          <Link to="/results" className="btn btn-ghost" style={{ fontSize: '1.05rem', padding: '14px 32px' }}>
            📊 View Results
          </Link>
        </div>
        {stats && (
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">{stats.totalRegistered}</div>
              <div className="hero-stat-label">Registered Voters</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{stats.totalVoted}</div>
              <div className="hero-stat-label">Votes Cast</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{stats.turnout}%</div>
              <div className="hero-stat-label">Voter Turnout</div>
            </div>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="container" style={{ paddingTop: 0, paddingBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '.5rem' }}>Why SecureVote?</h2>
          <p style={{ color: 'var(--muted)' }}>Built with security and transparency at its core</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '1.5rem' }}>
          {features.map((f, i) => (
            <div key={i} className="glass" style={{ padding: '2rem', textAlign: 'center', animation: `fadeUp .5s ${i * .1}s ease both` }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ marginBottom: '.5rem', fontSize: '1.1rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '.9rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
