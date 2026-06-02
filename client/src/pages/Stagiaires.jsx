import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Stagiaires() {
  const [stagiaires, setStagiaires] = useState([])
  const [tuteurs, setTuteurs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', mot_de_passe: '',
    ecole: '', niveau: 'Bac+2', departement: '',
    date_debut: '', date_fin: '', tuteur_id: ''
  })

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user')) 

  const getStagiaires = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stagiaires', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStagiaires(res.data)
    } catch (err) { console.log(err) }
  }

  const getTuteurs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/utilisateurs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTuteurs(res.data.filter(u => u.role === 'tuteur'))
    } catch (err) { console.log(err) }
  }

  useEffect(() => {
    getStagiaires()
    getTuteurs()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setChargement(true)
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/stagiaires/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post('http://localhost:5000/api/stagiaires', form, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setShowForm(false)
      setEditId(null)
      setForm({ nom: '', prenom: '', email: '', mot_de_passe: '', ecole: '', niveau: 'Bac+2', departement: '', date_debut: '', date_fin: '', tuteur_id: '' })
      getStagiaires()
    } catch (err) { console.log(err) }
    finally { setChargement(false) }
  }

  const handleEdit = (s) => {
    setEditId(s._id)
    setForm({
      nom: s.user_id?.nom || '',
      prenom: s.user_id?.prenom || '',
      email: s.user_id?.email || '',
      mot_de_passe: '',
      ecole: s.ecole || '',
      niveau: s.niveau || 'Bac+2',
      departement: s.departement || '',
      date_debut: s.date_debut?.split('T')[0] || '',
      date_fin: s.date_fin?.split('T')[0] || '',
      tuteur_id: s.tuteur_id?._id || ''
    })
    setShowForm(true)
  }

  const getNiveauStyle = (niveau) => {
    const map = {
      'Bac+1': { bg: '#f1f5f9', color: '#475569' },
      'Bac+2': { bg: '#eff4ff', color: '#1a56db' },
      'Bac+3': { bg: '#f0fdf4', color: '#16a34a' },
      'Bac+4': { bg: '#faf5ff', color: '#7c3aed' },
      'Bac+5': { bg: '#fff7ed', color: '#ea580c' },
    }
    return map[niveau] || map['Bac+1']
  }

  const genererPDF = (stagiaireUserId, nom, prenom) => {
    fetch(`http://localhost:5000/api/pdf/attestation/${stagiaireUserId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `attestation_${nom}_${prenom}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      })
      .catch(err => console.log(err))
  }

  const resetForm = () => {
    setShowForm(false)
    setEditId(null)
    setForm({ nom: '', prenom: '', email: '', mot_de_passe: '', ecole: '', niveau: 'Bac+2', departement: '', date_debut: '', date_fin: '', tuteur_id: '' })
  }

  return (
    <>
      <style>{`
        .stag-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .stag-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px; font-weight: 700; color: #0e2a6e;
        }
        .stag-header p { font-size: 13px; color: #64748b; margin-top: 3px; }

        .btn-primary {
          display: flex; align-items: center; gap: 6px;
          background: #f97316;
          border: none; border-radius: 10px;
          padding: 10px 18px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 600; color: #fff;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 3px 10px rgba(249,115,22,0.3);
        }
        .btn-primary:hover { background: #ea6c0a; transform: translateY(-1px); box-shadow: 0 5px 14px rgba(249,115,22,0.38); }

        /* FORM CARD */
        .stag-form-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8edf8;
          padding: 24px;
          margin-bottom: 24px;
        }
        .stag-form-card h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 600; color: #0e2a6e;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .stag-form-card h3::before {
          content: '';
          display: inline-block;
          width: 3px; height: 16px;
          background: #f97316; border-radius: 2px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 20px;
        }
        .form-field label {
          display: block;
          font-size: 11px; font-weight: 600;
          color: #0e2a6e; text-transform: uppercase;
          letter-spacing: 0.05em; margin-bottom: 6px;
        }
        .form-field input,
        .form-field select {
          width: 100%;
          background: #f8faff;
          border: 1.5px solid #dbe4ff;
          border-radius: 10px;
          padding: 10px 13px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .form-field input:focus,
        .form-field select:focus {
          border-color: #1a56db;
          box-shadow: 0 0 0 3px rgba(26,86,219,0.09);
          background: #fff;
        }
        .form-field input::placeholder { color: #94a3b8; }
        .form-hint {
          font-size: 10px; color: #94a3b8;
          margin-left: 4px;
        }

        .form-actions { display: flex; align-items: center; gap: 12px; }
        .btn-save {
          background: #0e2a6e; border: none; border-radius: 10px;
          padding: 10px 20px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 600; color: #fff;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-save:hover:not(:disabled) { background: #1a3a8f; }
        .btn-save:disabled { opacity: 0.55; cursor: not-allowed; }
        .btn-cancel {
          background: none; border: none;
          font-size: 13px; color: #64748b;
          cursor: pointer; padding: 10px 14px;
          border-radius: 8px;
          transition: background 0.13s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-cancel:hover { background: #f1f5f9; color: #0f172a; }

        /* TABLE CARD */
        .stag-table-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8edf8;
          overflow: hidden;
        }
        .stag-table-card table { width: 100%; border-collapse: collapse; }
        .stag-table-card thead tr { background: #f8faff; }
        .stag-table-card th {
          text-align: left;
          font-size: 11px; font-weight: 600;
          color: #94a3b8; text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 12px 20px;
          border-bottom: 1px solid #f1f5fb;
        }
        .stag-table-card tbody tr {
          border-bottom: 1px solid #f8faff;
          transition: background 0.12s;
        }
        .stag-table-card tbody tr:last-child { border-bottom: none; }
        .stag-table-card tbody tr:hover { background: #f8faff; }
        .stag-table-card td { padding: 14px 20px; font-size: 13.5px; color: #334155; }

        .stag-avatar {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: #eff4ff;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #1a56db;
          flex-shrink: 0;
        }
        .stag-name { font-weight: 600; color: #0f172a; font-size: 13.5px; }
        .stag-email { font-size: 11px; color: #94a3b8; margin-top: 1px; }

        .niveau-badge {
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 20px;
          white-space: nowrap;
        }

        .periode {
          font-size: 12px; color: #94a3b8;
          display: flex; align-items: center; gap: 4px;
        }
        .periode span { color: #cbd5e1; }

        .btn-edit {
          display: inline-flex; align-items: center; gap: 4px;
          background: #f8faff; border: 1px solid #e8edf8;
          border-radius: 8px; padding: 6px 12px;
          font-size: 12px; font-weight: 500; color: #475569;
          cursor: pointer;
          transition: all 0.13s;
        }
        .btn-edit:hover { background: #0e2a6e; color: #fff; border-color: #0e2a6e; }

        .btn-pdf {
          display: inline-flex; align-items: center; gap: 4px;
          background: #fff7ed; border: 1px solid #fed7aa;
          border-radius: 8px; padding: 6px 12px;
          font-size: 12px; font-weight: 500; color: #ea580c;
          cursor: pointer;
          transition: all 0.13s;
        }
        .btn-pdf:hover { background: #f97316; color: #fff; border-color: #f97316; }

        .empty-state {
          text-align: center; padding: 56px 20px;
          color: #94a3b8; font-size: 13px;
        }
        .empty-state-icon { font-size: 32px; margin-bottom: 10px; }
      `}</style>

      {/* HEADER */}
      <div className="stag-header">
        <div>
          <h2>Stagiaires</h2>
          <p>{stagiaires.length} stagiaire(s) au total</p>
        </div>
        {user?.role === 'admin' && (
  <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm) }}>
    + Ajouter un stagiaire
  </button>
)}
      </div>

      {/* FORM */}
      {showForm && (
        <div className="stag-form-card">
          <h3>{editId ? 'Modifier le stagiaire' : 'Nouveau stagiaire'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label>Nom</label>
                <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} placeholder="Alami" required />
              </div>
              <div className="form-field">
                <label>Prénom</label>
                <input value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} placeholder="Youssef" required />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="youssef@email.com" required={!editId} />
              </div>
              <div className="form-field">
                <label>
                  Mot de passe {editId && <span className="form-hint">(laisser vide = inchangé)</span>}
                </label>
                <input type="password" value={form.mot_de_passe} onChange={e => setForm({...form, mot_de_passe: e.target.value})} placeholder="••••••••" required={!editId} />
              </div>
              <div className="form-field">
                <label>École</label>
                <input value={form.ecole} onChange={e => setForm({...form, ecole: e.target.value})} placeholder="ENSA Agadir" required />
              </div>
              <div className="form-field">
                <label>Niveau</label>
                <select value={form.niveau} onChange={e => setForm({...form, niveau: e.target.value})}>
                  <option>Bac+1</option>
                  <option>Bac+2</option>
                  <option>Bac+3</option>
                  <option>Bac+4</option>
                  <option>Bac+5</option>
                </select>
              </div>
              <div className="form-field">
                <label>Département</label>
                <input value={form.departement} onChange={e => setForm({...form, departement: e.target.value})} placeholder="Développement Web" required />
              </div>
              <div className="form-field">
                <label>Tuteur</label>
                <select value={form.tuteur_id} onChange={e => setForm({...form, tuteur_id: e.target.value})}>
                  <option value="">Sélectionner un tuteur</option>
                  {tuteurs.map(t => (
                    <option key={t._id} value={t._id}>{t.prenom} {t.nom}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Date début</label>
                <input type="date" value={form.date_debut} onChange={e => setForm({...form, date_debut: e.target.value})} required />
              </div>
              <div className="form-field">
                <label>Date fin</label>
                <input type="date" value={form.date_fin} onChange={e => setForm({...form, date_fin: e.target.value})} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={chargement}>
                {chargement ? 'Enregistrement...' : editId ? '✓ Modifier' : '✓ Créer le stagiaire'}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="stag-table-card">
        {stagiaires.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👨‍🎓</div>
            <p>Aucun stagiaire pour l'instant</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Stagiaire</th>
                <th>École</th>
                <th>Niveau</th>
                <th>Tuteur</th>
                <th>Période</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stagiaires.map((s, i) => {
                const niv = getNiveauStyle(s.niveau)
                return (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="stag-avatar">
                          {s.user_id?.prenom?.[0]}{s.user_id?.nom?.[0]}
                        </div>
                        <div>
                          <div className="stag-name">{s.user_id?.prenom} {s.user_id?.nom}</div>
                          <div className="stag-email">{s.user_id?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{s.ecole}</td>
                    <td>
                      <span className="niveau-badge" style={{ background: niv.bg, color: niv.color }}>
                        {s.niveau}
                      </span>
                    </td>
                    <td>
                      {s.tuteur_id?.prenom
                        ? <span style={{ fontWeight: 500 }}>{s.tuteur_id.prenom} {s.tuteur_id.nom}</span>
                        : <span style={{ color: '#cbd5e1' }}>—</span>}
                    </td>
                    <td>
                      <div className="periode">
                        {new Date(s.date_debut).toLocaleDateString('fr-FR')}
                        <span>→</span>
                        {new Date(s.date_fin).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-edit" onClick={() => handleEdit(s)}>✏️ Modifier</button>
                        <button className="btn-pdf" onClick={() => genererPDF(s.user_id?._id, s.user_id?.nom, s.user_id?.prenom)}>📄 PDF</button>
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

export default Stagiaires
