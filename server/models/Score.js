const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
  stagiaire_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  score_total: {
    type: Number,
    default: 0
  },
  score_missions: {
    type: Number,
    default: 0
  },
  score_deadlines: {
    type: Number,
    default: 0
  },
  score_rapports: {
    type: Number,
    default: 0
  },
  score_tuteur: {
    type: Number,
    default: 0
  },
  badge: {
    type: String,
    enum: ['performant', 'moyen', 'en_difficulte', 'risque'],
    default: 'moyen'
  }
}, { timestamps: true })

module.exports = mongoose.model('Score', scoreSchema)