import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Missions() {
  const [missions, setMissions] = useState([])
  const [stagiaires, setStagiaires] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [form, setForm] = useState({
    titre: '', description: '', deadline: '',
    difficulte: 'facile', stagiaire_id: ''
  })

  const token = localStorage.getItem('token')

  const getMissions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/missions', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMissions(res.data)
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
    getMissions()
    getStagiaires()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setChargement(true)
    try {
      await axios.post('http://localhost:5000/api/missions', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowForm(false)
      setForm({ titre: '', description: '', deadline: '', difficulte: 'facile', stagiaire_id: '' })
      getMissions()
    } catch (err) {
      console.log(err)
    } finally {
      setChargement(false)
    }
  }

  const getBadgeStatut = (statut) => {
    const styles = {
      'a_faire': 'bg-gray-100 text-gray-600',
      'en_cours': 'bg-blue-50 text-blue-700',
      'en_retard': 'bg-red-50 text-red-700',
      'termine': 'bg-green-50 text-green-700',
    }
    const labels = {
      'a_faire': 'À faire',
      'en_cours': 'En cours',
      'en_retard': 'En retard',
      'termine': 'Terminé',
    }
    return { style: styles[statut], label: labels[statut] }
  }

  const getBadgeDifficulte = (diff) => {
    const styles = {
      'facile': 'bg-green-50 text-green-700',
      'moyen': 'bg-orange-50 text-orange-700',
      'difficile': 'bg-red-50 text-red-700',
    }
    return styles[diff]
  }

  const handleStatut = async (id, statut) => {
    try {
      await axios.put(`http://localhost:5000/api/missions/${id}/statut`,
        { statut },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      getMissions()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Missions</h2>
          <p className="text-sm text-gray-500 mt-1">{missions.length} mission(s) au total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
        >
          + Ajouter une mission
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Nouvelle mission</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">Titre</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  value={form.titre}
                  onChange={e => setForm({...form, titre: e.target.value})}
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">Description</label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  rows="3"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Stagiaire</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  value={form.stagiaire_id}
                  onChange={e => setForm({...form, stagiaire_id: e.target.value})}
                  required
                >
                  <option value="">Sélectionner un stagiaire</option>
                  {stagiaires.map(s => (
                    <option key={s._id} value={s.user_id?._id}>
                      {s.user_id?.prenom} {s.user_id?.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Difficulté</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  value={form.difficulte}
                  onChange={e => setForm({...form, difficulte: e.target.value})}
                >
                  <option value="facile">Facile</option>
                  <option value="moyen">Moyen</option>
                  <option value="difficile">Difficile</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Deadline</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  value={form.deadline}
                  onChange={e => setForm({...form, deadline: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={chargement}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
              >
                {chargement ? 'Création...' : 'Créer la mission'}
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
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {missions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Aucune mission pour l'instant</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Mission</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Stagiaire</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Difficulté</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Deadline</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((m, i) => {
                const { style, label } = getBadgeStatut(m.statut)
                return (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{m.titre}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{m.description?.substring(0, 50)}...</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {m.stagiaire_id?.prenom} {m.stagiaire_id?.nom}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getBadgeDifficulte(m.difficulte)}`}>
                        {m.difficulte}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(m.deadline).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={m.statut}
                        onChange={e => handleStatut(m._id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${style}`}
                      >
                        <option value="a_faire">À faire</option>
                        <option value="en_cours">En cours</option>
                        <option value="en_retard">En retard</option>
                        <option value="termine">Terminé</option>
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Missions