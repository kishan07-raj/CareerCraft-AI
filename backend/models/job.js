const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: [{ type: String }], // Array of required skill names
  company: { type: String },
  location: { type: String },
  salary: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
