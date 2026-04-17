const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const stagiaireRoutes = require('./routes/stagiaires')
const missionRoutes = require('./routes/missions')
const rapportRoutes = require('./routes/rapports')
const scoreRoutes = require('./routes/scores')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.log('❌ Erreur MongoDB:', err))

app.use('/api/auth', authRoutes)
app.use('/api/stagiaires', stagiaireRoutes)
app.use('/api/missions', missionRoutes)
app.use('/api/rapports', rapportRoutes)
app.use('/api/scores', scoreRoutes)

app.get('/', (req, res) => {
  res.json({ message: '✅ API SIPMS opérationnelle' })
})

app.listen(process.env.PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${process.env.PORT}`)
})