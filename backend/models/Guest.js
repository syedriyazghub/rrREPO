const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  event: { type: String, required: true, enum: ['Shukrana & Nikah', 'Valima'] },
  invitedBy: { type: String, required: true, enum: ['Riyaz', 'Vaseem', 'Ruksana'] },
  attendees: { type: Number, default: 1, min: 1 },
  arrivalTime: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Guest', guestSchema);
