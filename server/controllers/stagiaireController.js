const User = require('../models/User')
const Stagiaire = require('../models/Stagiaire')
const bcrypt = require('bcryptjs')
const { envoyerEmailCreationCompte } = require('../emailService')

// Créer un stagiaire
exports.creerStagiaire = async (req, res) => {
  try {
    const {
      nom, prenom, email, mot_de_passe,
      ecole, niveau, departement,
      tuteur_id, date_debut, date_fin
    } = req.body

    const hash = await bcrypt.hash(mot_de_passe, 10)
    const user = await User.create({
      nom, prenom, email,
      mot_de_passe: hash,
      role: 'stagiaire'
    })

    const stagiaire = await Stagiaire.create({
      user_id: user._id,
      ecole, niveau, departement,
      tuteur_id, date_debut, date_fin
    })

    await envoyerEmailCreationCompte(prenom, email, mot_de_passe)

    res.status(201).json({ message: 'Stagiaire créé avec succès', user, stagiaire })

  } catch (error) {
    console.log('ERREUR:', error)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.getStagiaires = async (req, res) => {
  try {
    let stagiaires

    if (req.user.role === 'tuteur') {
      // Tuteur voit seulement ses stagiaires
      stagiaires = await Stagiaire.find({ tuteur_id: req.user.id })
        .populate('user_id', 'nom prenom email actif')
        .populate('tuteur_id', 'nom prenom')
    } else {
      // Admin / Directeur voient tout
      stagiaires = await Stagiaire.find()
        .populate('user_id', 'nom prenom email actif')
        .populate('tuteur_id', 'nom prenom')
    }

    res.json(stagiaires)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.getStagiaire = async (req, res) => {
  try {
    const stagiaire = await Stagiaire.findById(req.params.id)
      .populate('user_id', 'nom prenom email')
      .populate('tuteur_id', 'nom prenom')
    if (!stagiaire) return res.status(404).json({ message: 'Stagiaire non trouvé' })
    res.json(stagiaire)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.modifierStagiaire = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, ecole, niveau, departement, tuteur_id, date_debut, date_fin } = req.body

    const stagiaire = await Stagiaire.findByIdAndUpdate(
      req.params.id,
      { ecole, niveau, departement, tuteur_id, date_debut, date_fin },
      { new: true }
    )
    if (!stagiaire) return res.status(404).json({ message: 'Stagiaire non trouvé' })

    const userUpdate = { nom, prenom, email }
    if (mot_de_passe && mot_de_passe.trim() !== '') {
      userUpdate.mot_de_passe = await bcrypt.hash(mot_de_passe, 10)
    }
    await User.findByIdAndUpdate(stagiaire.user_id, userUpdate)

    res.json({ message: 'Stagiaire modifié avec succès', stagiaire })
  } catch (error) {
    console.log('ERREUR:', error)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.supprimerStagiaire = async (req, res) => {
  try {
    const stagiaire = await Stagiaire.findByIdAndDelete(req.params.id)
    if (!stagiaire) return res.status(404).json({ message: 'Stagiaire non trouvé' })

    const stagiaire_id = stagiaire.user_id
    await User.findByIdAndDelete(stagiaire_id)

    const Rapport = require('../models/Rapport')
    const Mission = require('../models/Mission')
    const Score = require('../models/Score')
    const Evaluation = require('../models/Evaluation')
    const Feedback = require('../models/Feedback')

    await Rapport.deleteMany({ stagiaire_id })
    await Mission.deleteMany({ stagiaire_id })
    await Score.deleteMany({ stagiaire_id })
    await Evaluation.deleteMany({ stagiaire_id })
    await Feedback.deleteMany({ stagiaire_id })

    res.json({ message: 'Stagiaire et toutes ses données supprimés avec succès' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}