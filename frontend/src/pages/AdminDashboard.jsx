import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import StatsCard from '../components/StatsCard';

export default function AdminDashboard({ adminNames, onLogout }) {
  const [guests, setGuests] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ event: '', search: '', invitedBy: '' });
  const [loading, setLoading] = useState(true);

  // e.g. 'Riyaz' or 'Vaseem,Ruksana'
  const scopeParam = adminNames.join(',');
  const dashboardTitle = adminNames.join(' & ');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { invitedBy: filters.invitedBy || scopeParam };
      if (filters.event) params.event = filters.event;
      if (filters.search) params.search = filters.search;

      const [guestsRes, statsRes] = await Promise.all([
        axios.get('/api/guests', { params }),
        axios.get('/api/guests/stats', { params: { invitedBy: scopeParam } })
      ]);
      setGuests(guestsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, scopeParam]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this guest entry?')) return;
    await axios.delete(`/api/guests/${id}`);
    fetchData();
  };

  const exportCSV = () => {
    const headers = ['Name', 'Event', 'Invited By', 'Attendees', 'Arrival Date & Time', 'Submitted At'];
    const rows = guests.map(g => [
      g.name, g.event, g.invitedBy, g.attendees, g.arrivalTime || '-',
      new Date(g.createdAt).toLocaleString()
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guests-${dashboardTitle}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatValue = (arr, key) => arr?.find(x => x._id === key)?.count || 0;

  return (
    <div className="container">
      <div className="page">
        <div className="admin-header">
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Dashboard — {dashboardTitle}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              Showing guests invited by {dashboardTitle}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="export-btn" onClick={exportCSV}>Export CSV</button>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </div>

        {stats && (
          <>
            <div className="stats-grid">
              <StatsCard label="Total Guests" value={stats.total} />
              <StatsCard label="Shukrana & Nikah" value={getStatValue(stats.byEvent, 'Shukrana & Nikah')} />
              <StatsCard label="Valima" value={getStatValue(stats.byEvent, 'Valima')} />
              <StatsCard label="Entries" value={guests.length} />
            </div>

            {/* Per-host breakdown only shown when viewing multiple hosts (Vaseem & Ruksana) */}
            {adminNames.length > 1 && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
                {adminNames.map(name => (
                  <div key={name} style={{ background: 'white', borderRadius: 10, padding: '10px 16px', boxShadow: 'var(--shadow)', flex: 1, minWidth: 100, textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--primary)' }}>
                      {getStatValue(stats.byInvitedBy, name)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>via {name}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="filters">
          <select value={filters.event} onChange={e => setFilters(f => ({ ...f, event: e.target.value }))}>
            <option value="">All Events</option>
            <option value="Shukrana & Nikah">Shukrana & Nikah</option>
            <option value="Valima">Valima</option>
          </select>
          {adminNames.length > 1 && (
            <select value={filters.invitedBy} onChange={e => setFilters(f => ({ ...f, invitedBy: e.target.value }))}>
              <option value="">All Hosts</option>
              {adminNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          )}
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          />
        </div>

        {loading ? (
          <div className="empty-state"><p>Loading...</p></div>
        ) : guests.length === 0 ? (
          <div className="empty-state"><p>No guests found.</p></div>
        ) : (
          <div className="guest-list">
            {guests.map(g => (
              <div key={g._id} className="guest-item">
                <div className="guest-info">
                  <div className="guest-name">{g.name}</div>
                  <div className="guest-meta">
                    <span className="badge badge-purple">{g.event}</span>
                    {adminNames.length > 1 && <span className="badge badge-amber">via {g.invitedBy}</span>}
                    <span>{g.attendees} {g.attendees === 1 ? 'person' : 'people'}</span>
                    {g.arrivalTime && <span>Arriving: {g.arrivalTime}</span>}
                    <span style={{ color: 'var(--muted)' }}>{new Date(g.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button className="btn-danger btn" onClick={() => handleDelete(g._id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
