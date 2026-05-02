const express = require('express')
const router = express.Router()
const { getStats, getStatsStagiaire } = require('../controllers/dashboardController')
const { verifyToken, checkRole } = require('../middleware/auth')

router.get('/stats', verifyToken, checkRole(['admin', 'tuteur', 'directeur']), getStats)
router.get('/stats/stagiaire', verifyToken, checkRole(['stagiaire']), getStatsStagiaire)

module.exports = router