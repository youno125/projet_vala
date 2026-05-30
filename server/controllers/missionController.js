const Mission = require('../models/Mission')
const Stagiaire = require('../models/Stagiaire')

exports.creerMission = async (req, res) => {
  try {
    const {
      titre, description, deadline,
      difficulte, stagiaire_id
    } = req.body

    const mission = await Mission.create({
      titre,
      description,
      deadline,
      difficulte,
      stagiaire_id,
      tuteur_id: req.user.id
    })

    res.status(201).json({ message: 'Mission créée avec succès', mission })

  } catch (error) {
    console.log('ERREUR:', error)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.getMissions = async (req, res) => {
  try {
    let missions

    if (req.user.role === 'stagiaire') {
      // Stagiaire voit seulement ses missions
      missions = await Mission.find({ stagiaire_id: req.user.id })
        .populate('stagiaire_id', 'nom prenom email')
        .populate('tuteur_id', 'nom prenom')
        .sort({ createdAt: -1 })

    } else if (req.user.role === 'tuteur') {
      // Tuteur voit seulement les missions de ses stagiaires
      const stagiaires = await Stagiaire.find({ tuteur_id: req.user.id })
      const ids = stagiaires.map(s => s.user_id)
      missions = await Mission.find({ stagiaire_id: { $in: ids } })
        .populate('stagiaire_id', 'nom prenom email')
        .populate('tuteur_id', 'nom prenom')
        .sort({ createdAt: -1 })

    } else {
      // Admin / Directeur voient tout
      missions = await Mission.find()
        .populate('stagiaire_id', 'nom prenom email')
        .populate('tuteur_id', 'nom prenom')
        .sort({ createdAt: -1 })
    }

    res.json(missions)

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.updateStatut = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndUpdate(
      req.params.id,
      { statut: req.body.statut },
      { new: true }
    )

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' })
    }

    res.json({ message: 'Statut mis à jour', mission })

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.supprimerMission = async (req, res) => {
  try {
    await Mission.findByIdAndDelete(req.params.id)
    res.json({ message: 'Mission supprimée' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}