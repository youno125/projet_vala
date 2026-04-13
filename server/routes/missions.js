const express = require('express')
const router = express.Router()
const {
  creerMission,
  getMissions,
  updateStatut,
  supprimerMission
} = require('../controllers/missionController')
const { verifyToken, checkRole } = require('../middleware/auth')

router.post('/', verifyToken, checkRole(['admin', 'tuteur']), creerMission)
router.get('/', verifyToken, getMissions)
router.put('/:id/statut', verifyToken, updateStatut)
router.delete('/:id', verifyToken, checkRole(['admin', 'tuteur']), supprimerMission)

module.exports = router