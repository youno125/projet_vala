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
    } catch (err) { console.log(err) }
    finally { setChargement(false) }
  }

  const critereLabels = {
    competences_techniques: 'Compétences techniques',
    autonomie: 'Autonomie',
    qualite_travail: 'Qualité du travail',
    respect_delais: 'Respect des délais',
    communication: 'Communication',
    ponctualite: 'Ponctualité'
  }

  const critereIcons = {
    competences_techniques: '💻',
    autonomie: '🧭',
    qualite_travail: '✨',
    respect_delais: '⏱️',
    communication: '💬',
    ponctualite: '📅'
  }

  const getMoyenne = (criteres) => {
    const vals = Object.values(criteres)
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
  }

  const getMoyenneColor = (avg) => {
    if (avg >= 4) return { color: '#16a34a', bg: '#f0fdf4' }
    if (avg >= 3) return { color: '#1a56db', bg: '#eff4ff' }
    if (avg >= 2) return { color: '#ea580c', bg: '#fff7ed' }
    return { color: '#e11d48', bg: '#fff1f2' }
  }

  const getBarColor = (note) => {
    if (note >= 4) return '#16a34a'
    if (note >= 3) return '#1a56db'
    if (note >= 2) return '#ea580c'
    return '#e11d48'
  }

  return (
    <>
      <style>{`
        .eval-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .eval-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px; font-weight: 700; color: #0e2a6e;
        }
        .eval-header p { font-size: 13px; color: #64748b; margin-top: 3px; }

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
        .eval-form-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf8; padding: 24px; margin-bottom: 24px;
        }
        .eval-form-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 600; color: #0e2a6e;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .eval-form-title::before {
          content: ''; display: inline-block;
          width: 3px; height: 16px;
          background: #f97316; border-radius: 2px;
        }

        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
        .form-field label {
          display: block; font-size: 11px; font-weight: 600;
          color: #0e2a6e; text-transform: uppercase;
          letter-spacing: 0.05em; margin-bottom: 6px;
        }
        .form-field select, .form-field textarea {
          width: 100%; background: #f8faff;
          border: 1.5px solid #dbe4ff; border-radius: 10px;
          padding: 10px 13px; font-size: 13.5px;
          font-family: 'DM Sans', sans-serif; color: #0f172a;
          outline: none; resize: vertical;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .form-field select:focus, .form-field textarea:focus {
          border-color: #1a56db;
          box-shadow: 0 0 0 3px rgba(26,86,219,0.09);
          background: #fff;
        }
        .form-field textarea::placeholder { color: #94a3b8; }

        .criteres-section { margin-bottom: 20px; }
        .criteres-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 600; color: #0e2a6e;
          margin-bottom: 14px;
          display: flex; align-items: center; gap: 6px;
        }
        .critere-row {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 12px;
        }
        .critere-label {
          font-size: 12.5px; color: #334155; font-weight: 500;
          width: 200px; flex-shrink: 0;
          display: flex; align-items: center; gap: 6px;
        }
        .critere-slider {
          flex: 1; height: 5px;
          -webkit-appearance: none; appearance: none;
          background: #dbe4ff; border-radius: 3px;
          outline: none; cursor: pointer;
        }
        .critere-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px; border-radius: 50%;
          background: #fff; border: 2px solid #1a56db;
          box-shadow: 0 2px 6px rgba(26,86,219,0.2);
          cursor: pointer;
        }
        .critere-score {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 700; color: #0e2a6e;
          width: 32px; text-align: right; flex-shrink: 0;
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
        .btn-cancel:hover { background: #f1f5f9; }

        /* EVAL CARDS */
        .eval-list { display: flex; flex-direction: column; gap: 16px; }

        .eval-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf8; overflow: hidden;
        }
        .eval-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 22px;
          background: #f8faff;
          border-bottom: 1px solid #f1f5fb;
        }
        .eval-card-left {}
        .eval-stag-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 700; color: #0e2a6e;
        }
        .eval-meta {
          font-size: 11px; color: #94a3b8; margin-top: 3px;
          display: flex; align-items: center; gap: 6px;
        }
        .eval-type-pill {
          font-size: 10px; font-weight: 600;
          padding: 2px 8px; border-radius: 20px;
          background: #eff4ff; color: #1a56db;
        }
        .eval-type-pill.finale { background: #faf5ff; color: #7c3aed; }

        .eval-score-box {
          text-align: center;
          padding: 8px 16px;
          border-radius: 12px;
        }
        .eval-score-num {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px; font-weight: 700; line-height: 1;
        }
        .eval-score-label { font-size: 10px; font-weight: 600; margin-top: 2px; opacity: 0.7; }

        .eval-card-body { padding: 18px 22px; }

        .criteres-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 10px; margin-bottom: 14px;
        }
        .critere-box {
          background: #f8faff; border-radius: 10px;
          padding: 10px 12px;
          border: 1px solid #e8edf8;
        }
        .critere-box-label {
          font-size: 10px; color: #94a3b8; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.04em;
          margin-bottom: 6px;
          display: flex; align-items: center; gap: 4px;
        }
        .critere-box-score {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 700; color: #0e2a6e;
          margin-bottom: 6px;
        }
        .critere-bar-bg {
          width: 100%; height: 4px;
          background: #e8edf8; border-radius: 2px;
        }
        .critere-bar-fill {
          height: 4px; border-radius: 2px;
          transition: width 0.3s;
        }

        .eval-comment {
          background: #eff4ff;
          border-left: 3px solid #1a56db;
          border-radius: 0 10px 10px 0;
          padding: 10px 14px;
        }
        .eval-comment-label {
          font-size: 10px; font-weight: 700; color: #1a56db;
          text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px;
        }
        .eval-comment-text { font-size: 13px; color: #1e3a8a; line-height: 1.6; }

        .empty-state {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf8;
          text-align: center; padding: 56px 20px;
          color: #94a3b8; font-size: 13px;
        }
        .empty-state-icon { font-size: 32px; margin-bottom: 10px; }
      `}</style>

      {/* HEADER */}
      <div className="eval-header">
        <div>
          <h2>Évaluations</h2>
          <p>{evaluations.length} évaluation(s) au total</p>
        </div>
        {user?.role === 'tuteur' && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            + Nouvelle évaluation
          </button>
        )}
      </div>

      {/* FORM */}
      {showForm && (
        <div className="eval-form-card">
          <div className="eval-form-title">Nouvelle évaluation</div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-field">
                <label>Stagiaire</label>
                <select
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
              <div className="form-field">
                <label>Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="mi_stage">Mi-stage</option>
                  <option value="finale">Finale</option>
                </select>
              </div>
            </div>

            <div className="criteres-section">
              <div className="criteres-title">⭐ Évaluation tuteur</div>
              {Object.keys(form.criteres).map(key => (
                <div key={key} className="critere-row">
                  <div className="critere-label">
                    <span>{critereIcons[key]}</span>
                    {critereLabels[key]}
                  </div>
                  <input
                    type="range" min="1" max="5"
                    value={form.criteres[key]}
                    onChange={e => setForm({
                      ...form,
                      criteres: {...form.criteres, [key]: parseInt(e.target.value)}
                    })}
                    className="critere-slider"
                  />
                  <span className="critere-score">{form.criteres[key]}/5</span>
                </div>
              ))}
            </div>

            <div className="form-field" style={{ marginBottom: '20px' }}>
              <label>Commentaire global</label>
              <textarea
                rows="3"
                value={form.commentaire_global}
                onChange={e => setForm({...form, commentaire_global: e.target.value})}
                placeholder="Observations générales sur le stagiaire..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={chargement}>
                {chargement ? 'Enregistrement...' : "✓ Enregistrer l'évaluation"}
              </button>
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LIST */}
      <div className="eval-list">
        {evaluations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⭐</div>
            <p>Aucune évaluation pour l'instant</p>
          </div>
        ) : (
          evaluations.map((e, i) => {
            const avg = parseFloat(getMoyenne(e.criteres))
            const avgStyle = getMoyenneColor(avg)
            return (
              <div key={i} className="eval-card">
                <div className="eval-card-header">
                  <div className="eval-card-left">
                    <div className="eval-stag-name">
                      {e.stagiaire_id?.prenom} {e.stagiaire_id?.nom}
                    </div>
                    <div className="eval-meta">
                      <span className={`eval-type-pill${e.type === 'finale' ? ' finale' : ''}`}>
                        {e.type === 'mi_stage' ? 'Mi-stage' : 'Finale'}
                      </span>
                      par {e.tuteur_id?.prenom} {e.tuteur_id?.nom}
                    </div>
                  </div>
                  <div className="eval-score-box" style={{ background: avgStyle.bg }}>
                    <div className="eval-score-num" style={{ color: avgStyle.color }}>{avg}/5</div>
                    <div className="eval-score-label" style={{ color: avgStyle.color }}>Moyenne</div>
                  </div>
                </div>

                <div className="eval-card-body">
                  <div className="criteres-grid">
                    {Object.keys(e.criteres).map(key => (
                      <div key={key} className="critere-box">
                        <div className="critere-box-label">
                          {critereIcons[key]} {critereLabels[key]}
                        </div>
                        <div className="critere-box-score">{e.criteres[key]}/5</div>
                        <div className="critere-bar-bg">
                          <div
                            className="critere-bar-fill"
                            style={{
                              width: `${(e.criteres[key] / 5) * 100}%`,
                              background: getBarColor(e.criteres[key])
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {e.commentaire_global && (
                    <div className="eval-comment">
                      <div className="eval-comment-label">💬 Commentaire</div>
                      <div className="eval-comment-text">{e.commentaire_global}</div>
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

export default Evaluations
