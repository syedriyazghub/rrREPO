import { useState } from 'react';
import axios from 'axios';

export default function AdminLogin({ onLogin, onClose }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/admin/login', { pin });
      // Pass the full array of names — dashboard will scope to all of them
      onLogin(data.adminNames);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Admin Access</h2>
        <p>Enter your PIN to access the dashboard</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">PIN</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter PIN"
              value={pin}
              onChange={e => setPin(e.target.value)}
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading || !pin}>
              {loading ? <span className="spinner" /> : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
