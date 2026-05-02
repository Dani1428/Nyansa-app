import React, { useState, useEffect } from 'react';
import './ValidationConsole.css';

interface Submission {
  id: number;
  task_title: string;
  annotator_name: string;
  task_type: 'audio' | 'image' | 'text';
  content_text: string;
  file_url?: string;
  gps_lat?: number;
  gps_long?: number;
  status: 'pending' | 'approved' | 'rejected';
  quality_score: number;
  fraud_score: number;
}

const ValidationConsole: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/submissions/', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Handle paginated or direct array results
        const list = data.results || (Array.isArray(data) ? data : []);
        setSubmissions(list);
        if (list.length > 0 && !selectedSubmission) {
          setSelectedSubmission(list[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleAction = async (status: 'approved' | 'rejected') => {
    if (!selectedSubmission) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/v1/submissions/${selectedSubmission.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        // Update local list
        const updated = submissions.map(s => s.id === selectedSubmission.id ? { ...s, status } : s);
        setSubmissions(updated);
        
        // Auto-select next pending
        const next = updated.find(s => s.status === 'pending');
        if (next) {
          setSelectedSubmission(next);
        }
      }
    } catch (err) {
      console.error('Error updating submission:', err);
    }
  };

  return (
    <div className="validation-console">
      <header className="console-header">
        <h1>Validation Console</h1>
        <div className="stats-summary">
          <span className="stat-badge">Pending: {submissions.filter(s => s.status === 'pending').length}</span>
          <span className="stat-badge approved">Approved: {submissions.filter(s => s.status === 'approved').length}</span>
        </div>
      </header>

      <div className="console-layout">
        <aside className="submission-list">
          {submissions.map(sub => (
            <div 
              key={sub.id} 
              className={`submission-item ${selectedSubmission?.id === sub.id ? 'active' : ''} ${sub.status}`}
              onClick={() => setSelectedSubmission(sub)}
            >
              <div className="sub-type-icon">{sub.task_type === 'audio' ? '🎙️' : sub.task_type === 'image' ? '📷' : '📝'}</div>
              <div className="sub-info">
                <h3>{sub.task_title}</h3>
                <p>{sub.annotator_name}</p>
              </div>
              <div className={`status-dot ${sub.status}`}></div>
            </div>
          ))}
        </aside>

        <main className="review-area">
          {selectedSubmission ? (
            <div className="review-card">
              <div className="viewer">
                {selectedSubmission.task_type === 'audio' && (
                  <div className="audio-player">
                    <audio controls src={selectedSubmission.file_url}></audio>
                    <div className="waveform-mock">
                      {/* Waveform visualization would go here */}
                      <div className="bar"></div><div className="bar high"></div><div className="bar"></div>
                    </div>
                  </div>
                )}
                {selectedSubmission.task_type === 'image' && (
                  <img src={selectedSubmission.file_url} alt="Submission" className="submission-image" />
                )}
                {selectedSubmission.task_type === 'text' && (
                  <div className="text-content">
                    <p>{selectedSubmission.content_text}</p>
                  </div>
                )}
              </div>

              <div className="metadata-panel">
                <div className="meta-group">
                  <label>Annotator</label>
                  <span>{selectedSubmission.annotator_name}</span>
                </div>
                <div className="meta-group">
                  <label>GPS Location</label>
                  <span>{selectedSubmission.gps_lat}, {selectedSubmission.gps_long}</span>
                </div>
                <div className="meta-group">
                  <label>Fraud Score</label>
                  <div className={`score-bar ${selectedSubmission.fraud_score > 0.5 ? 'high' : 'low'}`}>
                    <div className="fill" style={{ width: `${selectedSubmission.fraud_score * 100}%` }}></div>
                  </div>
                </div>
                <div className="meta-group">
                  <label>Quality Score</label>
                  <div className="score-bar quality">
                    <div className="fill" style={{ width: `${selectedSubmission.quality_score * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="action-bar">
                <button className="reject-btn" onClick={() => handleAction('rejected')}>Reject</button>
                <button className="edit-btn">Edit</button>
                <button className="approve-btn" onClick={() => handleAction('approved')}>Approve</button>
              </div>
            </div>
          ) : (
            <div className="empty-state">Select a submission to review</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ValidationConsole;
