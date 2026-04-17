import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Evaluations() {
  const [evaluations, setEvaluations] = useState([])
  const [stagiaires, setStagiaires] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [form, setForm] = useState({
    stagiaire_id: '',
    type: 'mi_stage',
    commentaire_global: '',
    criteres: {
      competences_techniques: 3,
      autonomie: 3,
      qualite_travail: 3,
      respect_delais: 3,
      communication: 3,
      ponctualite: 3
    },
    auto_evaluation: {
      competences_techniques: 3,
      autonomie: 3,
      qualite_travail: 3,
      respect_delais: 3,
      communication: 3,
      ponctualite: 3
    }
  })

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  const getEvaluations = async () => {
    try {
      if (user?.role === 'stagiaire') {
        const res = await axios.get(`http://localhost:5000/api/evaluations/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setEvaluations(res.data)
      } else {
        const res = await axios.get('http://localhost:5000/api/evaluations', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setEvaluations(res.data)
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
    getEvaluations()
    if (user?.role !== 'stagiaire') getStagiaires()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setChargement(true)
    try {
      await axios.post('http://localhost:5000/api/evaluations', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowForm(false)
      getEvaluations()
    } catch (err) {
      console.log(err)
    } finally {
      setChargement(false)
    }
  }

  const critereLabels = {
    competences_techniques: 'Compétences techniques',
    autonomie: 'Autonomie',
    qualite_travail: 'Qualité du travail',
    respect_delais: 'Respect des délais',
    communication: 'Communication',
    ponctualite: 'Ponctualité'
  }

  const getMoyenne = (criteres) => {
    const vals = Object.values(criteres)
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
  }

  const getStars = (note) => {
    return '⭐'.repeat(Math.round(note)) + '☆'.repeat(5 - Math.round(note))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Évaluations</h2>
          <p className="text-sm text-gray-500 mt-1">{evaluations.length} évaluation(s) au total</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'tuteur') && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
          >
            + Nouvelle évaluation
          </button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Nouvelle évaluation</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Stagiaire</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  value={form.stagiaire_id}
                  onChange={e => setForm({...form, stagiaire_id: e.target.value})}
                  required
                >
                  <option value="">Sélectionner</option>
                  {stagiaires.map(s => (
                    <option key={s._id} value={s.user_id?._id}>
                      {s.user_id?.prenom} {s.user_id?.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Type</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value})}
                >
                  <option value="mi_stage">Mi-stage</option>
                  <option value="finale">Finale</option>
                </select>
              </div>
            </div>

            {/* Critères tuteur */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Évaluation tuteur</p>
              <div className="space-y-3">
                {Object.keys(form.criteres).map(key => (
                  <div key={key} className="flex items-center gap-4">
                    <label className="text-xs text-gray-600 w-48">{critereLabels[key]}</label>
                    <input
                      type="range" min="1" max="5"
                      value={form.criteres[key]}
                      onChange={e => setForm({
                        ...form,
                        criteres: {...form.criteres, [key]: parseInt(e.target.value)}
                      })}
                      className="flex-1"
                    />
                    <span className="text-xs font-medium text-gray-900 w-8">{form.criteres[key]}/5</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Commentaire global</label>
              <textarea
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                rows="3"
                value={form.commentaire_global}
                onChange={e => setForm({...form, commentaire_global: e.target.value})}
                placeholder="Observations générales sur le stagiaire..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={chargement}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
              >
                {chargement ? 'Enregistrement...' : 'Enregistrer l\'évaluation'}
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

      {/* Liste */}
      <div className="space-y-4">
        {evaluations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-400 text-center py-8">
              Aucune évaluation pour l'instant
            </p>
          </div>
        ) : (
          evaluations.map((e, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {e.stagiaire_id?.prenom} {e.stagiaire_id?.nom}
                  </p>
                  <p className="text-xs text-gray-400">
                    {e.type === 'mi_stage' ? 'Évaluation mi-stage' : 'Évaluation finale'} —{' '}
                    par {e.tuteur_id?.prenom} {e.tuteur_id?.nom}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {getMoyenne(e.criteres)}/5
                  </p>
                  <p className="text-xs text-yellow-500">{getStars(getMoyenne(e.criteres))}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {Object.keys(e.criteres).map(key => (
                  <div key={key} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">{critereLabels[key]}</p>
                    <p className="text-sm font-medium text-gray-900">{e.criteres[key]}/5</p>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div
                        className="bg-blue-500 rounded-full h-1"
                        style={{width: `${(e.criteres[key]/5)*100}%`}}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {e.commentaire_global && (
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-600 font-medium mb-1">Commentaire</p>
                  <p className="text-sm text-blue-800">{e.commentaire_global}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Evaluations