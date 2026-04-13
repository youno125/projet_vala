const express = require('express')
const router = express.Router()
const {
  creerRapport,
  getRapports,
  getRapportsStagiaire,
  commenterRapport
} = require('../controllers/rapportController')
const { verifyToken, checkRole } = require('../middleware/auth')

router.post('/', verifyToken, checkRole(['stagiaire']), creerRapport)
router.get('/', verifyToken, getRapports)
router.get('/stagiaire/:id', verifyToken, getRapportsStagiaire)
router.put('/:id/commentaire', verifyToken, checkRole(['tuteur', 'admin']), commenterRapport)

module.exports = router