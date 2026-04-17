import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Scores() {
  const [scores, setScores] = useState([])
  const [stagiaires, setStagiaires] = useState([])
  const [chargement, setChargement] = useState(false)
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  const getScores = async () => {
    try {
      if (user?.role === 'stagiaire') {
        const res = await axios.get(`http://localhost:5000/api/scores/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setScores(res.data)
      } else {
        const res = await axios.get('http://localhost:5000/api/scores', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setScores(res.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getStagiaires = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stagiaires', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStagiaires(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getScores()
    if (user?.role !== 'stagiaire') getStagiaires()
  }, [])

  const calculerScore = async (stagiaire_id, date_debut) => {
    setChargement(true)
    setMessage('')
    try {
      await axios.post('http://localhost:5000/api/scores/calculer',
        { stagiaire_id, date_debut },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Score calculé avec succès ✅')
      getScores()
    } catch (err) {
      console.log(err)
    } finally {
      setChargement(false)
    }
  }

  const getBadgeStyle = (badge) => {
    const styles = {
      'performant': 'bg-green-50 text-green-700',
      'moyen': 'bg-yellow-50 text-yellow-700',
      'en_difficulte': 'bg-red-50 text-red-700',
      'risque': 'bg-orange-50 text-orange-700'
    }
    const labels = {
      'performant': '🟢 Performant',
      'moyen': '🟡 Moyen',
      'en_difficulte': '🔴 En difficulté',
      'risque': '⚠️ Risque détecté'
    }
    return { style: styles[badge], label: labels[badge] }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Scores & Performance</h2>
          <p className="text-sm text-gray-500 mt-1">
            {user?.role === 'stagiaire' ? 'Mon historique de scores' : 'Scores de tous les stagiaires'}
          </p>
        </div>
      </div>

      {/* Calculer score (admin/tuteur) */}
      {(user?.role === 'admin' || user?.role === 'tuteur') && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Calculer le score d'un stagiaire</h3>
          <div className="flex gap-3 flex-wrap">
            {stagiaires.map(s => (
              <button
                key={s._id}
                onClick={() => calculerScore(s.user_id?._id, s.date_debut)}
                disabled={chargement}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm px-4 py-2 rounded-xl transition"
              >
                <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-medium">
                  {s.user_id?.prenom?.[0]}{s.user_id?.nom?.[0]}
                </div>
                {s.user_id?.prenom} {s.user_id?.nom}
              </button>
            ))}
          </div>
          {message && <p className="text-green-600 text-sm mt-3">{message}</p>}
          {chargement && <p className="text-gray-400 text-sm mt-3">Calcul en cours...</p>}
        </div>
      )}

      {/* Scores */}
      {scores.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm text-gray-400 text-center py-8">
            Aucun score calculé pour l'instant
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {scores.map((s, i) => {
            const { style, label } = getBadgeStyle(s.badge)
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`text-3xl font-semibold ${getScoreColor(s.score_total)}`}>
                      {s.score_total}/100
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${style}`}>
                      {label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(s.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                {/* Détail des scores */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Missions</p>
                    <p className="text-lg font-semibold text-gray-900">{s.score_missions}/40</p>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                      <div
                        className="bg-blue-500 rounded-full h-1"
                        style={{width: `${(s.score_missions/40)*100}%`}}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Deadlines</p>
                    <p className="text-lg font-semibold text-gray-900">{s.score_deadlines}/30</p>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                      <div
                        className="bg-green-500 rounded-full h-1"
                        style={{width: `${(s.score_deadlines/30)*100}%`}}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Rapports</p>
                    <p className="text-lg font-semibold text-gray-900">{s.score_rapports}/20</p>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                      <div
                        className="bg-purple-500 rounded-full h-1"
                        style={{width: `${(s.score_rapports/20)*100}%`}}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Tuteur</p>
                    <p className="text-lg font-semibold text-gray-900">{s.score_tuteur}/10</p>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                      <div
                        className="bg-orange-500 rounded-full h-1"
                        style={{width: `${(s.score_tuteur/10)*100}%`}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Scores