const express = require('express')
const router = express.Router()
const {
  getUtilisateurs,
  creerUtilisateur,
  toggleActif,
  supprimerUtilisateur
} = require('../controllers/utilisateurController')
const { verifyToken, checkRole } = require('../middleware/auth')

router.get('/', verifyToken, checkRole(['admin', 'directeur']), getUtilisateurs)
router.post('/', verifyToken, checkRole(['admin', 'directeur']), creerUtilisateur)
router.put('/:id/toggle', verifyToken, checkRole(['admin']), toggleActif)
router.delete('/:id', verifyToken, checkRole(['admin']), supprimerUtilisateur)

module.exports = router