const Evaluation = require('../models/Evaluation')

exports.creerEvaluation = async (req, res) => {
  try {
    const {
      stagiaire_id,
      type,
      criteres,
      commentaire_global,
      auto_evaluation
    } = req.body

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
    const evaluations = await Evaluation.find()
      .populate('stagiaire_id', 'nom prenom email')
      .populate('tuteur_id', 'nom prenom')
      .sort({ createdAt: -1 })

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