import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Rapports() {
  const [rapports, setRapports] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [commentaire, setCommentaire] = useState({})
  const [form, setForm] = useState({
    taches_realisees: '',
    difficultes: '',
    taches_demain: '',
    humeur: 3
  })

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  const getRapports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rapports', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRapports(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getRapports()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setChargement(true)
    try {
      await axios.post('http://localhost:5000/api/rapports', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowForm(false)
      setForm({ taches_realisees: '', difficultes: '', taches_demain: '', humeur: 3 })
      getRapports()
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    } finally {
      setChargement(false)
    }
  }

  const handleCommentaire = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/rapports/${id}/commentaire`,
        { commentaire_tuteur: commentaire[id] },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      getRapports()
      setCommentaire({ ...commentaire, [id]: '' })
    } catch (err) {
      console.log(err)
    }
  }

  const getHumeurEmoji = (h) => {
    const emojis = { 1: '😞', 2: '😕', 3: '😐', 4: '😊', 5: '😄' }
    return emojis[h] || '😐'
  }

  const getHumeurColor = (h) => {
    const colors = {
      1: 'bg-red-50 text-red-700',
      2: 'bg-orange-50 text-orange-700',
      3: 'bg-gray-100 text-gray-600',
      4: 'bg-blue-50 text-blue-700',
      5: 'bg-green-50 text-green-700'
    }
    return colors[h] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Rapports journaliers</h2>
          <p className="text-sm text-gray-500 mt-1">{rapports.length} rapport(s) au total</p>
        </div>
        {user?.role === 'stagiaire' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
          >
            + Envoyer mon rapport
          </button>
        )}
      </div>

      {/* Formulaire stagiaire */}
      {showForm && user?.role === 'stagiaire' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Rapport du {new Date().toLocaleDateString('fr-FR')}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">
                Tâches réalisées aujourd'hui
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                rows="4"
                placeholder="Décrivez ce que vous avez accompli aujourd'hui..."
                value={form.taches_realisees}
                onChange={e => setForm({...form, taches_realisees: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">
                Difficultés rencontrées
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                rows="3"
                placeholder="Quels problèmes avez-vous rencontrés ? (optionnel)"
                value={form.difficultes}
                onChange={e => setForm({...form, difficultes: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">
                Tâches prévues demain
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                rows="3"
                placeholder="Que prévoyez-vous de faire demain ?"
                value={form.taches_demain}
                onChange={e => setForm({...form, taches_demain: e.target.value})}
              />
            </div>
            <div className="mb-6">
              <label className="text-xs text-gray-500 mb-2 block">
                Humeur du jour : {getHumeurEmoji(form.humeur)}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={form.humeur}
                onChange={e => setForm({...form, humeur: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>😞 Difficile</span>
                <span>😐 Normal</span>
                <span>😄 Excellent</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={chargement}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
              >
                {chargement ? 'Envoi...' : 'Envoyer le rapport'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des rapports */}
      <div className="space-y-4">
        {rapports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-400 text-center py-4">
              Aucun rapport pour l'instant
            </p>
          </div>
        ) : (
          rapports.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                    {r.stagiaire_id?.prenom?.[0]}{r.stagiaire_id?.nom?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {r.stagiaire_id?.prenom} {r.stagiaire_id?.nom}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getHumeurColor(r.humeur)}`}>
                  {getHumeurEmoji(r.humeur)} {r.humeur}/5
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Tâches réalisées</p>
                  <p className="text-sm text-gray-700">{r.taches_realisees}</p>
                </div>
                {r.difficultes && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Difficultés</p>
                    <p className="text-sm text-gray-700">{r.difficultes}</p>
                  </div>
                )}
                {r.taches_demain && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Prévisions demain</p>
                    <p className="text-sm text-gray-700">{r.taches_demain}</p>
                  </div>
                )}
              </div>

              {/* Commentaire tuteur */}
              {r.commentaire_tuteur && (
                <div className="mt-4 bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-600 font-medium mb-1">Commentaire tuteur</p>
                  <p className="text-sm text-blue-800">{r.commentaire_tuteur}</p>
                </div>
              )}

              {/* Ajouter commentaire (tuteur/admin) */}
              {(user?.role === 'tuteur' || user?.role === 'admin') && (
                <div className="mt-4 flex gap-2">
                  <input
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                    placeholder="Laisser un commentaire..."
                    value={commentaire[r._id] || ''}
                    onChange={e => setCommentaire({...commentaire, [r._id]: e.target.value})}
                  />
                  <button
                    onClick={() => handleCommentaire(r._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
                  >
                    Envoyer
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Rapports