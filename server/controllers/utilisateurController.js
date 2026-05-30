const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { envoyerEmailCreationCompteStaff } = require('../emailService')

exports.getUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await User.find()
      .select('-mot_de_passe')
      .sort({ createdAt: -1 })
    res.json(utilisateurs)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.creerUtilisateur = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, role } = req.body

    const userExiste = await User.findOne({ email })
    if (userExiste) {
      return res.status(400).json({ message: 'Email déjà utilisé' })
    }

    const hash = await bcrypt.hash(mot_de_passe, 10)
    const user = await User.create({
      nom, prenom, email,
      mot_de_passe: hash,
      role
    })

    await envoyerEmailCreationCompteStaff(prenom, email, mot_de_passe, role)

    const userSansMotDePasse = await User.findById(user._id).select('-mot_de_passe')
    res.status(201).json({ message: 'Utilisateur créé avec succès', user: userSansMotDePasse })

  } catch (error) {
    console.log('ERREUR:', error)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.toggleActif = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }
    user.actif = !user.actif
    await user.save()
    res.json({ message: `Utilisateur ${user.actif ? 'activé' : 'désactivé'}`, user })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.supprimerUtilisateur = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' })

    if (user.role === 'stagiaire') {
      const Stagiaire = require('../models/Stagiaire')
      const Rapport = require('../models/Rapport')
      const Mission = require('../models/Mission')
      const Score = require('../models/Score')
      const Evaluation = require('../models/Evaluation')
      const Feedback = require('../models/Feedback')

      await Stagiaire.deleteOne({ user_id: user._id })
      await Rapport.deleteMany({ stagiaire_id: user._id })
      await Mission.deleteMany({ stagiaire_id: user._id })
      await Score.deleteMany({ stagiaire_id: user._id })
      await Evaluation.deleteMany({ stagiaire_id: user._id })
      await Feedback.deleteMany({ stagiaire_id: user._id })
    }

    res.json({ message: 'Utilisateur supprimé' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}