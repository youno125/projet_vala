const Groq = require('groq-sdk')
const Rapport = require('../models/Rapport')
const Score = require('../models/Score')
const Feedback = require('../models/Feedback')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

exports.genererFeedback = async (req, res) => {
  try {
    const { stagiaire_id, semaine } = req.body

    const rapports = await Rapport.find({ stagiaire_id })
      .sort({ date: -1 })
      .limit(5)
      .populate('stagiaire_id', 'nom prenom')

    const dernierScore = await Score.findOne({ stagiaire_id })
      .sort({ date: -1 })

    if (rapports.length === 0) {
      return res.status(400).json({ message: 'Aucun rapport trouvé pour ce stagiaire' })
    }

    const nomStagiaire = rapports[0]?.stagiaire_id?.prenom + ' ' + rapports[0]?.stagiaire_id?.nom

    const rapportsTexte = rapports.map((r, i) => `
Jour ${i + 1}:
- Tâches réalisées: ${r.taches_realisees}
- Difficultés: ${r.difficultes || 'Aucune'}
- Prévisions: ${r.taches_demain || 'Non renseigné'}
- Humeur: ${r.humeur}/5
    `).join('\n')

    const scoreTexte = dernierScore
      ? `Score actuel: ${dernierScore.score_total}/100 (Missions: ${dernierScore.score_missions}/40, Deadlines: ${dernierScore.score_deadlines}/30, Rapports: ${dernierScore.score_rapports}/20, Tuteur: ${dernierScore.score_tuteur}/10)`
      : 'Score non encore calculé'

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Tu es un assistant RH bienveillant qui analyse les performances des stagiaires. 
          Tu dois répondre UNIQUEMENT en JSON valide avec cette structure exacte:
          {
            "resume": "résumé de la semaine en 2-3 phrases",
            "points_forts": "points forts identifiés en 2-3 phrases",
            "conseils": "conseils d'amélioration concrets en 2-3 phrases",
            "explication_score": "explication du score en 1-2 phrases",
            "alerte": "alerte si problème détecté, sinon chaîne vide"
          }`
        },
        {
          role: 'user',
          content: `Analyse les performances du stagiaire ${nomStagiaire}.
          
${scoreTexte}

Rapports récents:
${rapportsTexte}

Génère un feedback professionnel et bienveillant en français.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const responseText = completion.choices[0]?.message?.content
    let feedbackData

    try {
      feedbackData = JSON.parse(responseText)
    } catch {
      feedbackData = {
        resume: responseText,
        points_forts: '',
        conseils: '',
        explication_score: '',
        alerte: ''
      }
    }

    const feedback = await Feedback.create({
      stagiaire_id,
      semaine: semaine || new Date().toISOString().split('T')[0],
      resume: feedbackData.resume,
      points_forts: feedbackData.points_forts,
      conseils: feedbackData.conseils,
      explication_score: feedbackData.explication_score,
      alerte: feedbackData.alerte
    })

    res.json({ message: 'Feedback généré avec succès', feedback })

  } catch (error) {
    console.log('ERREUR IA:', error)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ stagiaire_id: req.params.id })
      .sort({ createdAt: -1 })

    res.json(feedbacks)

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}