const mongoose = require('mongoose')

const evaluationSchema = new mongoose.Schema({
  stagiaire_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tuteur_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['mi_stage', 'finale'],
    required: true
  },
  criteres: {
    competences_techniques: { type: Number, min: 1, max: 5, default: 3 },
    autonomie: { type: Number, min: 1, max: 5, default: 3 },
    qualite_travail: { type: Number, min: 1, max: 5, default: 3 },
    respect_delais: { type: Number, min: 1, max: 5, default: 3 },
    communication: { type: Number, min: 1, max: 5, default: 3 },
    ponctualite: { type: Number, min: 1, max: 5, default: 3 }
  },
  commentaire_global: {
    type: String,
    default: ''
  },
  auto_evaluation: {
    competences_techniques: { type: Number, min: 1, max: 5, default: 3 },
    autonomie: { type: Number, min: 1, max: 5, default: 3 },
    qualite_travail: { type: Number, min: 1, max: 5, default: 3 },
    respect_delais: { type: Number, min: 1, max: 5, default: 3 },
    communication: { type: Number, min: 1, max: 5, default: 3 },
    ponctualite: { type: Number, min: 1, max: 5, default: 3 }
  }
}, { timestamps: true })

module.exports = mongoose.model('Evaluation', evaluationSchema)