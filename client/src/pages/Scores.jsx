import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Scores() {
  const [scores, setScores] = useState([])
  const [stagiaires, setStagiaires] = useState([])
  const [chargement, setChargement] = useState(false)
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  const getScores = async () => {
    try {
      if (user?.role === 'stagiaire') {
        const res = await axios.get(`http://localhost:5000/api/scores/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setScores(res.data)
      } else {
        const res = await axios.get('http://localhost:5000/api/scores', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setScores(res.data)
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
    getScores()
    if (user?.role !== 'stagiaire') getStagiaires()
  }, [])

  const calculerScore = async (stagiaire_id, date_debut) => {
    setChargement(true)
    setMessage('')
    try {
      await axios.post('http://localhost:5000/api/scores/calculer',
        { stagiaire_id, date_debut },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Score calculé avec succès ✅')
      getScores()
    } catch (err) { console.log(err) }
    finally { setChargement(false) }
  }

  const getBadgeStyle = (badge) => {
    const map = {
      'performant':   { bg: '#f0fdf4', color: '#16a34a', label: '🟢 Performant' },
      'moyen':        { bg: '#fefce8', color: '#b45309', label: '🟡 Moyen' },
      'en_difficulte':{ bg: '#fff1f2', color: '#e11d48', label: '🔴 En difficulté' },
      'risque':       { bg: '#fff7ed', color: '#ea580c', label: '⚠️ Risque détecté' },
    }
    return map[badge] || map['moyen']
  }

  const getScoreRing = (score) => {
    if (score >= 70) return { color: '#16a34a', bg: '#f0fdf4', label: 'Performant' }
    if (score >= 40) return { color: '#b45309', bg: '#fefce8', label: 'Moyen' }
    return { color: '#e11d48', bg: '#fff1f2', label: 'En difficulté' }
  }

  const subScores = [
    { key: 'score_missions',   label: 'Missions',  max: 40, icon: '📋', color: '#1a56db' },
    { key: 'score_deadlines',  label: 'Deadlines', max: 30, icon: '⏱️', color: '#16a34a' },
    { key: 'score_rapports',   label: 'Rapports',  max: 20, icon: '📝', color: '#7c3aed' },
    { key: 'score_tuteur',     label: 'Tuteur',    max: 10, icon: '👨‍🏫', color: '#f97316' },
  ]

  return (
    <>
      <style>{`
        .sc-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .sc-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px; font-weight: 700; color: #0e2a6e;
        }
        .sc-header p { font-size: 13px; color: #64748b; margin-top: 3px; }

        /* CALCUL CARD */
        .sc-calcul-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf8; padding: 22px 24px;
          margin-bottom: 24px;
        }
        .sc-calcul-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 600; color: #0e2a6e;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .sc-calcul-title::before {
          content: ''; display: inline-block;
          width: 3px; height: 16px;
          background: #f97316; border-radius: 2px;
        }

        .sc-stag-list { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
        .sc-stag-btn {
          display: flex; align-items: center; gap: 8px;
          background: #f8faff; border: 1px solid #dbe4ff;
          border-radius: 10px; padding: 8px 14px;
          font-size: 13px; font-weight: 500; color: #1a56db;
          cursor: pointer; transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .sc-stag-btn:hover:not(:disabled) {
          background: #1a56db; color: #fff; border-color: #1a56db;
        }
        .sc-stag-btn:hover:not(:disabled) .sc-stag-av { background: rgba(255,255,255,0.25); color: #fff; }
        .sc-stag-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .sc-stag-av {
          width: 26px; height: 26px; border-radius: 6px;
          background: #dbe4ff; display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #1a56db;
          transition: all 0.15s; flex-shrink: 0;
        }

        .sc-loading {
          display: flex; align-items: center; gap: 10px;
          background: #eff4ff; border-radius: 10px;
          padding: 10px 14px; font-size: 13px; color: #1a56db; font-weight: 500;
        }
        .sc-spinner {
          width: 16px; height: 16px;
          border: 2px solid #bfcfff; border-top-color: #1a56db;
          border-radius: 50%; animation: sc-spin 0.7s linear infinite; flex-shrink: 0;
        }
        @keyframes sc-spin { to { transform: rotate(360deg); } }
        .sc-success {
          margin-top: 10px; font-size: 13px; color: #16a34a; font-weight: 500;
          background: #f0fdf4; border-radius: 8px; padding: 8px 12px; display: inline-block;
        }

        /* SCORE CARDS */
        .sc-list { display: flex; flex-direction: column; gap: 16px; }

        .sc-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf8; overflow: hidden;
        }
        .sc-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 22px; background: #f8faff;
          border-bottom: 1px solid #f1f5fb;
        }
        .sc-total-wrap { display: flex; align-items: center; gap: 14px; }
        .sc-stag-info { display: flex; flex-direction: column; gap: 4px; }
        .sc-stag-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 700; color: #0e2a6e;
        }
        .sc-stag-avatar-row { display: flex; align-items: center; gap: 8px; }
        .sc-stag-av {
          width: 28px; height: 28px; border-radius: 7px;
          background: #eff4ff; display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #1a56db; flex-shrink: 0;
        }

        .sc-ring {
          width: 64px; height: 64px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; flex-shrink: 0;
          border: 3px solid;
        }
        .sc-ring-num {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 17px; font-weight: 700; line-height: 1;
        }
        .sc-ring-den { font-size: 9px; font-weight: 600; opacity: 0.6; }

        .sc-badge {
          font-size: 12px; font-weight: 600;
          padding: 4px 12px; border-radius: 20px;
        }
        .sc-date { font-size: 11px; color: #94a3b8; background: #f1f5f9; padding: 4px 10px; border-radius: 20px; font-weight: 500; }

        .sc-card-body { padding: 18px 22px; }
        .sc-sub-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
        }
        .sc-sub-box {
          background: #f8faff; border-radius: 12px;
          padding: 14px; text-align: center;
          border: 1px solid #e8edf8;
          transition: transform 0.15s;
        }
        .sc-sub-box:hover { transform: translateY(-2px); }
        .sc-sub-icon { font-size: 18px; margin-bottom: 6px; }
        .sc-sub-label { font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; }
        .sc-sub-score {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px; font-weight: 700; color: #0e2a6e; margin-bottom: 8px;
        }
        .sc-sub-den { font-size: 11px; color: #94a3b8; font-weight: 500; }
        .sc-bar-bg { width: 100%; height: 5px; background: #e8edf8; border-radius: 3px; }
        .sc-bar-fill { height: 5px; border-radius: 3px; transition: width 0.4s; }

        .empty-state {
          background: #fff; border-radius: 16px; border: 1px solid #e8edf8;
          text-align: center; padding: 56px 20px; color: #94a3b8; font-size: 13px;
        }
        .empty-icon { font-size: 32px; margin-bottom: 10px; }
      `}</style>

      {/* HEADER */}
      <div className="sc-header">
        <div>
          <h2>Scores & Performance</h2>
          <p>{user?.role === 'stagiaire' ? 'Mon historique de scores' : 'Scores de tous les stagiaires'}</p>
        </div>
      </div>

      {/* CALCUL */}
      {(user?.role === 'admin' || user?.role === 'tuteur') && (
        <div className="sc-calcul-card">
          <div className="sc-calcul-title">Calculer le score d'un stagiaire</div>
          <div className="sc-stag-list">
            {stagiaires.map(s => (
              <button
                key={s._id}
                className="sc-stag-btn"
                onClick={() => calculerScore(s.user_id?._id, s.date_debut)}
                disabled={chargement}
              >
                <div className="sc-stag-av">
                  {s.user_id?.prenom?.[0]}{s.user_id?.nom?.[0]}
                </div>
                {s.user_id?.prenom} {s.user_id?.nom}
              </button>
            ))}
          </div>
          {chargement && (
            <div className="sc-loading">
              <div className="sc-spinner" /> Calcul du score en cours...
            </div>
          )}
          {message && <div className="sc-success">{message}</div>}
        </div>
      )}

      {/* SCORES LIST */}
      {scores.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <p>Aucun score calculé pour l'instant</p>
        </div>
      ) : (
        <div className="sc-list">
          {scores.map((s, i) => {
            const badge = getBadgeStyle(s.badge)
            const ring = getScoreRing(s.score_total)
            return (
              <div key={i} className="sc-card">
                <div className="sc-card-header">
                  <div className="sc-total-wrap">
                    <div
                      className="sc-ring"
                      style={{ borderColor: ring.color, background: ring.bg }}
                    >
                      <span className="sc-ring-num" style={{ color: ring.color }}>{s.score_total}</span>
                      <span className="sc-ring-den" style={{ color: ring.color }}>/100</span>
                    </div>
                    <div className="sc-stag-info">
                      <div className="sc-stag-avatar-row">
                        <div className="sc-stag-av">
                          {s.stagiaire_id?.prenom?.[0]}{s.stagiaire_id?.nom?.[0]}
                        </div>
                        <span className="sc-stag-name">
                          {s.stagiaire_id?.prenom} {s.stagiaire_id?.nom}
                        </span>
                      </div>
                      <span className="sc-badge" style={{ background: badge.bg, color: badge.color, alignSelf: 'flex-start' }}>
                        {badge.label}
                      </span>
                    </div>
                  </div>
                  <span className="sc-date">
                    {new Date(s.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <div className="sc-card-body">
                  <div className="sc-sub-grid">
                    {subScores.map(sub => (
                      <div key={sub.key} className="sc-sub-box">
                        <div className="sc-sub-icon">{sub.icon}</div>
                        <div className="sc-sub-label">{sub.label}</div>
                        <div className="sc-sub-score">
                          {s[sub.key]}
                          <span className="sc-sub-den">/{sub.max}</span>
                        </div>
                        <div className="sc-bar-bg">
                          <div
                            className="sc-bar-fill"
                            style={{
                              width: `${(s[sub.key] / sub.max) * 100}%`,
                              background: sub.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default Scores
