const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  stagiaire_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  semaine: {
    type: String,
    required: true
  },
  resume: {
    type: String,
    default: ''
  },
  points_forts: {
    type: String,
    default: ''
  },
  conseils: {
    type: String,
    default: ''
  },
  explication_score: {
    type: String,
    default: ''
  },
  alerte: {
    type: String,
    default: ''
  }
}, { timestamps: true })

module.exports = mongoose.model('Feedback', feedbackSchema)