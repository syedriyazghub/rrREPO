require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/guests', rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { error: 'Too many requests, please try again later.' } }));
app.use('/api/guests', require('./routes/guests'));

// Build PIN map: { pin: [name1, name2, ...] }
function getPinMap() {
  const map = {};
  (process.env.ADMIN_PINS || '').split(',').forEach(entry => {
    const [p, name] = entry.split(':');
    if (!p || !name) return;
    const key = p.trim();
    if (!map[key]) map[key] = [];
    map[key].push(name.trim());
  });
  return map;
}

// Public config — exposes redirect/venue URLs to frontend
app.get('/api/config', (req, res) => {
  res.json({
    redirectUrl: process.env.REDIRECT_URL || '',
    venueUrl: process.env.VENUE_URL || ''
  });
});

app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  if (!pin) return res.status(400).json({ error: 'PIN required.' });

  const map = getPinMap();
  const names = map[pin.trim()];
  if (!names || names.length === 0) return res.status(401).json({ error: 'Invalid PIN.' });

  // Return all names associated with this PIN
  res.json({ success: true, adminNames: names });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));
  })
  .catch(err => { console.error('MongoDB connection error:', err); process.exit(1); });
