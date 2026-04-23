import { useState } from 'react';
import axios from 'axios';

const EVENTS = [
  { id: 'Shukrana & Nikah', name: 'Shukrana & Nikah', icon: '🕌' },
  { id: 'Valima', name: 'Valima', icon: '🌹' },
];
const HOSTS = ['Riyaz', 'Vaseem', 'Ruksana'];
const EVENT_DATES = {
  'Shukrana & Nikah': [
    { value: '2026-04-29', label: 'April 29', sub: 'Wednesday' },
    { value: '2026-04-30', label: 'April 30', sub: 'Thursday' },
  ],
  'Valima': [
    { value: '2026-05-02', label: 'May 2', sub: 'Saturday' },
  ],
};

const CONTACT = { Riyaz: '9581739450', Vaseem: '9010909256', Ruksana: '9010909256' };

function getWhatsAppLink(invitedBy, guestName, event, arrivalDate, arrivalTime) {
  const number = '91' + CONTACT[invitedBy];
  const msg = `Assalamu Alaikum ${invitedBy} Bhai! 🌸\n\nThis is ${guestName}. I have confirmed my attendance for *${event}* on *${arrivalDate}* at *${arrivalTime}*.\n\nPlease arrange my stay. JazakAllah Khair! 🤲`;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

export default function GuestForm() {
  const [form, setForm] = useState({ name: '', event: '', invitedBy: '', arrivalDate: '', arrivalTime: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.event) e.event = 'Please select an event.';
    if (!form.invitedBy) e.invitedBy = 'Please select who invited you.';
    if (!form.arrivalDate) e.arrivalDate = 'Arrival date is required.';
    if (!form.arrivalTime) e.arrivalTime = 'Arrival time is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setLoading(true);
    try {
      const arrivalTime = `${form.arrivalDate} ${form.arrivalTime}`;
      await axios.post('/api/guests', { ...form, arrivalTime });
      setSubmitted(true);
    } catch (err) {
      setApiError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm({ name: '', event: '', invitedBy: '', arrivalDate: '', arrivalTime: '' });
    setSubmitted(false);
    setApiError('');
  };

  const [showPopup, setShowPopup] = useState(false);

  if (submitted) {
    const waLink = getWhatsAppLink(form.invitedBy, form.name, form.event, form.arrivalDate, form.arrivalTime);
    return (
      <div className="container">
        {showPopup && (
          <div className="modal-overlay" onClick={() => setShowPopup(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: '2.5rem' }}>📱</div>
                <h2 style={{ marginTop: 8 }}>Save This Number</h2>
                <p>Save {form.invitedBy}'s number so we can reach you with stay details.</p>
              </div>
              <div style={{ background: 'var(--primary-light)', borderRadius: 10, padding: '12px 16px', textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>{form.invitedBy}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: 1 }}>{CONTACT[form.invitedBy]}</div>
              </div>
              <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ background: '#25D366', marginBottom: 10, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>💬</span> Send WhatsApp Message
              </a>
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}
        <div className="ty-wrapper">
          <div className="ty-flowers">🌸 🌺 🌸</div>
          <div className="ty-ring">💍</div>
          <h2 className="ty-title">JazakAllah Khair!</h2>
          <p className="ty-sub">We are overjoyed to have you celebrate with us</p>
          <div className="ty-divider">❧</div>
          <p className="ty-detail">
            Hi <strong>{form.name}</strong>! Assalamu Alaikum 👋<br /><br />
            Your attendance for <strong>{form.event}</strong> has been confirmed.
            {form.arrivalTime && <> We are expecting you on <strong>{form.arrivalDate}</strong> at <strong>{form.arrivalTime}</strong>.</>}
            {' '}We will arrange your stay and reach out with further details soon.
          </p>
          <div className="ty-contact" onClick={() => setShowPopup(true)} style={{ cursor: 'pointer' }}>
            <div className="ty-contact-label">For any queries, contact {form.invitedBy} 👇 Tap to save &amp; WhatsApp</div>
            <div className="ty-contact-number">📞 {CONTACT[form.invitedBy]}</div>
          </div>
          <p className="ty-dua">May Allah bless this union with love, mercy, and happiness. 🤲</p>
          <div className="ty-flowers" style={{ marginTop: 8 }}>🌹 🌷 🌹</div>
          <a
            href="https://thisisvaseem-stack.github.io/wedding-map/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ marginTop: 24, textDecoration: 'none', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            📍 View Event Locations
          </a>
          <button className="btn btn-outline" style={{ marginTop: 12, width: '100%' }} onClick={reset}>Submit Another Response</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page">

        {/* Floral banner */}
        <div className="floral-banner">
          <div className="floral-row"></div>
          <div className="floral-title">You're Invited</div>
          <div className="floral-sub">Please fill in the form so we can arrange your stay</div>
          <div className="floral-row"></div>
        </div>

        <div className="card">
          {apiError && <div className="alert alert-error">{apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>

            {/* Event Selection */}
            <div className="form-group">
              <label className="form-label">Select Event <span>*</span></label>
              <div className="event-grid">
                {EVENTS.map(ev => (
                  <div
                    key={ev.id}
                    className={`event-card ${form.event === ev.id ? 'selected' : ''}`}
                    onClick={() => { setForm(f => ({ ...f, event: ev.id, arrivalDate: '' })); setErrors(e => ({ ...e, event: '', arrivalDate: '' })); }}
                  >
                    <div className="event-card-icon">{ev.icon}</div>
                    <div className="event-card-name">{ev.name}</div>
                  </div>
                ))}
              </div>
              {errors.event && <p className="field-error">{errors.event}</p>}
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">🌿 Full Name <span>*</span></label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
                value={form.name}
                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }}
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            {/* Arrival Date */}
            {form.event && (
              <div className="form-group">
                <label className="form-label">🗓 Arrival Date <span>*</span></label>
                <div className="date-grid">
                  {(EVENT_DATES[form.event] || []).map(d => (
                    <div
                      key={d.value}
                      className={`date-card ${form.arrivalDate === d.value ? 'selected' : ''}`}
                      onClick={() => { setForm(f => ({ ...f, arrivalDate: d.value })); setErrors(er => ({ ...er, arrivalDate: '' })); }}
                    >
                      <div className="date-card-label">{d.label}</div>
                      <div className="date-card-sub">{d.sub}</div>
                    </div>
                  ))}
                </div>
                {errors.arrivalDate && <p className="field-error">{errors.arrivalDate}</p>}
              </div>
            )}

            {/* Arrival Time */}
            {form.arrivalDate && (
              <div className="form-group">
                <label className="form-label">🕐 Arrival Time <span>*</span></label>
                <input
                  type="time"
                  className="form-control"
                  value={form.arrivalTime}
                  onChange={e => setForm(f => ({ ...f, arrivalTime: e.target.value }))}
                />
                {errors.arrivalTime && <p className="field-error">{errors.arrivalTime}</p>}
              </div>
            )}

            {/* Invited By */}
            <div className="form-group">
              <label className="form-label">🌺 Invited By <span>*</span></label>
              <div className="invited-grid">
                {HOSTS.map(host => (
                  <button
                    key={host}
                    type="button"
                    className={`invited-btn ${form.invitedBy === host ? 'selected' : ''}`}
                    onClick={() => { setForm(f => ({ ...f, invitedBy: host })); setErrors(e => ({ ...e, invitedBy: '' })); }}
                  >
                    {host}
                  </button>
                ))}
              </div>
              {errors.invitedBy && <p className="field-error">{errors.invitedBy}</p>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Submitting...</> : 'Confirm Attendance'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
