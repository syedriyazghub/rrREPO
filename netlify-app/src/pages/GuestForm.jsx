import { useState, useEffect } from 'react';

const HOSTS = ['Riyaz', 'Vaseem', 'Ruksana'];

const EVENTS = [
  { name: 'Shukrana & Nikah', icon: '🕌', location: 'Rayachoti', date: '29 & 30 April', days: 'Tue & Wed' },
  { name: 'Valima', icon: '🌹', location: 'Kolar', date: '02 May', days: 'Friday' },
];

const EVENT_DATES = {
  'Shukrana & Nikah': [
    { value: '2025-04-29', label: 'April 29', sub: 'Tuesday' },
    { value: '2025-04-30', label: 'April 30', sub: 'Wednesday' },
  ],
  'Valima': [
    { value: '2025-05-02', label: 'May 2', sub: 'Friday' },
  ],
};

const sanitize = (str) => str.replace(/[<>"'`]/g, '').trim();

export default function GuestForm() {
  const [form, setForm] = useState({ name: '', phone: '', placeOfComing: '', event: '', invitedBy: '', arrivalDate: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({ redirectUrl: '', venueUrl: '' });
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(setConfig).catch(() => {});
  }, []);

  useEffect(() => {
    if (!submitted || !config.redirectUrl) return;
    setCountdown(5);
    const t = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) { clearInterval(t); window.location.href = config.redirectUrl; return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [submitted, config.redirectUrl]);

  const handleEventSelect = (name) => {
    const dates = EVENT_DATES[name] || [];
    setForm(f => ({ ...f, event: name, arrivalDate: dates.length === 1 ? dates[0].value : '' }));
    setErrors(e => ({ ...e, event: '', arrivalDate: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    else if (form.name.trim().length > 60) e.name = 'Name must be under 60 characters.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^[+\d\s\-()]{7,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number.';
    if (!form.placeOfComing.trim()) e.placeOfComing = 'Place of coming is required.';
    if (!form.event) e.event = 'Please select an event.';
    if (!form.invitedBy) e.invitedBy = 'Please select who invited you.';
    if (!form.arrivalDate) e.arrivalDate = 'Please select a date.';
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
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sanitize(form.name),
          phone: sanitize(form.phone),
          placeOfComing: sanitize(form.placeOfComing),
          event: form.event,
          invitedBy: form.invitedBy,
          arrivalTime: form.arrivalDate
        })
      });
      const data = await res.json();
      if (!res.ok) { setApiError(data.error || 'Something went wrong.'); return; }
      setSubmitted(true);
    } catch {
      setApiError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container fade-in">
        <div className="ty-wrapper">
          <div className="ty-flowers"></div>
          <div className="ty-ring"></div>
          <h2 className="ty-title">JazakAllah Khair!</h2>
          <p className="ty-sub">We are overjoyed to have you celebrate with us</p>
          <div className="ty-divider">❧</div>
          <p className="ty-detail">
            Assalamu Alaikum <strong>{form.name}</strong>,<br /><br />
            Your attendance for <strong>{form.event}</strong> has been confirmed.<br />
            We are truly honoured to have you celebrate this blessed occasion with us.<br />
            May Allah bless this union with love, happiness, and barakah.
          </p>
          <p className="ty-dua">— Roshan & Ruksana — 🤲</p>
          <div className="ty-flowers" style={{ marginTop: 12 }}></div>
          {config.venueUrl && (
            <a className="venue-link" href={config.venueUrl} target="_blank" rel="noreferrer">
              View Venue Location
            </a>
          )}
          {config.redirectUrl && (
            <p className="redirect-note">Taking you to the wedding website in <strong>{countdown}s</strong>…</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div className="page">

        {/* Floral Banner */}
        <div className="floral-banner">
          <div className="floral-row">🌸 🌺 🌹 🌷 🌸 🌺 🌹 🌷 🌸</div>
          <div className="floral-title">You're Invited</div>
          <div className="floral-sub">Please fill in the form so we can arrange your stay</div>
          <div className="floral-row">🌷 🌹 🌺 🌸 🌷 🌹 🌺 🌸 🌷</div>
        </div>

        <div className="card">
          {apiError && <div className="alert alert-error">{apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>

            {/* 1. Event */}
            <div className="form-group">
              <label className="form-label">Select Event <span>*</span></label>
              <div className="event-grid">
                {EVENTS.map(ev => (
                  <div key={ev.name} className={`event-card ${form.event === ev.name ? 'selected' : ''}`} onClick={() => handleEventSelect(ev.name)}>
                    <div className="event-card-icon">{ev.icon}</div>
                    <div className="event-card-name">{ev.name}</div>
                    <div className="event-card-meta">
                      <span>📍 {ev.location}</span>
                      <span>🗓 {ev.date}</span>
                      <span>📅 {ev.days}</span>
                    </div>
                  </div>
                ))}
              </div>
              {errors.event && <p className="field-error">{errors.event}</p>}
            </div>

            {/* 2. Invited By */}
            <div className="form-group">
              <label className="form-label">🌺 Invited By <span>*</span></label>
              <div className="invited-grid">
                {HOSTS.map(host => (
                  <button key={host} type="button" className={`invited-btn ${form.invitedBy === host ? 'selected' : ''}`}
                    onClick={() => { setForm(f => ({ ...f, invitedBy: host })); setErrors(e => ({ ...e, invitedBy: '' })); }}>
                    {host}
                  </button>
                ))}
              </div>
              {errors.invitedBy && <p className="field-error">{errors.invitedBy}</p>}
            </div>

            <hr className="form-divider" />

            {/* 3. Full Name */}
            <div className="form-group">
              <label className="form-label">🌿 Full Name <span>*</span></label>
              <input type="text" className={`form-control ${errors.name ? 'error' : ''}`} placeholder="Enter your full name"
                value={form.name} maxLength={60}
                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }} />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            {/* 4. Phone */}
            <div className="form-group">
              <label className="form-label">📞 Phone Number <span>*</span></label>
              <input type="tel" className={`form-control ${errors.phone ? 'error' : ''}`} placeholder="e.g. +91 98765 43210"
                value={form.phone} maxLength={15}
                onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: '' })); }} />
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>

            {/* 5. Place of Coming */}
            <div className="form-group">
              <label className="form-label">📍 Place of Coming <span>*</span></label>
              <input type="text" className={`form-control ${errors.placeOfComing ? 'error' : ''}`} placeholder="e.g. Tirupati, Bangalore, Hyderabad"
                value={form.placeOfComing} maxLength={60}
                onChange={e => { setForm(f => ({ ...f, placeOfComing: e.target.value })); setErrors(er => ({ ...er, placeOfComing: '' })); }} />
              {errors.placeOfComing && <p className="field-error">{errors.placeOfComing}</p>}
            </div>

            <hr className="form-divider" />

            {/* 6. Arrival Date — only after event selected */}
            {form.event && (
              <div className="form-group">
                <label className="form-label">🗓 Arrival Date <span>*</span></label>
                <div className="date-grid">
                  {(EVENT_DATES[form.event] || []).map(d => (
                    <div key={d.value}
                      className={`date-card ${form.arrivalDate === d.value ? 'selected' : ''}`}
                      onClick={() => { setForm(f => ({ ...f, arrivalDate: d.value })); setErrors(er => ({ ...er, arrivalDate: '' })); }}>
                      <div className="date-card-label">{d.label}</div>
                      <div className="date-card-sub">{d.sub}</div>
                    </div>
                  ))}
                </div>
                {errors.arrivalDate && <p className="field-error">{errors.arrivalDate}</p>}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Submitting…</> : '🌹 Confirm Attendance'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
