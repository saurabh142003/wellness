const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date },
  sessionType: { type: String, enum: ['Consultation', 'Follow-up'], required: true },
},{timestamps:true});

module.exports = mongoose.model('Session', sessionSchema);
