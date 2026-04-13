const Mission = require('../models/Mission')

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
    const missions = await Mission.find()
      .populate('stagiaire_id', 'nom prenom email')
      .populate('tuteur_id', 'nom prenom')
      .sort({ createdAt: -1 })

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