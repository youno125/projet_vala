const express = require('express')
const router = express.Router()
const {
  calculerEtSauvegarderScore,
  getScoreStagiaire,
  getTousLesScores
} = require('../controllers/scoringController')
const { verifyToken, checkRole } = require('../middleware/auth')

router.post('/calculer', verifyToken, checkRole(['admin', 'tuteur']), calculerEtSauvegarderScore)
router.get('/', verifyToken, checkRole(['admin', 'tuteur', 'directeur']), getTousLesScores)
router.get('/:id', verifyToken, getScoreStagiaire)

module.exports = router