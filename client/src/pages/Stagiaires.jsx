import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Stagiaires() {
  const [stagiaires, setStagiaires] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', mot_de_passe: '',
    ecole: '', niveau: 'Bac+2', departement: '',
    date_debut: '', date_fin: ''
  })

  const token = localStorage.getItem('token')

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
    getStagiaires()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setChargement(true)
    try {
      await axios.post('http://localhost:5000/api/stagiaires', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowForm(false)
      setForm({
        nom: '', prenom: '', email: '', mot_de_passe: '',
        ecole: '', niveau: 'Bac+2', departement: '',
        date_debut: '', date_fin: ''
      })
      getStagiaires()
    } catch (err) {
      console.log(err)
    } finally {
      setChargement(false)
    }
  }

  const getBadge = (niveau) => {
    const colors = {
      'Bac+1': 'bg-gray-100 text-gray-600',
      'Bac+2': 'bg-blue-50 text-blue-700',
      'Bac+3': 'bg-green-50 text-green-700',
      'Bac+4': 'bg-purple-50 text-purple-700',
      'Bac+5': 'bg-orange-50 text-orange-700',
    }
    return colors[niveau] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Stagiaires</h2>
          <p className="text-sm text-gray-500 mt-1">{stagiaires.length} stagiaire(s) au total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
        >
          + Ajouter un stagiaire
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Nouveau stagiaire</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nom</label>
                <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Prénom</label>
                <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                <input type="email" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Mot de passe</label>
                <input type="password" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.mot_de_passe} onChange={e => setForm({...form, mot_de_passe: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">École</label>
                <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.ecole} onChange={e => setForm({...form, ecole: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Niveau</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.niveau} onChange={e => setForm({...form, niveau: e.target.value})}>
                  <option>Bac+1</option>
                  <option>Bac+2</option>
                  <option>Bac+3</option>
                  <option>Bac+4</option>
                  <option>Bac+5</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Département</label>
                <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.departement} onChange={e => setForm({...form, departement: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Date début</label>
                <input type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.date_debut} onChange={e => setForm({...form, date_debut: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Date fin</label>
                <input type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.date_fin} onChange={e => setForm({...form, date_fin: e.target.value})} required />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={chargement} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition">
                {chargement ? 'Création...' : 'Créer le stagiaire'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {stagiaires.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Aucun stagiaire pour l'instant</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Stagiaire</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">École</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Niveau</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Département</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Période</th>
              </tr>
            </thead>
            <tbody>
              {stagiaires.map((s, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                        {s.user_id?.prenom?.[0]}{s.user_id?.nom?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{s.user_id?.prenom} {s.user_id?.nom}</p>
                        <p className="text-xs text-gray-400">{s.user_id?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.ecole}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getBadge(s.niveau)}`}>
                      {s.niveau}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.departement}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(s.date_debut).toLocaleDateString('fr-FR')} → {new Date(s.date_fin).toLocaleDateString('fr-FR')}
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

export default Stagiaires