const Mission = require('../models/Mission')
const Rapport = require('../models/Rapport')
const Evaluation = require('../models/Evaluation')
const Score = require('../models/Score')
const Stagiaire = require('../models/Stagiaire')

const calculerScore = async (stagiaire_id, date_debut) => {

  console.log('=== CALCUL SCORE ===')
  console.log('STAGIAIRE ID:', stagiaire_id)
  console.log('TYPE:', typeof stagiaire_id)

  // 1. Score missions (40 pts)
  const totalMissions = await Mission.countDocuments({ stagiaire_id })
  const missionsTerminees = await Mission.countDocuments({ stagiaire_id, statut: 'termine' })
  console.log('TOTAL MISSIONS:', totalMissions)
  const scoreMissions = totalMissions > 0 ? (missionsTerminees / totalMissions) * 40 : 0

  // 2. Score deadlines (30 pts)
  const missionsRendues = await Mission.find({ stagiaire_id, statut: 'termine' })
  let missionsATemps = 0
  missionsRendues.forEach(m => {
    if (new Date(m.updatedAt) <= new Date(m.deadline)) {
      missionsATemps++
    }
  })
  const scoreDeadlines = missionsTerminees > 0 ? (missionsATemps / missionsTerminees) * 30 : 0

  // 3. Score rapports (20 pts)
  const debut = new Date(date_debut || Date.now() - 30 * 24 * 60 * 60 * 1000)
  const maintenant = new Date()
  let joursOuvres = 0
  let current = new Date(debut)
  while (current <= maintenant) {
    const jour = current.getDay()
    if (jour !== 0 && jour !== 6) joursOuvres++
    current.setDate(current.getDate() + 1)
  }
  if (joursOuvres === 0) joursOuvres = 1  // ← minimum 1 jour ouvré
  const totalRapports = await Rapport.countDocuments({ stagiaire_id })
  console.log('TOTAL RAPPORTS:', totalRapports)
  console.log('JOURS OUVRES:', joursOuvres)
  const scoreRapports = joursOuvres > 0 ? Math.min((totalRapports / joursOuvres) * 20, 20) : 0

  // 4. Score tuteur (10 pts)
  const evaluations = await Evaluation.find({ stagiaire_id })
  let scoreTuteur = 0
  if (evaluations.length > 0) {
    const derniereEval = evaluations[evaluations.length - 1]
    const criteres = derniereEval.criteres
    const moyenne = (
      criteres.competences_techniques +
      criteres.autonomie +
      criteres.qualite_travail +
      criteres.respect_delais +
      criteres.communication +
      criteres.ponctualite
    ) / 6
    scoreTuteur = (moyenne / 5) * 10
  }

  const scoreTotal = Math.round(scoreMissions + scoreDeadlines + scoreRapports + scoreTuteur)
  console.log('SCORE FINAL:', scoreTotal)
  console.log('===================')

  let badge = 'moyen'
  if (scoreTotal >= 70) badge = 'performant'
  else if (scoreTotal < 40) badge = 'en_difficulte'

  const derniersScores = await Score.find({ stagiaire_id })
    .sort({ date: -1 }).limit(3)

  if (derniersScores.length === 3) {
    const tendance = derniersScores[0].score_total - derniersScores[2].score_total
    if (tendance < -10) badge = 'risque'
  }

  return {
    score_total: scoreTotal,
    score_missions: Math.round(scoreMissions),
    score_deadlines: Math.round(scoreDeadlines),
    score_rapports: Math.round(scoreRapports),
    score_tuteur: Math.round(scoreTuteur),
    badge
  }
}

exports.calculerEtSauvegarderScore = async (req, res) => {
  try {
    const { stagiaire_id, date_debut } = req.body
    const scores = await calculerScore(stagiaire_id, date_debut)
    const score = await Score.create({ stagiaire_id, ...scores })
    res.json({ message: 'Score calculé', score })
  } catch (error) {
    console.log('ERREUR:', error)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.getScoreStagiaire = async (req, res) => {
  try {
    const scores = await Score.find({ stagiaire_id: req.params.id })
      .populate('stagiaire_id', 'prenom nom email')
      .sort({ date: -1 })
      .limit(30)
    res.json(scores)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.getTousLesScores = async (req, res) => {
  try {
    let tousScores

    if (req.user.role === 'tuteur') {
      const stagiaires = await Stagiaire.find({ tuteur_id: req.user.id })
      const ids = stagiaires.map(s => s.user_id)
      tousScores = await Score.find({ stagiaire_id: { $in: ids } })
        .populate('stagiaire_id', 'prenom nom email')
        .sort({ score_total: -1, date: -1 })
    } else {
      tousScores = await Score.find()
        .populate('stagiaire_id', 'prenom nom email')
        .sort({ score_total: -1, date: -1 })
    }

    const vus = new Set()
    const dernierParStagiaire = tousScores.filter(s => {
      const id = s.stagiaire_id?._id?.toString() || s.stagiaire_id?.toString()
      if (!id || vus.has(id)) return false
      vus.add(id)
      return true
    })

    res.json(dernierParStagiaire)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}