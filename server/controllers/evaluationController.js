const Evaluation = require('../models/Evaluation')
const Stagiaire = require('../models/Stagiaire')

exports.creerEvaluation = async (req, res) => {
  try {
    const {
      stagiaire_id,
      type,
      criteres,
      commentaire_global,
      auto_evaluation
    } = req.body

    // Vérifier que le tuteur évalue seulement ses stagiaires
    if (req.user.role === 'tuteur') {
      const stagiaire = await Stagiaire.findOne({
        user_id: stagiaire_id,
        tuteur_id: req.user.id
      })
      if (!stagiaire) {
        return res.status(403).json({ message: 'Accès refusé — ce stagiaire ne vous est pas assigné' })
      }
    }

    const evaluation = await Evaluation.create({
      stagiaire_id,
      tuteur_id: req.user.id,
      type,
      criteres,
      commentaire_global,
      auto_evaluation
    })

    res.status(201).json({ message: 'Évaluation créée avec succès', evaluation })

  } catch (error) {
    console.log('ERREUR:', error)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.getEvaluations = async (req, res) => {
  try {
    let evaluations

    if (req.user.role === 'tuteur') {
      // Tuteur voit seulement les évaluations de ses stagiaires
      const stagiaires = await Stagiaire.find({ tuteur_id: req.user.id })
      const ids = stagiaires.map(s => s.user_id)
      evaluations = await Evaluation.find({ stagiaire_id: { $in: ids } })
        .populate('stagiaire_id', 'nom prenom email')
        .populate('tuteur_id', 'nom prenom')
        .sort({ createdAt: -1 })

    } else {
      // Admin / Directeur voient tout
      evaluations = await Evaluation.find()
        .populate('stagiaire_id', 'nom prenom email')
        .populate('tuteur_id', 'nom prenom')
        .sort({ createdAt: -1 })
    }

    res.json(evaluations)

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.getEvaluationsStagiaire = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ stagiaire_id: req.params.id })
      .populate('tuteur_id', 'nom prenom')
      .sort({ createdAt: -1 })

    res.json(evaluations)

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}