import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '',
    mot_de_passe: '', role: 'tuteur'
  })

  const token = localStorage.getItem('token')

  const getUtilisateurs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/utilisateurs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUtilisateurs(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUtilisateurs()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setChargement(true)
    setMessage('')
    try {
      await axios.post('http://localhost:5000/api/utilisateurs', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('Utilisateur créé avec succès ✅')
      setShowForm(false)
      setForm({ nom: '', prenom: '', email: '', mot_de_passe: '', role: 'tuteur' })
      getUtilisateurs()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur ❌')
    } finally {
      setChargement(false)
    }
  }

  const handleToggle = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/utilisateurs/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      getUtilisateurs()
    } catch (err) {
      console.log(err)
    }
  }

  const handleSupprimer = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return
    try {
      await axios.delete(`http://localhost:5000/api/utilisateurs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      getUtilisateurs()
    } catch (err) {
      console.log(err)
    }
  }

  const getRoleBadge = (role) => {
    const styles = {
      'admin': 'bg-purple-50 text-purple-700',
      'tuteur': 'bg-blue-50 text-blue-700',
      'directeur': 'bg-gray-100 text-gray-700',
      'stagiaire': 'bg-green-50 text-green-700'
    }
    return styles[role] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h2>
          <p className="text-sm text-gray-500 mt-1">{utilisateurs.length} utilisateur(s) au total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
        >
          + Nouvel utilisateur
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-green-700">{message}</p>
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Nouvel utilisateur</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nom</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  value={form.nom}
                  onChange={e => setForm({...form, nom: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Prénom</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  value={form.prenom}
                  onChange={e => setForm({...form, prenom: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Mot de passe</label>
                <input
                  type="password"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  value={form.mot_de_passe}
                  onChange={e => setForm({...form, mot_de_passe: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Rôle</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  value={form.role}
                  onChange={e => setForm({...form, role: e.target.value})}
                >
                  <option value="tuteur">Tuteur</option>
                  <option value="admin">Admin</option>
                  <option value="directeur">Directeur</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={chargement}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
              >
                {chargement ? 'Création...' : 'Créer'}
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
        {utilisateurs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Aucun utilisateur</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Utilisateur</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Rôle</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Statut</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {utilisateurs.map((u, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                        {u.prenom?.[0]}{u.nom?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.prenom} {u.nom}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleBadge(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${u.actif ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {u.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggle(u._id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        {u.actif ? 'Désactiver' : 'Activer'}
                      </button>
                      <button
                        onClick={() => handleSupprimer(u._id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Utilisateurs