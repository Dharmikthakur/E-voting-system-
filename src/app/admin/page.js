'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/Toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCandidate, setNewCandidate] = useState({ name: '', party: '', manifesto: '', color: '#3b82f6', symbol: '🗳️' });
  const router = useRouter();

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [statsRes, candRes] = await Promise.all([
        axios.get('/api/admin/stats', { headers }),
        axios.get('/api/voting/candidates')
      ]);
      
      setStats(statsRes.data);
      setCandidates(candRes.data);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        toast('Admin access required', 'error');
        router.push('/dashboard');
      } else {
        toast('Failed to load admin data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAdminData(); 
  }, []);

  const handleToggleElection = async () => {
    try {
      const token = localStorage.getItem('token');
      const action = stats.electionOpen ? 'close' : 'open';
      const res = await axios.post(`/api/admin/election/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats({ ...stats, electionOpen: res.data.open });
      toast(`Election is now ${res.data.open ? 'OPEN' : 'CLOSED'}`, 'info');
    } catch (err) {
      toast('Failed to toggle election status', 'error');
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/candidate', newCandidate, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast('Candidate added successfully', 'success');
      setNewCandidate({ name: '', party: '', manifesto: '', color: '#3b82f6', symbol: '🗳️' });
      fetchAdminData();
    } catch (err) {
      toast('Failed to add candidate', 'error');
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm('Delete this candidate? This will mess up existing votes!')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/candidate/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast('Candidate deleted', 'success');
      fetchAdminData();
    } catch (err) {
      toast('Failed to delete candidate', 'error');
    }
  };

  if (loading) return <div className="loader-wrap"><div className="spinner"></div></div>;

  return (
    <div className="animate">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Admin Dashboard 🛡️</h1>
          <p className="page-sub">Manage elections, candidates, and view system stats</p>
        </div>
        <button 
          className={`toggle-btn ${stats?.electionOpen ? 'toggle-close' : 'toggle-open'}`}
          onClick={handleToggleElection}
        >
          {stats?.electionOpen ? '⏸️ Close Election' : '▶️ Open Election'}
        </button>
      </header>

      <div className="admin-grid">
        <div className="admin-stat">
          <div className="admin-stat-num">{stats?.totalRegistered}</div>
          <div className="admin-stat-label">Total Registered</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-num">{stats?.totalVoted}</div>
          <div className="admin-stat-label">Total Voted</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-num">{stats?.turnout}%</div>
          <div className="admin-stat-label">Voter Turnout</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-num">{stats?.totalCandidates}</div>
          <div className="admin-stat-label">Candidates</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem' }}>
          <h2 className="admin-section-title">➕ Add Candidate</h2>
          <form onSubmit={handleAddCandidate}>
            <div className="input-group">
              <input type="text" placeholder="Candidate Name" className="input" 
                value={newCandidate.name} onChange={e => setNewCandidate({...newCandidate, name: e.target.value})} required />
            </div>
            <div className="input-group">
              <input type="text" placeholder="Party Name" className="input" 
                value={newCandidate.party} onChange={e => setNewCandidate({...newCandidate, party: e.target.value})} required />
            </div>
            <div className="input-group">
              <textarea placeholder="Manifesto / Bio" className="input" style={{ minHeight: '80px', resize: 'vertical' }}
                value={newCandidate.manifesto} onChange={e => setNewCandidate({...newCandidate, manifesto: e.target.value})} required />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Symbol</label>
                <input type="text" className="input" maxLength={2} 
                  value={newCandidate.symbol} onChange={e => setNewCandidate({...newCandidate, symbol: e.target.value})} />
              </div>
              <div style={{ flex: 2 }}>
                <label className="form-label">Party Color</label>
                <div className="color-swatches">
                  {colors.map(c => (
                    <div key={c} className={`color-swatch ${newCandidate.color === c ? 'active' : ''}`}
                      style={{ backgroundColor: c }} onClick={() => setNewCandidate({...newCandidate, color: c})} />
                  ))}
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Candidate</button>
          </form>
        </div>

        <div className="glass" style={{ padding: '2rem' }}>
          <h2 className="admin-section-title">📋 Manage Candidates</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="voters-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Party</th>
                  <th>Votes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(c => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>{c.symbol}</span>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="party-badge" style={{ backgroundColor: `${c.color}20`, color: c.color, marginBottom: 0, padding: '.15rem .5rem' }}>
                        {c.party}
                      </span>
                    </td>
                    <td><strong>{c.voteCount}</strong></td>
                    <td>
                      <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '.8rem' }}
                        onClick={() => handleDeleteCandidate(c._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {candidates.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--muted)' }}>No candidates found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
