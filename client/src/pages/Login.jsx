import React, { useState } from 'react'
import axios from 'axios'

function Login() {
  const [email, setEmail] = useState('')
  const [mot_de_passe, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setChargement(true)
    setErreur('')
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email, mot_de_passe
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = '/dashboard'
    } catch (err) {
      setErreur(err.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setChargement(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── LEFT PANEL ── */
        .login-left {
          display: none;
          width: 50%;
          background: linear-gradient(145deg, #0b1f5c 0%, #1a56db 60%, #1e40af 100%);
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 768px) { .login-left { display: flex; } }

        /* decorative circles */
        .login-left::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 280px; height: 280px;
          border-radius: 50%;
          background: rgba(249,115,22,0.15);
          pointer-events: none;
        }
        .login-left::after {
          content: '';
          position: absolute;
          bottom: -100px; left: -60px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          pointer-events: none;
        }

        .login-brand {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 40px;
          z-index: 1;
        }
        .login-brand-icon {
          width: 48px; height: 48px;
          background: #f97316;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 22px; color: #fff;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(249,115,22,0.4);
        }
        .login-brand-name {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 22px; color: #fff;
        }
        .login-brand-sub {
          font-size: 11px; color: rgba(255,255,255,0.5);
          margin-top: 2px;
        }

        .login-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px; font-weight: 700; color: #fff;
          text-align: center; line-height: 1.3;
          margin-bottom: 12px; z-index: 1;
        }
        .login-sub {
          font-size: 13.5px; color: rgba(255,255,255,0.65);
          text-align: center; line-height: 1.7;
          max-width: 320px; margin-bottom: 40px; z-index: 1;
        }

        .login-features {
          width: 100%; max-width: 300px;
          display: flex; flex-direction: column; gap: 10px;
          z-index: 1;
        }
        .login-feature {
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 12px 16px;
          backdrop-filter: blur(4px);
          transition: background 0.2s;
        }
        .login-feature:hover { background: rgba(255,255,255,0.13); }
        .login-feature-icon {
          font-size: 20px; flex-shrink: 0;
        }
        .login-feature-title {
          font-size: 13px; font-weight: 600; color: #fff;
        }
        .login-feature-desc {
          font-size: 11px; color: rgba(255,255,255,0.5);
          margin-top: 1px;
        }

        /* orange accent bar bottom left */
        .login-accent-bar {
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 4px;
          background: linear-gradient(90deg, #f97316, transparent);
        }

        /* ── RIGHT PANEL ── */
        .login-right {
          width: 100%;
          display: flex; align-items: center; justify-content: center;
          padding: 32px 24px;
          background: #f0f4ff;
        }
        @media (min-width: 768px) { .login-right { width: 50%; } }

        .login-form-box {
          width: 100%; max-width: 400px;
        }

        .login-form-header { margin-bottom: 32px; }
        .login-form-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 26px; font-weight: 700; color: #0e2a6e;
          margin-bottom: 4px;
        }
        .login-form-header p {
          font-size: 13.5px; color: #64748b;
        }

        .login-form { display: flex; flex-direction: column; gap: 18px; }

        .login-field label {
          display: block;
          font-size: 12px; font-weight: 600;
          color: #0e2a6e; text-transform: uppercase;
          letter-spacing: 0.05em; margin-bottom: 6px;
        }
        .login-field input {
          width: 100%;
          background: #fff;
          border: 1.5px solid #dbe4ff;
          border-radius: 12px;
          padding: 13px 16px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .login-field input::placeholder { color: #94a3b8; }
        .login-field input:focus {
          border-color: #1a56db;
          box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
        }

        .login-error {
          display: flex; align-items: center; gap: 8px;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 13px; color: #e11d48;
        }

        .login-submit {
          width: 100%;
          background: #f97316;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 4px 14px rgba(249,115,22,0.35);
          margin-top: 4px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .login-submit:hover:not(:disabled) {
          background: #ea6c0a;
          box-shadow: 0 6px 20px rgba(249,115,22,0.45);
          transform: translateY(-1px);
        }
        .login-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        .login-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .login-footer {
          text-align: center;
          font-size: 11px; color: #94a3b8;
          margin-top: 28px;
        }
      `}</style>

      <div className="login-root">

        {/* LEFT */}
        <div className="login-left">
          <div className="login-brand">
            <div className="login-brand-icon">V</div>
            <div>
              <div className="login-brand-name">VALA</div>
              <div className="login-brand-sub">Gestionnaire des Stagiaires</div>
            </div>
          </div>

          <h1 className="login-headline">Smart Intern<br />Performance</h1>
          <p className="login-sub">
            Gérez vos stagiaires, suivez leurs performances et générez des feedbacks intelligents grâce à l'IA.
          </p>

          <div className="login-features">
            {[
              { icon: '📊', title: 'Scoring automatique', desc: 'Score /100 calculé en temps réel' },
              { icon: '🤖', title: 'Feedback IA',         desc: 'Analyse et conseils personnalisés' },
              { icon: '📄', title: 'Attestation PDF',     desc: 'Générée automatiquement' },
            ].map((f, i) => (
              <div className="login-feature" key={i}>
                <span className="login-feature-icon">{f.icon}</span>
                <div>
                  <div className="login-feature-title">{f.title}</div>
                  <div className="login-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="login-accent-bar" />
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <div className="login-form-box">
            <div className="login-form-header">
              <h2>Bienvenue 👋</h2>
              <p>Connectez-vous à votre espace SIPMS</p>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="login-field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className="login-field">
                <label>Mot de passe</label>
                <input
                  type="password"
                  value={mot_de_passe}
                  onChange={e => setMotDePasse(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {erreur && (
                <div className="login-error">
                  <span>⚠️</span> {erreur}
                </div>
              )}

              <button type="submit" disabled={chargement} className="login-submit">
                {chargement
                  ? <><div className="login-spinner" /> Connexion...</>
                  : 'Se connecter →'}
              </button>
            </form>

            <div className="login-footer">
              Creative Internet Solutions (VALA) — SIPMS v1.0
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Login
