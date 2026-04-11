const mongoose = require('mongoose')

const rapportSchema = new mongoose.Schema({
  stagiaire_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  taches_realisees: {
    type: String,
    required: true
  },
  difficultes: {
    type: String,
    default: ''
  },
  taches_demain: {
    type: String,
    default: ''
  },
  humeur: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  commentaire_tuteur: {
    type: String,
    default: ''
  }
}, { timestamps: true })

module.exports = mongoose.model('Rapport', rapportSchema)