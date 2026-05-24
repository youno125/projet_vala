import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Stagiaires from './Stagiaires'
import Missions from './Missions'
import Rapports from './Rapports'
import Scores from './Scores'
import Evaluations from './Evaluations'
import FeedbackIA from './FeedbackIA'
import ChangerMotDePasse from './ChangerMotDePasse'
import Utilisateurs from './Utilisateurs'

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const token = localStorage.getItem('token')

  const getStats = async () => {
    try {
      if (user?.role === 'stagiaire') {
        const res = await axios.get('http://localhost:5000/api/dashboard/stats/stagiaire', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setStats(res.data)
      } else {
        const res = await axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setStats(res.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getStats()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const allMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'tuteur', 'directeur', 'stagiaire'] },
    { id: 'stagiaires', label: 'Stagiaires', icon: '👨‍🎓', roles: ['admin', 'tuteur', 'directeur'] },
    { id: 'missions', label: 'Missions', icon: '📋', roles: ['admin', 'tuteur', 'directeur', 'stagiaire'] },
    { id: 'rapports', label: 'Rapports', icon: '📝', roles: ['admin', 'tuteur', 'directeur', 'stagiaire'] },
    { id: 'evaluations', label: 'Évaluations', icon: '⭐', roles: ['admin', 'tuteur', 'directeur', 'stagiaire'] },
    { id: 'scores', label: 'Scores', icon: '🏆', roles: ['admin', 'tuteur', 'directeur', 'stagiaire'] },
    { id: 'feedback_ia', label: 'Feedback IA', icon: '🤖', roles: ['admin', 'tuteur', 'directeur', 'stagiaire'] },
    { id: 'utilisateurs', label: 'Utilisateurs', icon: '👥', roles: ['admin', 'directeur'] },
    { id: 'profil', label: 'Mon profil', icon: '👤', roles: ['admin', 'tuteur', 'directeur', 'stagiaire'] },
  ]

  const menuItems = allMenus.filter(m => m.roles.includes(user?.role))

  const getBadgeStyle = (badge) => {
    const styles = {
      'performant': 'badge-green',
      'moyen': 'badge-yellow',
      'en_difficulte': 'badge-red',
      'risque': 'badge-orange'
    }
    const labels = {
      'performant': '🟢 Performant',
      'moyen': '🟡 Moyen',
      'en_difficulte': '🔴 En difficulté',
      'risque': '⚠️ Risque'
    }
    return { style: styles[badge] || styles['moyen'], label: labels[badge] || labels['moyen'] }
  }

  const statCards = user?.role === 'stagiaire'
    ? [
        { label: 'Mes missions', value: stats?.mesMissions ?? '—', icon: '📋', accent: '#1a56db' },
        { label: 'Missions terminées', value: stats?.missionsTerminees ?? '—', icon: '✅', accent: '#16a34a' },
        { label: 'Mes rapports', value: stats?.mesRapports ?? '—', icon: '📝', accent: '#7c3aed' },
        { label: 'Mon score', value: stats?.monScore != null ? `${stats.monScore}/100` : '—', icon: '🏆', accent: '#f97316' },
      ]
    : [
        { label: 'Stagiaires actifs', value: stats?.totalStagiaires ?? '—', icon: '👨‍🎓', accent: '#1a56db' },
        { label: 'Missions en cours', value: stats?.missionsEnCours ?? '—', icon: '📋', accent: '#16a34a' },
        { label: "Rapports aujourd'hui", value: stats?.rapportsAujourdhui ?? '—', icon: '📝', accent: '#7c3aed' },
        { label: 'Score moyen', value: stats?.scoreMoyen != null ? `${stats.scoreMoyen}/100` : '—', icon: '🏆', accent: '#f97316' },
      ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          background: #f0f4ff;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
        }

        /* ── SIDEBAR ── */
        .sidebar {
          width: 230px;
          height: 100vh;
          background: #0e2a6e;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          overflow: hidden;
        }
        .sidebar::before {
          content: '';
          position: absolute;
          bottom: -60px;
          right: -60px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: rgba(249,115,22,0.15);
          pointer-events: none;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px 18px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .logo-icon {
          width: 36px;
          height: 36px;
          background: #f97316;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #fff;
          flex-shrink: 0;
        }
        .logo-text p:first-child {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: #fff;
        }
        .logo-text p:last-child {
          font-size: 10px;
          color: rgba(255,255,255,0.45);
          margin-top: 1px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          padding: 10px 8px 4px;
        }

        .nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.6);
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
          text-align: left;
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.07);
          color: #fff;
        }
        .nav-btn.active {
          background: #f97316;
          color: #fff;
          font-weight: 600;
        }
        .nav-btn .nav-icon { font-size: 15px; }

        .sidebar-footer {
          padding: 14px 14px 18px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .user-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s;
          margin-bottom: 8px;
        }
        .user-chip:hover { background: rgba(255,255,255,0.07); }
        .avatar-sm {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(249,115,22,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #fdba74;
          flex-shrink: 0;
        }
        .user-chip-name {
          font-size: 12px;
          font-weight: 600;
          color: #fff;
        }
        .user-chip-role {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          margin-top: 1px;
          text-transform: capitalize;
        }
        .logout-btn {
          width: 100%;
          background: rgba(239,68,68,0.12);
          border: none;
          border-radius: 8px;
          color: #fca5a5;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 7px 12px;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.22); }

        /* ── MAIN ── */
        .main {
          flex: 1;
          padding: 28px 32px;
          overflow-y: auto;
          overflow-x: hidden;
          min-width: 0;
          min-height: 100vh;
        }

        .page-header { margin-bottom: 24px; }
        .page-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #0e2a6e;
        }
        .page-header p {
          font-size: 13px;
          color: #64748b;
          margin-top: 3px;
        }

        /* stat cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .stat-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          border: 1.5px solid transparent;
          position: relative;
          overflow: hidden;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(14,42,110,0.10); }
        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .stat-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
        }
        .stat-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #0e2a6e;
        }
        .stat-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 0 0 16px 16px;
        }

        /* table card */
        .table-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8edf8;
          overflow: hidden;
        }
        .table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 22px;
          border-bottom: 1px solid #f1f5fb;
        }
        .table-header p {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #0e2a6e;
        }
        .table-header span {
          font-size: 11px;
          background: #eff4ff;
          color: #1a56db;
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: 600;
        }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: #f8faff; }
        th {
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 11px 22px;
          border-bottom: 1px solid #f1f5fb;
        }
        tbody tr { border-bottom: 1px solid #f8faff; transition: background 0.12s; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #f8faff; }
        td { padding: 14px 22px; font-size: 13.5px; color: #334155; }

        .td-avatar {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: #eff4ff;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #1a56db;
          flex-shrink: 0;
        }
        .td-name { font-weight: 600; color: #0f172a; font-size: 13.5px; }
        .td-sub { font-size: 11px; color: #94a3b8; margin-top: 1px; }

        /* badges */
        .badge-green  { background:#dcfce7; color:#15803d; font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; white-space:nowrap; }
        .badge-yellow { background:#fef9c3; color:#b45309; font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; white-space:nowrap; }
        .badge-red    { background:#fee2e2; color:#b91c1c; font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; white-space:nowrap; }
        .badge-orange { background:#ffedd5; color:#c2410c; font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; white-space:nowrap; }

        /* profile */
        .profile-card {
          background: #fff;
          border-radius: 18px;
          border: 1px solid #e8edf8;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .profile-banner {
          height: 88px;
          background: linear-gradient(120deg, #0e2a6e 0%, #1a56db 100%);
          position: relative;
        }
        .profile-banner::after {
          content: '';
          position: absolute;
          right: 30px; top: 10px;
          width: 80px; height: 80px;
          border-radius: 50%;
          background: rgba(249,115,22,0.2);
        }
        .profile-avatar {
          position: absolute;
          bottom: -22px; left: 24px;
          width: 52px; height: 52px;
          border-radius: 14px;
          background: #fff;
          border: 3px solid #fff;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 18px;
          color: #1a56db;
          box-shadow: 0 4px 12px rgba(14,42,110,0.15);
        }
        .profile-body { padding: 36px 24px 24px; }
        .profile-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px; font-weight: 700; color: #0e2a6e;
        }
        .profile-email { font-size: 13px; color: #64748b; margin-top: 2px; margin-bottom: 12px; }

        .role-pill {
          display: inline-block;
          font-size: 11px; font-weight: 600;
          padding: 4px 12px; border-radius: 20px;
          margin-bottom: 20px;
        }
        .role-admin    { background:#f3e8ff; color:#7c3aed; }
        .role-tuteur   { background:#eff4ff; color:#1a56db; }
        .role-directeur{ background:#f1f5f9; color:#475569; }
        .role-stagiaire{ background:#dcfce7; color:#15803d; }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 8px;
        }
        .info-box {
          background: #f8faff;
          border-radius: 12px;
          padding: 12px 14px;
          border: 1px solid #e8edf8;
        }
        .info-box-label { font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .info-box-value { font-size: 13.5px; font-weight: 600; color: #0e2a6e; }

        .password-card {
          background: #fff;
          border-radius: 18px;
          border: 1px solid #e8edf8;
          padding: 22px 24px;
        }
        .password-card h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 600; color: #0e2a6e;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 6px;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #94a3b8;
          font-size: 13px;
        }

        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="dash-root">

        {/* ── SIDEBAR ── */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">V</div>
            <div className="logo-text">
              <p>VALA</p>
              <p>Gestion des stagiaires</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-label">Navigation</div>
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`nav-btn${activeMenu === item.id ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-chip" onClick={() => setActiveMenu('profil')}>
              <div className="avatar-sm">
                {user?.prenom?.[0]}{user?.nom?.[0]}
              </div>
              <div>
                <div className="user-chip-name">{user?.prenom} {user?.nom}</div>
                <div className="user-chip-role">{user?.role}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Déconnexion
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="main">

          {activeMenu === 'dashboard' && (
            <div>
              <div className="page-header">
                <h2>Bonjour, {user?.prenom} 👋</h2>
                <p>
                  {user?.role === 'stagiaire'
                    ? 'Bienvenue sur votre espace stagiaire'
                    : 'Voici le tableau de bord de votre application'}
                </p>
              </div>

              {/* Stat cards */}
              <div className="stats-grid">
                {statCards.map((card, i) => (
                  <div className="stat-card" key={i}>
                    <div className="stat-card-top">
                      <span className="stat-label">{card.label}</span>
                      <div className="stat-icon" style={{ background: card.accent + '1a' }}>
                        {card.icon}
                      </div>
                    </div>
                    <div className="stat-value">{card.value}</div>
                    <div className="stat-bar" style={{ background: card.accent }} />
                  </div>
                ))}
              </div>

              {/* Table stagiaires récents */}
              {user?.role !== 'stagiaire' && (
                <div className="table-card">
                  <div className="table-header">
                    <p>Stagiaires récents</p>
                    {stats?.stagiairesRecents?.length > 0 && (
                      <span>{stats.stagiairesRecents.length} stagiaires</span>
                    )}
                  </div>
                  {!stats?.stagiairesRecents || stats.stagiairesRecents.length === 0 ? (
                    <div className="empty-state">Aucun stagiaire pour l'instant</div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Stagiaire</th>
                          <th>École</th>
                          <th>Score</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.stagiairesRecents.map((s, i) => {
                          const { style, label } = getBadgeStyle(s.badge)
                          return (
                            <tr key={i}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div className="td-avatar">
                                    {s.user_id?.prenom?.[0]}{s.user_id?.nom?.[0]}
                                  </div>
                                  <div>
                                    <div className="td-name">{s.user_id?.prenom} {s.user_id?.nom}</div>
                                    <div className="td-sub">{s.user_id?.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td>{s.ecole}</td>
                              <td style={{ fontWeight: 700, color: '#0e2a6e' }}>{s.score}/100</td>
                              <td><span className={style}>{label}</span></td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}

          {activeMenu === 'stagiaires'   && <Stagiaires />}
          {activeMenu === 'missions'     && <Missions />}
          {activeMenu === 'rapports'     && <Rapports />}
          {activeMenu === 'scores'       && <Scores />}
          {activeMenu === 'evaluations'  && <Evaluations />}
          {activeMenu === 'feedback_ia'  && <FeedbackIA />}
          {activeMenu === 'utilisateurs' && <Utilisateurs />}

          {activeMenu === 'profil' && (
            <div>
              <div className="page-header">
                <h2>Mon profil</h2>
                <p>Gérez vos informations personnelles</p>
              </div>

              <div className="profile-card">
                <div className="profile-banner">
                  <div className="profile-avatar">
                    {user?.prenom?.[0]}{user?.nom?.[0]}
                  </div>
                </div>
                <div className="profile-body">
                  <div className="profile-name">{user?.prenom} {user?.nom}</div>
                  <div className="profile-email">{user?.email}</div>
                  <span className={`role-pill role-${user?.role}`}>
                    {user?.role === 'admin'      ? '👑 Administrateur' :
                     user?.role === 'tuteur'     ? '👨‍🏫 Tuteur' :
                     user?.role === 'directeur'  ? '🏢 Directeur' :
                                                   '👨‍🎓 Stagiaire'}
                  </span>
                  <div className="info-grid">
                    <div className="info-box">
                      <div className="info-box-label">Nom complet</div>
                      <div className="info-box-value">{user?.prenom} {user?.nom}</div>
                    </div>
                    <div className="info-box">
                      <div className="info-box-label">Email</div>
                      <div className="info-box-value">{user?.email}</div>
                    </div>
                    <div className="info-box">
                      <div className="info-box-label">Rôle</div>
                      <div className="info-box-value" style={{ textTransform: 'capitalize' }}>{user?.role}</div>
                    </div>
                    <div className="info-box">
                      <div className="info-box-label">Statut</div>
                      <div className="info-box-value" style={{ color: '#16a34a' }}>● Actif</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="password-card">
                <h3>🔒 Changer le mot de passe</h3>
                <ChangerMotDePasse />
              </div>
            </div>
          )}

          {activeMenu !== 'dashboard' &&
           activeMenu !== 'stagiaires' &&
           activeMenu !== 'missions' &&
           activeMenu !== 'rapports' &&
           activeMenu !== 'scores' &&
           activeMenu !== 'evaluations' &&
           activeMenu !== 'feedback_ia' &&
           activeMenu !== 'utilisateurs' &&
           activeMenu !== 'profil' && (
            <div>
              <div className="page-header">
                <h2 style={{ textTransform: 'capitalize' }}>
                  {menuItems.find(m => m.id === activeMenu)?.label}
                </h2>
              </div>
              <div style={{ background:'#fff', borderRadius:'18px', border:'1px solid #e8edf8', padding:'48px', textAlign:'center' }}>
                <p style={{ color:'#94a3b8', fontSize:'13px' }}>Module en cours de développement...</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default Dashboard
