'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/Toast';
import Modal from '@/components/Modal';

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [electionStatus, setElectionStatus] = useState(null);
  const [confirmVote, setConfirmVote] = useState(null); // stores candidate object
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return router.push('/login');

        const [userRes, candRes, statusRes] = await Promise.all([
          axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`/api/voting/candidates?t=${Date.now()}`),
          axios.get('/api/voting/status')
        ]);

        setUser(userRes.data);
        setCandidates(Array.isArray(candRes.data) ? candRes.data : (candRes.data?.candidates || []));
        setElectionStatus(statusRes.data.open);
        localStorage.setItem('user', JSON.stringify(userRes.data));
      } catch (err) {
        if (err.response?.status === 401) router.push('/login');
        toast('Failed to fetch dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleVote = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/voting/vote', 
        { candidateId: confirmVote._id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast(`Vote cast for ${confirmVote.name}! 🗳️`, 'success');
      setUser({ ...user, hasVoted: true });
      setConfirmVote(null);
    } catch (err) {
      toast(err.response?.data?.message || 'Voting failed', 'error');
      setConfirmVote(null);
    }
  };

  if (loading) return (
    <div className="loader-wrap">
      <div className="spinner"></div>
      <p>Preparing your ballot...</p>
    </div>
  );

  return (
    <div className="animate">
      <header className="page-header">
        <h1 className="page-title">Welcome, {(user?.name || '').split(' ')[0]} 👋</h1>
        <p className="page-sub">Choose your representative carefully</p>
      </header>

      {electionStatus === false && (
        <div className="status-banner closed">
          <span className="pulse-dot"></span>
          Voting is currently closed. Stay tuned for results.
        </div>
      )}

      {user?.hasVoted ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Thank You for Voting!</h2>
          <p style={{ color: 'var(--muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Your vote has been securely recorded. Your participation helps strengthen our democracy.
          </p>
          <button className="btn btn-primary" onClick={() => router.push('/results')}>
            📊 View Live Results
          </button>
        </div>
      ) : (
        <>
          {electionStatus && (
            <div className="status-banner open">
              <span className="pulse-dot"></span>
              Live Election: Voting is currently open
            </div>
          )}
          
          <div className="candidate-grid">
            {candidates.map(c => {
              const initials = (c.name || '').split(' ').map(n => n?.[0] || '').join('').toUpperCase();
              return (
                <div key={c._id} className="candidate-card glass">
                  <div className="candidate-avatar" style={{ backgroundColor: c.color || 'var(--primary)', color: '#fff' }}>
                    {initials}
                  </div>
                  <div className="candidate-symbol">{c.symbol || '🗳️'}</div>
                  <h3 className="candidate-name">{c.name}</h3>
                  <div className="party-badge" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                    {c.party}
                  </div>
                  <p className="candidate-manifesto">{c.manifesto}</p>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                    onClick={() => setConfirmVote(c)}
                    disabled={!electionStatus}
                  >
                    Vote for {(c.name || '').split(' ')[0]}
                  </button>
                </div>
              );
            })}
          </div>
          
          {candidates.length === 0 && (
            <div className="empty-state">
              <span>📭</span>
              <p>No candidates have been registered for this election yet.</p>
            </div>
          )}
        </>
      )}

      <Modal 
        open={!!confirmVote}
        title="Confirm Your Vote"
        subtitle={`Are you absolutely sure you want to vote for ${confirmVote?.name} of the ${confirmVote?.party}? This action cannot be reversed.`}
        confirmText="Confirm Vote 🗳️"
        onConfirm={handleVote}
        onCancel={() => setConfirmVote(null)}
      />
    </div>
  );
}
