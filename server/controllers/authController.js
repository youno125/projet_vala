const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// REGISTER
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, role } = req.body

    // Vérifier si l'email existe déjà
    const userExiste = await User.findOne({ email })
    if (userExiste) {
      return res.status(400).json({ message: 'Email déjà utilisé' })
    }

    // Hasher le mot de passe
    const hash = await bcrypt.hash(mot_de_passe, 10)

    // Créer l'utilisateur
    const user = await User.create({
      nom,
      prenom,
      email,
      mot_de_passe: hash,
      role
    })

    res.status(201).json({ message: 'Utilisateur créé avec succès', user })

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' })
    }

    // Vérifier le mot de passe
    const valide = await bcrypt.compare(mot_de_passe, user.mot_de_passe)
    if (!valide) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' })
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}