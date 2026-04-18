import React, { useState, useEffect } from 'react'
import axios from 'axios'

function FeedbackIA() {
  const [feedbacks, setFeedbacks] = useState([])
  const [stagiaires, setStagiaires] = useState([])
  const [chargement, setChargement] = useState(false)
  const [message, setMessage] = useState('')
  const [stagiaireSelectionne, setStagiaireSelectionne] = useState('')

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

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

  const getFeedbacks = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/ia/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFeedbacks(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (user?.role !== 'stagiaire') {
      getStagiaires()
    } else {
      getFeedbacks(user.id)
    }
  }, [])

  const handleGenerer = async (stagiaireUserId) => {
    setChargement(true)
    setMessage('')
    try {
      await axios.post('http://localhost:5000/api/ia/feedback',
        { stagiaire_id: stagiaireUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Feedback généré avec succès ✅')
      getFeedbacks(stagiaireUserId)
      setStagiaireSelectionne(stagiaireUserId)
    } catch (err) {
      setMessage('Erreur lors de la génération ❌')
      console.log(err)
    } finally {
      setChargement(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Module IA — Feedback</h2>
        <p className="text-sm text-gray-500 mt-1">
          Analyse automatique des performances par intelligence artificielle
        </p>
      </div>

      {/* Section admin/tuteur */}
      {(user?.role === 'admin' || user?.role === 'tuteur') && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Générer un feedback IA pour un stagiaire
          </h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {stagiaires.map(s => (
              <button
                key={s._id}
                onClick={() => {
                  handleGenerer(s.user_id?._id)
                }}
                disabled={chargement}
                className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm px-4 py-2 rounded-xl transition"
              >
                <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-xs font-medium">
                  {s.user_id?.prenom?.[0]}{s.user_id?.nom?.[0]}
                </div>
                {s.user_id?.prenom} {s.user_id?.nom}
              </button>
            ))}
          </div>
          {chargement && (
            <div className="flex items-center gap-2 text-purple-600 text-sm">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              L'IA analyse les données...
            </div>
          )}
          {message && <p className="text-sm mt-2 text-green-600">{message}</p>}
        </div>
      )}

      {/* Feedbacks */}
      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-400 text-center py-8">
              {user?.role === 'stagiaire'
                ? 'Aucun feedback IA généré pour vous encore'
                : 'Cliquez sur un stagiaire pour générer son feedback'}
            </p>
          </div>
        ) : (
          feedbacks.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <p className="text-sm font-medium text-gray-900">Feedback IA</p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(f.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="space-y-4">
                {f.resume && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-blue-600 mb-1">📋 Résumé</p>
                    <p className="text-sm text-blue-900">{f.resume}</p>
                  </div>
                )}

                {f.points_forts && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-green-600 mb-1">💪 Points forts</p>
                    <p className="text-sm text-green-900">{f.points_forts}</p>
                  </div>
                )}

                {f.conseils && (
                  <div className="bg-orange-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-orange-600 mb-1">💡 Conseils</p>
                    <p className="text-sm text-orange-900">{f.conseils}</p>
                  </div>
                )}

                {f.explication_score && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-purple-600 mb-1">📊 Explication du score</p>
                    <p className="text-sm text-purple-900">{f.explication_score}</p>
                  </div>
                )}

                {f.alerte && (
                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-red-600 mb-1">⚠️ Alerte</p>
                    <p className="text-sm text-red-900">{f.alerte}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default FeedbackIA