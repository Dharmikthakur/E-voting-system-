import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data);

        const candRes = await axios.get('http://localhost:5000/api/voting/candidates');
        setCandidates(candRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleVote = async (candidateId) => {
    if (!window.confirm('Are you sure you want to vote for this candidate? This action cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/voting/vote', { candidateId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Vote successfully cast!');
      setUser({ ...user, hasVoted: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '1rem' }}>Welcome, {user?.name}</h2>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}
      {successMsg && <div style={{ color: 'var(--success)', marginBottom: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>{successMsg}</div>}
      
      {user?.hasVoted ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>You have already voted.</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Thank you for participating in the election.</p>
          <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/results')}>View Results</button>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--text-muted)' }}>Please select a candidate to cast your vote.</p>
          <div className="candidate-grid">
            {candidates.map(candidate => (
              <div key={candidate._id} className="candidate-card glass-panel">
                <h3 className="candidate-name">{candidate.name}</h3>
                <p className="candidate-party">{candidate.party}</p>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{candidate.manifesto}</p>
                <button className="btn-primary" onClick={() => handleVote(candidate._id)}>
                  Vote for {candidate.name}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
