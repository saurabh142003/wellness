const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'coach' },
  specialization: { type: String }, // Only for coaches
},{timestamps:true});
module.exports = mongoose.model('User',userSchema)
