const express = require('express')
const router = express.Router()
const { genererFeedback, getFeedbacks } = require('../controllers/iaController')
const { verifyToken, checkRole } = require('../middleware/auth')

router.post('/feedback', verifyToken, checkRole(['admin', 'tuteur']), genererFeedback)
router.get('/feedback/:id', verifyToken, getFeedbacks)

module.exports = router