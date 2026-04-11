const mongoose = require('mongoose')

const stagiaireSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ecole: {
    type: String,
    required: true
  },
  niveau: {
    type: String,
    enum: ['Bac+1', 'Bac+2', 'Bac+3', 'Bac+4', 'Bac+5'],
    required: true
  },
  departement: {
    type: String,
    required: true
  },
  tuteur_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date_debut: {
    type: Date,
    required: true
  },
  date_fin: {
    type: Date,
    required: true
  },
  convention_pdf: {
    type: String,
    default: ''
  }
}, { timestamps: true })

module.exports = mongoose.model('Stagiaire', stagiaireSchema)