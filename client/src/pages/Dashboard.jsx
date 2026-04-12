import React from 'react'

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">SIPMS</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {user?.prenom} {user?.nom}
          </span>
          <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
            {user?.role}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">

        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Bonjour, {user?.prenom} 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Voici le tableau de bord de votre application
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Stagiaires actifs</p>
            <p className="text-2xl font-semibold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Missions en cours</p>
            <p className="text-2xl font-semibold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Rapports aujourd'hui</p>
            <p className="text-2xl font-semibold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Score moyen</p>
            <p className="text-2xl font-semibold text-gray-900">—</p>
          </div>
        </div>

        {/* Placeholder */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-700 mb-4">
            Stagiaires récents
          </p>
          <p className="text-sm text-gray-400 text-center py-8">
            Aucun stagiaire pour l'instant
          </p>
        </div>

      </div>
    </div>
  )
}

export default Dashboard