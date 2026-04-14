import React, { useState } from 'react'
import axios from 'axios'

function ChangerMotDePasse() {
  const [form, setForm] = useState({
    ancien_mot_de_passe: '',
    nouveau_mot_de_passe: '',
    confirmer: ''
  })
  const [message, setMessage] = useState('')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  const token = localStorage.getItem('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setErreur('')

    if (form.nouveau_mot_de_passe !== form.confirmer) {
      setErreur('Les mots de passe ne correspondent pas')
      return
    }

    if (form.nouveau_mot_de_passe.length < 6) {
      setErreur('Le nouveau mot de passe doit contenir au moins 6 caractères')
      return
    }

    setChargement(true)
    try {
      await axios.put(
        'http://localhost:5000/api/auth/changer-mot-de-passe',
        {
          ancien_mot_de_passe: form.ancien_mot_de_passe,
          nouveau_mot_de_passe: form.nouveau_mot_de_passe
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Mot de passe changé avec succès ✅')
      setForm({ ancien_mot_de_passe: '', nouveau_mot_de_passe: '', confirmer: '' })
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur serveur')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="border-t border-gray-100 pt-4">
      <p className="text-sm font-medium text-gray-700 mb-4">Changer le mot de passe</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="text-xs text-gray-500 mb-1 block">Ancien mot de passe</label>
          <input
            type="password"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
            value={form.ancien_mot_de_passe}
            onChange={e => setForm({...form, ancien_mot_de_passe: e.target.value})}
            required
          />
        </div>
        <div className="mb-3">
          <label className="text-xs text-gray-500 mb-1 block">Nouveau mot de passe</label>
          <input
            type="password"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
            value={form.nouveau_mot_de_passe}
            onChange={e => setForm({...form, nouveau_mot_de_passe: e.target.value})}
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-xs text-gray-500 mb-1 block">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
            value={form.confirmer}
            onChange={e => setForm({...form, confirmer: e.target.value})}
            required
          />
        </div>

        {erreur && <p className="text-red-500 text-xs mb-3">{erreur}</p>}
        {message && <p className="text-green-600 text-xs mb-3">{message}</p>}

        <button
          type="submit"
          disabled={chargement}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-xl transition"
        >
          {chargement ? 'Changement...' : 'Changer le mot de passe'}
        </button>
      </form>
    </div>
  )
}

export default ChangerMotDePasse