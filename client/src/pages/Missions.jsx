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
  const user = JSON.parse(localStorage.getItem('user'))

  const getMissions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/missions', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMissions(res.data)
    } catch (err) { console.log(err) }
  }

  const getStagiaires = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stagiaires', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStagiaires(res.data)
    } catch (err) { console.log(err) }
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
    } catch (err) { console.log(err) }
    finally { setChargement(false) }
  }

  const getBadgeStatut = (statut) => {
    const map = {
      'a_faire':   { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8',  label: 'À faire'   },
      'en_cours':  { bg: '#eff4ff', color: '#1a56db', dot: '#1a56db',  label: 'En cours'  },
      'en_retard': { bg: '#fff1f2', color: '#e11d48', dot: '#e11d48',  label: 'En retard' },
      'termine':   { bg: '#f0fdf4', color: '#16a34a', dot: '#16a34a',  label: 'Terminé'   },
    }
    return map[statut] || map['a_faire']
  }

  const getDifficulteStyle = (diff) => {
    const map = {
      'facile':   { bg: '#f0fdf4', color: '#16a34a' },
      'moyen':    { bg: '#fff7ed', color: '#ea580c' },
      'difficile':{ bg: '#fff1f2', color: '#e11d48' },
    }
    return map[diff] || map['facile']
  }

  const handleStatut = async (id, statut) => {
    try {
      await axios.put(`http://localhost:5000/api/missions/${id}/statut`,
        { statut },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      getMissions()
    } catch (err) { console.log(err) }
  }

  return (
    <>
      <style>{`
        .mis-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .mis-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px; font-weight: 700; color: #0e2a6e;
        }
        .mis-header p { font-size: 13px; color: #64748b; margin-top: 3px; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f97316; border: none; border-radius: 10px;
          padding: 10px 18px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 600; color: #fff;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 3px 10px rgba(249,115,22,0.3);
        }
        .btn-primary:hover { background: #ea6c0a; transform: translateY(-1px); }

        /* FORM */
        .mis-form-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf8; padding: 24px; margin-bottom: 24px;
        }
        .mis-form-card h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 600; color: #0e2a6e;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .mis-form-card h3::before {
          content: ''; display: inline-block;
          width: 3px; height: 16px;
          background: #f97316; border-radius: 2px;
        }

        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
        .col-span-2 { grid-column: span 2; }

        .form-field label {
          display: block; font-size: 11px; font-weight: 600;
          color: #0e2a6e; text-transform: uppercase;
          letter-spacing: 0.05em; margin-bottom: 6px;
        }
        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%; background: #f8faff;
          border: 1.5px solid #dbe4ff; border-radius: 10px;
          padding: 10px 13px; font-size: 13.5px;
          font-family: 'DM Sans', sans-serif; color: #0f172a;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
          resize: vertical;
        }
        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: #1a56db;
          box-shadow: 0 0 0 3px rgba(26,86,219,0.09);
          background: #fff;
        }
        .form-field input::placeholder,
        .form-field textarea::placeholder { color: #94a3b8; }

        .form-actions { display: flex; align-items: center; gap: 12px; }
        .btn-save {
          background: #0e2a6e; border: none; border-radius: 10px;
          padding: 10px 20px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 600; color: #fff;
          cursor: pointer; transition: background 0.15s;
        }
        .btn-save:hover:not(:disabled) { background: #1a3a8f; }
        .btn-save:disabled { opacity: 0.55; cursor: not-allowed; }
        .btn-cancel {
          background: none; border: none; font-size: 13px;
          color: #64748b; cursor: pointer; padding: 10px 14px;
          border-radius: 8px; transition: background 0.13s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-cancel:hover { background: #f1f5f9; color: #0f172a; }

        /* TABLE */
        .mis-table-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf8; overflow: hidden;
        }
        .mis-table-card table { width: 100%; border-collapse: collapse; }
        .mis-table-card thead tr { background: #f8faff; }
        .mis-table-card th {
          text-align: left; font-size: 11px; font-weight: 600;
          color: #94a3b8; text-transform: uppercase;
          letter-spacing: 0.06em; padding: 12px 20px;
          border-bottom: 1px solid #f1f5fb;
        }
        .mis-table-card tbody tr {
          border-bottom: 1px solid #f8faff; transition: background 0.12s;
        }
        .mis-table-card tbody tr:last-child { border-bottom: none; }
        .mis-table-card tbody tr:hover { background: #f8faff; }
        .mis-table-card td { padding: 14px 20px; font-size: 13.5px; color: #334155; }

        .mis-title { font-weight: 600; color: #0f172a; font-size: 13.5px; }
        .mis-desc { font-size: 11px; color: #94a3b8; margin-top: 2px; }

        .diff-badge {
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 20px; white-space: nowrap;
        }

        .statut-select {
          display: inline-flex; align-items: center; gap: 6px;
          border: none; border-radius: 20px;
          padding: 4px 10px 4px 8px;
          font-size: 11px; font-weight: 600;
          cursor: pointer; outline: none;
          font-family: 'DM Sans', sans-serif;
          appearance: none; -webkit-appearance: none;
        }

        .statut-dot {
          width: 6px; height: 6px; border-radius: 50%;
          display: inline-block; flex-shrink: 0;
        }

        .statut-wrapper {
          display: inline-flex; align-items: center;
          border-radius: 20px; overflow: hidden;
          position: relative;
        }
        .statut-wrapper select {
          border: none; border-radius: 20px;
          padding: 4px 24px 4px 10px;
          font-size: 11px; font-weight: 600;
          cursor: pointer; outline: none;
          font-family: 'DM Sans', sans-serif;
          appearance: none; -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394a3b8'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
        }

        .deadline-cell { font-size: 12px; color: #64748b; font-weight: 500; }

        .stag-name-cell { font-size: 13px; font-weight: 500; color: #334155; }

        .empty-state {
          text-align: center; padding: 56px 20px;
          color: #94a3b8; font-size: 13px;
        }
        .empty-state-icon { font-size: 32px; margin-bottom: 10px; }
      `}</style>

      {/* HEADER */}
      <div className="mis-header">
        <div>
          <h2>Missions</h2>
          <p>{missions.length} mission(s) au total</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'tuteur') && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            + Ajouter une mission
          </button>
        )}
      </div>

      {/* FORM */}
      {showForm && (user?.role === 'admin' || user?.role === 'tuteur') && (
        <div className="mis-form-card">
          <h3>Nouvelle mission</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-field col-span-2">
                <label>Titre</label>
                <input
                  value={form.titre}
                  onChange={e => setForm({...form, titre: e.target.value})}
                  placeholder="Titre de la mission"
                  required
                />
              </div>
              <div className="form-field col-span-2">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Décrivez la mission..."
                  required
                />
              </div>
              <div className="form-field">
                <label>Stagiaire</label>
                <select
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
              <div className="form-field">
                <label>Difficulté</label>
                <select value={form.difficulte} onChange={e => setForm({...form, difficulte: e.target.value})}>
                  <option value="facile">Facile</option>
                  <option value="moyen">Moyen</option>
                  <option value="difficile">Difficile</option>
                </select>
              </div>
              <div className="form-field">
                <label>Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={e => setForm({...form, deadline: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={chargement}>
                {chargement ? 'Création...' : '✓ Créer la mission'}
              </button>
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="mis-table-card">
        {missions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>Aucune mission pour l'instant</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Mission</th>
                <th>Stagiaire</th>
                <th>Difficulté</th>
                <th>Deadline</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((m, i) => {
                const statut = getBadgeStatut(m.statut)
                const diff = getDifficulteStyle(m.difficulte)
                return (
                  <tr key={i}>
                    <td>
                      <div className="mis-title">{m.titre}</div>
                      <div className="mis-desc">{m.description?.substring(0, 60)}...</div>
                    </td>
                    <td>
                      <span className="stag-name-cell">
                        {m.stagiaire_id?.prenom} {m.stagiaire_id?.nom}
                      </span>
                    </td>
                    <td>
                      <span className="diff-badge" style={{ background: diff.bg, color: diff.color }}>
                        {m.difficulte}
                      </span>
                    </td>
                    <td>
                      <span className="deadline-cell">
                        {new Date(m.deadline).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td>
                      <div className="statut-wrapper">
                        <select
  value={m.statut}
  onChange={e => user?.role !== 'directeur' && handleStatut(m._id, e.target.value)}
  disabled={user?.role === 'directeur'}
  style={{
    background: statut.bg,
    color: statut.color,
    cursor: user?.role === 'directeur' ? 'not-allowed' : 'pointer'
  }}
                        >
                          {user?.role === 'stagiaire' ? (
                            <>
                              <option value="en_cours">En cours</option>
                              <option value="termine">Terminé</option>
                            </>
                          ) : (
                            <>
                              <option value="a_faire">À faire</option>
                              <option value="en_cours">En cours</option>
                              <option value="en_retard">En retard</option>
                              <option value="termine">Terminé</option>
                            </>
                          )}
                        </select>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default Missions
