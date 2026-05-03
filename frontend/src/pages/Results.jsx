import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/voting/results');
        setResults(res.data);
      } catch (err) {
        setError('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading results...</div>;
  if (error) return <div style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</div>;

  const totalVotes = results.reduce((acc, curr) => acc + curr.voteCount, 0);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Live Election Results</h2>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <p style={{ textAlign: 'right', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Total Votes Cast: {totalVotes}</p>
        
        {results.map((candidate) => {
          const percentage = totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0;
          
          return (
            <div key={candidate._id} className="result-item">
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{candidate.name} <span style={{ color: 'var(--primary-color)', fontSize: '0.85em' }}>({candidate.party})</span></span>
                  <span>{candidate.voteCount} votes ({percentage}%)</span>
                </div>
                <div className="result-bar-container">
                  <div className="result-bar" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}

        {results.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No candidates or votes available yet.</p>
        )}
      </div>
    </div>
  );
};

export default Results;
