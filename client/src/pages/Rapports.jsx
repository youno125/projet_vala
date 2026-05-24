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
    } catch (err) { console.log(err) }
  }

  useEffect(() => { getRapports() }, [])

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
    } finally { setChargement(false) }
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
    } catch (err) { console.log(err) }
  }

  const getHumeurEmoji = (h) => ({ 1:'😞', 2:'😕', 3:'😐', 4:'😊', 5:'😄' }[h] || '😐')

  const getHumeurStyle = (h) => {
    const map = {
      1: { bg: '#fff1f2', color: '#e11d48' },
      2: { bg: '#fff7ed', color: '#ea580c' },
      3: { bg: '#f1f5f9', color: '#475569' },
      4: { bg: '#eff4ff', color: '#1a56db' },
      5: { bg: '#f0fdf4', color: '#16a34a' },
    }
    return map[h] || map[3]
  }

  return (
    <>
      <style>{`
        .rap-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .rap-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px; font-weight: 700; color: #0e2a6e;
        }
        .rap-header p { font-size: 13px; color: #64748b; margin-top: 3px; }

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

        /* FORM CARD */
        .rap-form-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf8; padding: 24px; margin-bottom: 24px;
        }
        .rap-form-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 600; color: #0e2a6e;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .rap-form-title::before {
          content: ''; display: inline-block;
          width: 3px; height: 16px;
          background: #f97316; border-radius: 2px;
        }

        .form-field { margin-bottom: 16px; }
        .form-field label {
          display: block; font-size: 11px; font-weight: 600;
          color: #0e2a6e; text-transform: uppercase;
          letter-spacing: 0.05em; margin-bottom: 6px;
        }
        .form-field textarea {
          width: 100%; background: #f8faff;
          border: 1.5px solid #dbe4ff; border-radius: 10px;
          padding: 10px 13px; font-size: 13.5px;
          font-family: 'DM Sans', sans-serif; color: #0f172a;
          outline: none; resize: vertical;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .form-field textarea:focus {
          border-color: #1a56db;
          box-shadow: 0 0 0 3px rgba(26,86,219,0.09);
          background: #fff;
        }
        .form-field textarea::placeholder { color: #94a3b8; }

        /* humeur slider */
        .humeur-section { margin-bottom: 20px; }
        .humeur-label {
          font-size: 11px; font-weight: 600; color: #0e2a6e;
          text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 10px;
          display: flex; align-items: center; gap: 6px;
        }
        .humeur-emoji-display {
          font-size: 20px;
        }
        .humeur-slider {
          width: 100%; height: 6px;
          -webkit-appearance: none; appearance: none;
          background: linear-gradient(90deg, #1a56db, #f97316);
          border-radius: 3px; outline: none; cursor: pointer;
          margin-bottom: 8px;
        }
        .humeur-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #1a56db;
          box-shadow: 0 2px 6px rgba(26,86,219,0.25);
          cursor: pointer;
        }
        .humeur-labels {
          display: flex; justify-content: space-between;
          font-size: 11px; color: #94a3b8;
        }

        .form-actions { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
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

        /* RAPPORT CARDS */
        .rap-list { display: flex; flex-direction: column; gap: 16px; }

        .rap-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf8;
          overflow: hidden;
        }
        .rap-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 22px;
          border-bottom: 1px solid #f1f5fb;
          background: #f8faff;
        }
        .rap-card-user {
          display: flex; align-items: center; gap: 12px;
        }
        .rap-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          background: #eff4ff;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #1a56db;
          flex-shrink: 0;
        }
        .rap-user-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 600; color: #0e2a6e;
        }
        .rap-user-date { font-size: 11px; color: #94a3b8; margin-top: 1px; }

        .humeur-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 600;
          padding: 4px 12px; border-radius: 20px;
        }

        .rap-card-body { padding: 18px 22px; }

        .rap-section { margin-bottom: 14px; }
        .rap-section:last-child { margin-bottom: 0; }
        .rap-section-label {
          font-size: 10px; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.07em;
          margin-bottom: 5px;
          display: flex; align-items: center; gap: 5px;
        }
        .rap-section-text {
          font-size: 13.5px; color: #334155; line-height: 1.6;
        }

        .rap-divider {
          border: none; border-top: 1px solid #f1f5fb;
          margin: 14px 0;
        }

        /* commentaire tuteur */
        .tuteur-comment {
          background: #eff4ff;
          border-left: 3px solid #1a56db;
          border-radius: 0 10px 10px 0;
          padding: 10px 14px;
          margin-top: 14px;
        }
        .tuteur-comment-label {
          font-size: 10px; font-weight: 700; color: #1a56db;
          text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 4px;
        }
        .tuteur-comment-text { font-size: 13px; color: '#1e3a8a'; }

        /* add comment */
        .add-comment-row {
          display: flex; gap: 10px; margin-top: 14px;
          padding-top: 14px; border-top: 1px solid #f1f5fb;
        }
        .add-comment-input {
          flex: 1; background: #f8faff;
          border: 1.5px solid #dbe4ff; border-radius: 10px;
          padding: 9px 13px; font-size: 13px;
          font-family: 'DM Sans', sans-serif; color: #0f172a;
          outline: none; transition: border-color 0.15s;
        }
        .add-comment-input:focus {
          border-color: #1a56db;
          box-shadow: 0 0 0 3px rgba(26,86,219,0.09);
          background: #fff;
        }
        .add-comment-input::placeholder { color: #94a3b8; }
        .btn-comment {
          background: #0e2a6e; border: none; border-radius: 10px;
          padding: 9px 18px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 600; color: #fff;
          cursor: pointer; white-space: nowrap;
          transition: background 0.15s;
        }
        .btn-comment:hover { background: #1a3a8f; }

        .empty-state {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf8;
          text-align: center; padding: 56px 20px;
          color: #94a3b8; font-size: 13px;
        }
        .empty-state-icon { font-size: 32px; margin-bottom: 10px; }
      `}</style>

      {/* HEADER */}
      <div className="rap-header">
        <div>
          <h2>Rapports journaliers</h2>
          <p>{rapports.length} rapport(s) au total</p>
        </div>
        {user?.role === 'stagiaire' && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            + Envoyer mon rapport
          </button>
        )}
      </div>

      {/* FORM */}
      {showForm && user?.role === 'stagiaire' && (
        <div className="rap-form-card">
          <div className="rap-form-title">
            Rapport du {new Date().toLocaleDateString('fr-FR')}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Tâches réalisées aujourd'hui</label>
              <textarea
                rows="4"
                placeholder="Décrivez ce que vous avez accompli aujourd'hui..."
                value={form.taches_realisees}
                onChange={e => setForm({...form, taches_realisees: e.target.value})}
                required
              />
            </div>
            <div className="form-field">
              <label>Difficultés rencontrées</label>
              <textarea
                rows="3"
                placeholder="Quels problèmes avez-vous rencontrés ? (optionnel)"
                value={form.difficultes}
                onChange={e => setForm({...form, difficultes: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label>Tâches prévues demain</label>
              <textarea
                rows="3"
                placeholder="Que prévoyez-vous de faire demain ?"
                value={form.taches_demain}
                onChange={e => setForm({...form, taches_demain: e.target.value})}
              />
            </div>

            <div className="humeur-section">
              <div className="humeur-label">
                Humeur du jour
                <span className="humeur-emoji-display">{getHumeurEmoji(form.humeur)}</span>
              </div>
              <input
                type="range" min="1" max="5"
                value={form.humeur}
                onChange={e => setForm({...form, humeur: parseInt(e.target.value)})}
                className="humeur-slider"
              />
              <div className="humeur-labels">
                <span>😞 Difficile</span>
                <span>😐 Normal</span>
                <span>😄 Excellent</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={chargement}>
                {chargement ? 'Envoi...' : '✓ Envoyer le rapport'}
              </button>
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LIST */}
      <div className="rap-list">
        {rapports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p>Aucun rapport pour l'instant</p>
          </div>
        ) : (
          rapports.map((r, i) => {
            const humeurStyle = getHumeurStyle(r.humeur)
            return (
              <div key={i} className="rap-card">
                {/* Card header */}
                <div className="rap-card-header">
                  <div className="rap-card-user">
                    <div className="rap-avatar">
                      {r.stagiaire_id?.prenom?.[0]}{r.stagiaire_id?.nom?.[0]}
                    </div>
                    <div>
                      <div className="rap-user-name">
                        {r.stagiaire_id?.prenom} {r.stagiaire_id?.nom}
                      </div>
                      <div className="rap-user-date">
                        {new Date(r.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  <span
                    className="humeur-badge"
                    style={{ background: humeurStyle.bg, color: humeurStyle.color }}
                  >
                    {getHumeurEmoji(r.humeur)} {r.humeur}/5
                  </span>
                </div>

                {/* Card body */}
                <div className="rap-card-body">
                  <div className="rap-section">
                    <div className="rap-section-label">✅ Tâches réalisées</div>
                    <div className="rap-section-text">{r.taches_realisees}</div>
                  </div>

                  {r.difficultes && (
                    <>
                      <hr className="rap-divider" />
                      <div className="rap-section">
                        <div className="rap-section-label">⚠️ Difficultés</div>
                        <div className="rap-section-text">{r.difficultes}</div>
                      </div>
                    </>
                  )}

                  {r.taches_demain && (
                    <>
                      <hr className="rap-divider" />
                      <div className="rap-section">
                        <div className="rap-section-label">🗓️ Prévisions demain</div>
                        <div className="rap-section-text">{r.taches_demain}</div>
                      </div>
                    </>
                  )}

                  {r.commentaire_tuteur && (
                    <div className="tuteur-comment">
                      <div className="tuteur-comment-label">💬 Commentaire tuteur</div>
                      <div className="tuteur-comment-text">{r.commentaire_tuteur}</div>
                    </div>
                  )}

                  {(user?.role === 'tuteur' || user?.role === 'admin') && (
                    <div className="add-comment-row">
                      <input
                        className="add-comment-input"
                        placeholder="Laisser un commentaire..."
                        value={commentaire[r._id] || ''}
                        onChange={e => setCommentaire({...commentaire, [r._id]: e.target.value})}
                      />
                      <button className="btn-comment" onClick={() => handleCommentaire(r._id)}>
                        Envoyer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}

export default Rapports
