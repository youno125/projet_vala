const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true },
  role: {
    type: String,
    enum: ['stagiaire', 'tuteur', 'admin', 'directeur'],
    required: true
  },
  actif: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)