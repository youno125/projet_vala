import React, { useState } from 'react'
import Stagiaires from './Stagiaires'
import Missions from './Missions'
import Rapports from './Rapports'
import Scores from './Scores'
import Evaluations from './Evaluations'
import ChangerMotDePasse from './ChangerMotDePasse'

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [activeMenu, setActiveMenu] = useState('dashboard')

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
    { id: 'utilisateurs', label: 'Utilisateurs', icon: '👥', roles: ['admin', 'directeur'] },
    { id: 'profil', label: 'Mon profil', icon: '👤', roles: ['admin', 'tuteur', 'directeur', 'stagiaire'] },
  ]

  const menuItems = allMenus.filter(m => m.roles.includes(user?.role))

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-900">SIPMS</h1>
          <p className="text-xs text-gray-400 mt-0.5">Gestion des stagiaires</p>
        </div>

        <nav className="flex-1 px-3 py-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1 transition ${
                activeMenu === item.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span style={{fontSize: '16px'}}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">{user?.prenom} {user?.nom}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-xs text-red-500 hover:text-red-700 text-left px-1"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">

        {activeMenu === 'dashboard' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Bonjour, {user?.prenom} 👋
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {user?.role === 'stagiaire'
                  ? 'Bienvenue sur votre espace stagiaire'
                  : 'Voici le tableau de bord de votre application'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-sm text-gray-500 mb-1">
                  {user?.role === 'stagiaire' ? 'Mes missions' : 'Stagiaires actifs'}
                </p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-sm text-gray-500 mb-1">
                  {user?.role === 'stagiaire' ? 'Missions terminées' : 'Missions en cours'}
                </p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-sm text-gray-500 mb-1">
                  {user?.role === 'stagiaire' ? 'Mes rapports' : "Rapports aujourd'hui"}
                </p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-sm text-gray-500 mb-1">Mon score</p>
                <p className="text-2xl font-semibold text-gray-900">—</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <p className="text-sm font-medium text-gray-700 mb-4">
                {user?.role === 'stagiaire' ? 'Mes derniers rapports' : 'Stagiaires récents'}
              </p>
              <p className="text-sm text-gray-400 text-center py-8">
                Aucune donnée pour l'instant
              </p>
            </div>
          </div>
        )}

        {activeMenu === 'stagiaires' && <Stagiaires />}
        {activeMenu === 'missions' && <Missions />}
        {activeMenu === 'rapports' && <Rapports />}
        {activeMenu === 'scores' && <Scores />}
        {activeMenu === 'evaluations' && <Evaluations />}

        {activeMenu === 'profil' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Mon profil</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-medium text-blue-700">
                  {user?.prenom?.[0]}{user?.nom?.[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.prenom} {user?.nom}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {user?.role}
                  </span>
                </div>
              </div>
              <ChangerMotDePasse />
            </div>
          </div>
        )}

        {activeMenu === 'utilisateurs' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <p className="text-sm text-gray-400 text-center py-8">
                Module en cours de développement...
              </p>
            </div>
          </div>
        )}

        {activeMenu !== 'dashboard' &&
         activeMenu !== 'stagiaires' &&
         activeMenu !== 'missions' &&
         activeMenu !== 'rapports' &&
         activeMenu !== 'scores' &&
         activeMenu !== 'evaluations' &&
         activeMenu !== 'profil' &&
         activeMenu !== 'utilisateurs' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {menuItems.find(m => m.id === activeMenu)?.label}
              </h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <p className="text-sm text-gray-400 text-center py-8">
                Module en cours de développement...
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard