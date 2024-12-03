const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number },
  goal: { type: String },
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  progress: [{ 
    progressNotes: String, 
    lastUpdated: Date, 
    weight: Number, 
    bmi: Number 
  }],
},{timestamps:true});

module.exports = mongoose.model('Client', clientSchema);
