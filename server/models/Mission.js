const mongoose = require('mongoose')

const missionSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  difficulte: {
    type: String,
    enum: ['facile', 'moyen', 'difficile'],
    required: true
  },
  statut: {
    type: String,
    enum: ['a_faire', 'en_cours', 'en_retard', 'termine'],
    default: 'a_faire'
  },
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
  commentaire_validation: {
    type: String,
    default: ''
  }
}, { timestamps: true })

module.exports = mongoose.model('Mission', missionSchema)