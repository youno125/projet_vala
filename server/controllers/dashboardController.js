const User = require('../models/User')
const Mission = require('../models/Mission')
const Rapport = require('../models/Rapport')
const Score = require('../models/Score')
const Stagiaire = require('../models/Stagiaire')

exports.getStats = async (req, res) => {
  try {
    const aujourd_hui = new Date()
    aujourd_hui.setHours(0, 0, 0, 0)
    const demain = new Date(aujourd_hui)
    demain.setDate(demain.getDate() + 1)

    let totalStagiaires, missionsEnCours, rapportsAujourdhui, scoreMoyen, stagiairesRecents

    if (req.user.role === 'tuteur') {
      // Tuteur voit seulement ses stagiaires
      const mesStagiaires = await Stagiaire.find({ tuteur_id: req.user.id })
      const ids = mesStagiaires.map(s => s.user_id)

      totalStagiaires = mesStagiaires.length
      missionsEnCours = await Mission.countDocuments({ stagiaire_id: { $in: ids }, statut: 'en_cours' })
      rapportsAujourdhui = await Rapport.countDocuments({
        stagiaire_id: { $in: ids },
        date: { $gte: aujourd_hui, $lt: demain }
      })

      // Score moyen de ses stagiaires
      const scores = await Score.aggregate([
        { $match: { stagiaire_id: { $in: ids } } },
        { $sort: { date: -1 } },
        { $group: { _id: '$stagiaire_id', dernierScore: { $first: '$score_total' } } },
        { $group: { _id: null, moyenne: { $avg: '$dernierScore' } } }
      ])
      scoreMoyen = scores.length > 0 ? Math.round(scores[0].moyenne) : 0

      stagiairesRecents = await Stagiaire.find({ tuteur_id: req.user.id })
        .populate('user_id', 'nom prenom email')
        .populate('tuteur_id', 'nom prenom')
        .sort({ createdAt: -1 })
        .limit(5)

    } else {
      // Admin / Directeur voient tout
      totalStagiaires = await Stagiaire.countDocuments()
      missionsEnCours = await Mission.countDocuments({ statut: 'en_cours' })
      rapportsAujourdhui = await Rapport.countDocuments({
        date: { $gte: aujourd_hui, $lt: demain }
      })

      const scores = await Score.aggregate([
        { $sort: { date: -1 } },
        { $group: { _id: '$stagiaire_id', dernierScore: { $first: '$score_total' } } },
        { $group: { _id: null, moyenne: { $avg: '$dernierScore' } } }
      ])
      scoreMoyen = scores.length > 0 ? Math.round(scores[0].moyenne) : 0

      stagiairesRecents = await Stagiaire.find()
        .populate('user_id', 'nom prenom email')
        .populate('tuteur_id', 'nom prenom')
        .sort({ createdAt: -1 })
        .limit(5)
    }

    // Derniers scores pour chaque stagiaire
    const stagiairesAvecScores = await Promise.all(
      stagiairesRecents.map(async (s) => {
        const dernierScore = await Score.findOne({ stagiaire_id: s.user_id?._id })
          .sort({ date: -1 })
        return {
          ...s.toObject(),
          score: dernierScore?.score_total || 0,
          badge: dernierScore?.badge || 'moyen'
        }
      })
    )

    res.json({
      totalStagiaires,
      missionsEnCours,
      rapportsAujourdhui,
      scoreMoyen,
      stagiairesRecents: stagiairesAvecScores
    })

  } catch (error) {
    console.log('ERREUR:', error)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.getStatsStagiaire = async (req, res) => {
  try {
    const stagiaire_id = req.user.id

    const mesMissions = await Mission.countDocuments({ stagiaire_id })
    const missionsTerminees = await Mission.countDocuments({ stagiaire_id, statut: 'termine' })
    const mesRapports = await Rapport.countDocuments({ stagiaire_id })
    const dernierScore = await Score.findOne({ stagiaire_id }).sort({ date: -1 })

    res.json({
      mesMissions,
      missionsTerminees,
      mesRapports,
      monScore: dernierScore?.score_total || 0,
      badge: dernierScore?.badge || 'moyen'
    })

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}