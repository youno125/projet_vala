const express = require('express')
const router = express.Router()
const { register, login, changerMotDePasse } = require('../controllers/authController')
const { verifyToken } = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.put('/changer-mot-de-passe', verifyToken, changerMotDePasse)

module.exports = router