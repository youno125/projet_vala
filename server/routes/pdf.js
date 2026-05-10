const express = require('express')
const router = express.Router()
const { genererAttestation } = require('../controllers/pdfController')
const { verifyToken, checkRole } = require('../middleware/auth')

router.get('/attestation/:stagiaire_id', verifyToken, checkRole(['admin', 'tuteur']), genererAttestation)

module.exports = router