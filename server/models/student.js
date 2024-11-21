const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  id: String,
  role: { type: String },
  batch: { type: String },
  desig: String,
  photo: String, 
  resetToken: String,
  resetTokenExpiry: Date,
});

const StudentModel = mongoose.model('student', StudentSchema);
module.exports = StudentModel;
