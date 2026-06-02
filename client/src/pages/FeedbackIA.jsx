import React, { useState, useEffect } from 'react'
import axios from 'axios'

function FeedbackIA() {
  const [feedbacks, setFeedbacks] = useState([])
  const [stagiaires, setStagiaires] = useState([])
  const [chargement, setChargement] = useState(false)
  const [message, setMessage] = useState('')
  const [stagiaireSelectionne, setStagiaireSelectionne] = useState('')

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

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

  const getFeedbacks = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/ia/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFeedbacks(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
  if (user?.role === 'stagiaire') {
    getFeedbacks(user.id)
  } else if (user?.role === 'directeur') {
    getFeedbacks('all')
  } else {
    getStagiaires()
  }
}, [])

  const handleGenerer = async (stagiaireUserId) => {
    setChargement(true)
    setMessage('')
    try {
      await axios.post('http://localhost:5000/api/ia/feedback',
        { stagiaire_id: stagiaireUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Feedback généré avec succès ✅')
      getFeedbacks(stagiaireUserId)
      setStagiaireSelectionne(stagiaireUserId)
    } catch (err) {
      setMessage('Erreur lors de la génération ❌')
      console.log(err)
    } finally {
      setChargement(false)
    }
  }

  const sections = [
    { key: 'resume',           icon: '📋', label: 'Résumé',              bg: '#eff4ff', border: '#bfcfff', labelColor: '#1a56db', textColor: '#1e3a8a' },
    { key: 'points_forts',     icon: '💪', label: 'Points forts',        bg: '#f0fdf4', border: '#bbf7d0', labelColor: '#16a34a', textColor: '#14532d' },
    { key: 'conseils',         icon: '💡', label: 'Conseils',            bg: '#fff7ed', border: '#fed7aa', labelColor: '#ea580c', textColor: '#7c2d12' },
    { key: 'explication_score',icon: '📊', label: 'Explication du score',bg: '#faf5ff', border: '#e9d5ff', labelColor: '#7c3aed', textColor: '#3b0764' },
    { key: 'alerte',           icon: '⚠️', label: 'Alerte',              bg: '#fff1f2', border: '#fecdd3', labelColor: '#e11d48', textColor: '#881337' },
  ]

  return (
    <>
      <style>{`
        .fia-header { margin-bottom: 24px; }
        .fia-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px; font-weight: 700; color: #0e2a6e;
        }
        .fia-header p { font-size: 13px; color: #64748b; margin-top: 3px; }

        .fia-generate-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8edf8;
          padding: 22px 24px;
          margin-bottom: 24px;
        }
        .fia-generate-card h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 600; color: #0e2a6e;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .fia-generate-card h3::before {
          content: '';
          display: inline-block;
          width: 3px; height: 16px;
          background: #f97316;
          border-radius: 2px;
        }

        .fia-stagiaires-list {
          display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px;
        }
        .fia-stag-btn {
          display: flex; align-items: center; gap: 8px;
          background: #f8faff;
          border: 1px solid #dbe4ff;
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 13px; font-weight: 500; color: #1a56db;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .fia-stag-btn:hover:not(:disabled) {
          background: #1a56db; color: #fff; border-color: #1a56db;
        }
        .fia-stag-btn:hover:not(:disabled) .fia-stag-avatar {
          background: rgba(255,255,255,0.25); color: #fff;
        }
        .fia-stag-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .fia-stag-avatar {
          width: 26px; height: 26px;
          border-radius: 6px;
          background: #dbe4ff;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #1a56db;
          flex-shrink: 0;
          transition: all 0.15s;
        }

        .fia-loading {
          display: flex; align-items: center; gap: 10px;
          background: #eff4ff; border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px; color: #1a56db; font-weight: 500;
        }
        .fia-spinner {
          width: 16px; height: 16px;
          border: 2px solid #bfcfff;
          border-top-color: #1a56db;
          border-radius: 50%;
          animation: fia-spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes fia-spin { to { transform: rotate(360deg); } }

        .fia-success {
          margin-top: 10px;
          font-size: 13px; color: #16a34a; font-weight: 500;
          background: #f0fdf4; border-radius: 8px;
          padding: 8px 12px;
          display: inline-block;
        }

        .fia-empty {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf8;
          padding: 60px 24px;
          text-align: center;
        }
        .fia-empty-icon {
          font-size: 36px; margin-bottom: 12px;
        }
        .fia-empty p { font-size: 13px; color: #94a3b8; }

        .fia-feedback-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8edf8;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .fia-feedback-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 22px;
          border-bottom: 1px solid #f1f5fb;
          background: #f8faff;
        }
        .fia-feedback-title {
          display: flex; align-items: center; gap: 10px;
        }
        .fia-robot-icon {
          width: 34px; height: 34px;
          background: #0e2a6e;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .fia-feedback-title-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 600; color: #0e2a6e;
        }
        .fia-feedback-date {
          font-size: 11px; color: #94a3b8;
          background: #f1f5f9; padding: 4px 10px;
          border-radius: 20px; font-weight: 500;
        }

        .fia-sections { padding: 18px 22px; display: flex; flex-direction: column; gap: 12px; }

        .fia-section {
          border-radius: 12px;
          padding: 14px 16px;
          border-left: 3px solid transparent;
        }
        .fia-section-label {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 6px;
          display: flex; align-items: center; gap: 5px;
        }
        .fia-section-text {
          font-size: 13.5px; line-height: 1.65;
        }
      `}</style>

      <div className="fia-header">
        <h2>Module IA — Feedback</h2>
        <p>Analyse automatique des performances par intelligence artificielle</p>
      </div>

      {(user?.role === 'admin' || user?.role === 'tuteur') && (
        <div className="fia-generate-card">
          <h3>Générer un feedback IA pour un stagiaire</h3>
          <div className="fia-stagiaires-list">
            {stagiaires.map(s => (
              <button
                key={s._id}
                onClick={() => handleGenerer(s.user_id?._id)}
                disabled={chargement}
                className="fia-stag-btn"
              >
                <div className="fia-stag-avatar">
                  {s.user_id?.prenom?.[0]}{s.user_id?.nom?.[0]}
                </div>
                {s.user_id?.prenom} {s.user_id?.nom}
              </button>
            ))}
          </div>
          {chargement && (
            <div className="fia-loading">
              <div className="fia-spinner"></div>
              L'IA analyse les données en cours...
            </div>
          )}
          {message && <div className="fia-success">{message}</div>}
        </div>
      )}

      <div>
        {feedbacks.length === 0 ? (
          <div className="fia-empty">
            <div className="fia-empty-icon">🤖</div>
            <p>
              {user?.role === 'stagiaire'
  ? 'Aucun feedback IA généré pour vous encore'
  : user?.role === 'directeur'
    ? 'Aucun feedback IA généré pour l\'instant'
    : 'Cliquez sur un stagiaire pour générer son feedback'}
</p>
          </div>
        ) : (
          feedbacks.map((f, i) => (
            <div key={i} className="fia-feedback-card">
              <div className="fia-feedback-header">
                <div className="fia-feedback-title">
                  <div className="fia-robot-icon">🤖</div>
                  <div>
                    <div className="fia-feedback-title-text">Feedback IA</div>
                  </div>
                </div>
                <span className="fia-feedback-date">
                  {new Date(f.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>

              <div className="fia-sections">
                {sections.map(sec => f[sec.key] && (
                  <div
                    key={sec.key}
                    className="fia-section"
                    style={{
                      background: sec.bg,
                      borderLeftColor: sec.border,
                    }}
                  >
                    <div className="fia-section-label" style={{ color: sec.labelColor }}>
                      <span>{sec.icon}</span> {sec.label}
                    </div>
                    <div className="fia-section-text" style={{ color: sec.textColor }}>
                      {f[sec.key]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default FeedbackIA
