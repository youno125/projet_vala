const Rapport = require('../models/Rapport')

exports.creerRapport = async (req, res) => {
  try {
    const { taches_realisees, difficultes, taches_demain, humeur } = req.body

    const aujourd_hui = new Date()
    aujourd_hui.setHours(0, 0, 0, 0)
    const demain = new Date(aujourd_hui)
    demain.setDate(demain.getDate() + 1)

    const rapportExiste = await Rapport.findOne({
      stagiaire_id: req.user.id,
      date: { $gte: aujourd_hui, $lt: demain }
    })

    if (rapportExiste) {
      return res.status(400).json({ message: "Vous avez déjà envoyé un rapport aujourd'hui" })
    }

    const rapport = await Rapport.create({
      stagiaire_id: req.user.id,
      taches_realisees,
      difficultes,
      taches_demain,
      humeur
    })

    res.status(201).json({ message: 'Rapport envoyé avec succès', rapport })

  } catch (error) {
    console.log('ERREUR:', error)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.getRapports = async (req, res) => {
  try {
    let rapports

    if (req.user.role === 'stagiaire') {
      rapports = await Rapport.find({ stagiaire_id: req.user.id })
        .populate('stagiaire_id', 'nom prenom email')
        .sort({ date: -1 })
    } else {
      rapports = await Rapport.find()
        .populate('stagiaire_id', 'nom prenom email')
        .sort({ date: -1 })
    }

    res.json(rapports)

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.getRapportsStagiaire = async (req, res) => {
  try {
    const rapports = await Rapport.find({ stagiaire_id: req.params.id })
      .sort({ date: -1 })

    res.json(rapports)

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.commenterRapport = async (req, res) => {
  try {
    const rapport = await Rapport.findByIdAndUpdate(
      req.params.id,
      { commentaire_tuteur: req.body.commentaire_tuteur },
      { new: true }
    )

    if (!rapport) {
      return res.status(404).json({ message: 'Rapport non trouvé' })
    }

    res.json({ message: 'Commentaire ajouté', rapport })

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}