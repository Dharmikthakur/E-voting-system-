'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from '@/components/Toast';

export default function Results() {
  const [data, setData] = useState({ candidates: [], totalVotes: 0, electionOpen: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get('/api/voting/results');
        setData(res.data);
      } catch (err) {
        toast('Failed to fetch live results', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    const interval = setInterval(fetchResults, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="loader-wrap">
      <div className="spinner"></div>
      <p>Tallying votes...</p>
    </div>
  );

  const getRankMedal = (index, votes, maxVotes) => {
    if (votes === 0) return '';
    if (index === 0 && votes === maxVotes) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getRankClass = (index, votes, maxVotes) => {
    if (votes === 0) return '';
    if (index === 0 && votes === maxVotes) return 'winner';
    return '';
  };

  const candidatesList = Array.isArray(data?.candidates) ? data.candidates : (Array.isArray(data) ? data : []);
  const totalVotes = typeof data?.totalVotes === 'number' ? data.totalVotes : candidatesList.reduce((acc, c) => acc + (c.voteCount || 0), 0);
  const electionOpen = data?.electionOpen ?? true;

  const maxVotes = candidatesList.length > 0 ? Math.max(...candidatesList.map(c => c.voteCount || 0)) : 0;

  return (
    <div className="results-wrap animate">
      <header className="page-header" style={{ textAlign: 'center' }}>
        <h1 className="page-title">Live Election Results 📊</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <span className={`chip ${electionOpen ? 'chip-success' : 'chip-muted'}`}>
            {electionOpen ? '🔴 Live Updates' : '⚪ Final Results'}
          </span>
          <span className="chip chip-primary">Total Votes: {totalVotes}</span>
        </div>
      </header>

      <div className="result-stat-grid">
        <div className="result-stat">
          <div className="result-stat-num">{candidatesList.length}</div>
          <div className="result-stat-label">Candidates</div>
        </div>
        <div className="result-stat">
          <div className="result-stat-num">{totalVotes}</div>
          <div className="result-stat-label">Ballots Cast</div>
        </div>
        <div className="result-stat">
          <div className="result-stat-num">{electionOpen ? 'Open' : 'Closed'}</div>
          <div className="result-stat-label">Status</div>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        {candidatesList.map((c, idx) => {
          const percent = totalVotes > 0 ? Math.round(((c.voteCount || 0) / totalVotes) * 100) : 0;
          const isWinner = getRankClass(idx, c.voteCount, maxVotes) === 'winner';
          
          return (
            <div key={c._id} className={`glass result-card ${isWinner ? 'winner' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="result-rank">
                  {getRankMedal(idx, c.voteCount, maxVotes)}
                </div>
                <div className="result-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div className="result-name">{c.name}</div>
                      <div className="result-party">{c.party}</div>
                    </div>
                    <div className="result-votes">
                      <strong>{c.voteCount}</strong> votes ({percent}%)
                    </div>
                  </div>
                  <div className="result-bar-wrap">
                    <div 
                      className={`result-bar ${isWinner ? 'gold' : ''}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {candidatesList.length === 0 && (
          <div className="empty-state glass">
            <span>📊</span>
            <p>No election data available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
