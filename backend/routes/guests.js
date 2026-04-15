const router = require('express').Router();
const Guest = require('../models/Guest');

// Submit RSVP
router.post('/', async (req, res) => {
  try {
    const { name, event, invitedBy, attendees, arrivalTime } = req.body;
    if (!name || !event || !invitedBy || !arrivalTime) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const duplicate = await Guest.findOne({ name: new RegExp(`^${name.trim()}$`, 'i'), event });
    if (duplicate) return res.status(409).json({ error: 'You have already submitted a response for this event.' });

    const guest = await Guest.create({ name: name.trim(), event, invitedBy, attendees: attendees || 1, arrivalTime });
    res.status(201).json(guest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get guests — invitedBy can be comma-separated for multi-admin scope
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.event) filter.event = req.query.event;
    if (req.query.invitedBy) {
      const raw = Array.isArray(req.query.invitedBy) ? req.query.invitedBy[0] : req.query.invitedBy;
      const names = raw.split(',').map(n => n.trim()).filter(Boolean);
      filter.invitedBy = names.length === 1 ? names[0] : { $in: names };
    }
    if (req.query.search) filter.name = new RegExp(req.query.search, 'i');

    const guests = await Guest.find(filter).sort({ createdAt: -1 });
    res.json(guests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get stats — scoped to invitedBy names
router.get('/stats', async (req, res) => {
  try {
    const match = {};
    if (req.query.invitedBy) {
      const raw = Array.isArray(req.query.invitedBy) ? req.query.invitedBy[0] : req.query.invitedBy;
      const names = raw.split(',').map(n => n.trim()).filter(Boolean);
      match.invitedBy = names.length === 1 ? names[0] : { $in: names };
    }

    const [byEvent, byInvitedBy, total] = await Promise.all([
      Guest.aggregate([{ $match: match }, { $group: { _id: '$event', count: { $sum: '$attendees' } } }]),
      Guest.aggregate([{ $match: match }, { $group: { _id: '$invitedBy', count: { $sum: '$attendees' } } }]),
      Guest.aggregate([{ $match: match }, { $group: { _id: null, total: { $sum: '$attendees' } } }])
    ]);
    res.json({ byEvent, byInvitedBy, total: total[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a guest
router.delete('/:id', async (req, res) => {
  try {
    await Guest.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
