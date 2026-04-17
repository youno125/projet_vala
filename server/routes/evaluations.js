const express = require('express')
const router = express.Router()
const {
  creerEvaluation,
  getEvaluations,
  getEvaluationsStagiaire
} = require('../controllers/evaluationController')
const { verifyToken, checkRole } = require('../middleware/auth')

router.post('/', verifyToken, checkRole(['admin', 'tuteur']), creerEvaluation)
router.get('/', verifyToken, checkRole(['admin', 'tuteur', 'directeur']), getEvaluations)
router.get('/:id', verifyToken, getEvaluationsStagiaire)

module.exports = router