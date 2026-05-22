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
    <div className="min-h-screen flex">

      {/* Left side — blue */}
      <div className="hidden md:flex w-1/2 bg-blue-600 flex-col items-center justify-center p-12">
        <img src={require('../logo.png')} alt="VALA" className="h-56 object-contain mb-8" style={{mixBlendMode: 'screen'}} />
        <h1 className="text-white text-3xl font-bold mb-4 text-center">
          Smart Intern Performance
        </h1>
        <p className="text-blue-100 text-center text-sm leading-relaxed">
          Gérez vos stagiaires, suivez leurs performances et générez des feedbacks intelligents grâce à l'IA.
        </p>

        <div className="mt-12 space-y-4 w-full max-w-xs">
          <div className="flex items-center gap-3 bg-blue-500 rounded-xl p-3">
            <span className="text-2xl">📊</span>
            <div>
              <p className="text-white text-sm font-medium">Scoring automatique</p>
              <p className="text-blue-200 text-xs">Score /100 calculé en temps réel</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-blue-500 rounded-xl p-3">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="text-white text-sm font-medium">Feedback IA</p>
              <p className="text-blue-200 text-xs">Analyse et conseils personnalisés</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-blue-500 rounded-xl p-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="text-white text-sm font-medium">Attestation PDF</p>
              <p className="text-blue-200 text-xs">Générée automatiquement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Bienvenue 👋</h2>
            <p className="text-gray-500 text-sm">Connectez-vous à votre espace SIPMS</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Mot de passe</label>
              <input
                type="password"
                value={mot_de_passe}
                onChange={e => setMotDePasse(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white"
                placeholder="••••••••"
                required
              />
            </div>

            {erreur && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm">{erreur}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={chargement}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-medium transition"
            >
              {chargement ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Creative Internet Solutions (VALA) — SIPMS v1.0
          </p>
        </div>
      </div>

    </div>
  )
}

export default Login