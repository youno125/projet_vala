const express = require('express')
const router = express.Router()
const {
  creerStagiaire,
  getStagiaires,
  getStagiaire,
  supprimerStagiaire,
  modifierStagiaire
} = require('../controllers/stagiaireController')
const { verifyToken, checkRole } = require('../middleware/auth')

router.post('/', verifyToken, checkRole(['admin', 'tuteur']), creerStagiaire)
router.get('/', verifyToken, getStagiaires)
router.get('/:id', verifyToken, getStagiaire)
router.put('/:id', verifyToken, checkRole(['admin', 'tuteur']), modifierStagiaire)
router.delete('/:id', verifyToken, checkRole(['admin']), supprimerStagiaire)

module.exports = router