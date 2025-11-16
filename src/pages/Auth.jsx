import React, { useState } from 'react';
// 🚀 Nouveaux imports nécessaires pour la navigation et le contexte
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useApp } from '../context/AppContext'; 
import { Globe, Mail, Lock, Eye, EyeOff, Loader, AlertCircle, CheckCircle, LogIn, Shield } from 'lucide-react';

/* * CHARTE GRAPHIQUE E-TRAVEL WORLD AGENCY
 * Couleurs utilisées (d'après la Charte Graphique et les autres composants):
 * --primary: #1B5E8E (Pantone 647 C - Bleu foncé)
 * --warning: #F7B406 (Pantone 124 C - Jaune/Orange)
 */

const AdminLogin = () => {
  // 🚀 Initialisation des hooks de navigation et du contexte
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated, setCurrentUser } = useApp(); // <-- Fonctions de mise à jour du contexte

  // Récupère le chemin d'origine stocké par ProtectedRoute, ou par défaut /admin
  const from = location.state?.from?.pathname || "/admin"; 

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setLoginForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://etravelbackend-production.up.railway.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Échec de la connexion. Email ou mot de passe incorrect.');
      }
      
      // 🚀 MISE À JOUR CRUCIALE DU CONTEXTE ET DU STORAGE
      // 1. Stockage du token sous la clé "token" (vérifiée par AppContext)
      localStorage.setItem('token', data.token); 
      
      // 2. Stockage des infos utilisateur (à adapter selon la réponse de votre API)
    const user = data.admin;                     // au lieu de data.user
    localStorage.setItem('user', JSON.stringify(user));

      // 3. Mise à jour de l'état global du contexte pour débloquer ProtectedRoute
      setIsAuthenticated(true); 
      setCurrentUser(user);
      
      setSuccess('Connexion réussie ! Redirection en cours...');
      
      // 4. Redirection vers la route qui a été bloquée
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);

    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#1B5E8E' }}>
      
      {/* Container principal (Carte de connexion) */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 sm:p-10">
        
        {/* 1. Zone du LOGO et Slogan */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full mb-3 shadow-lg" style={{ backgroundColor: '#1B5E8E' }}>
            <Shield className="text-white" size={40} />
          </div>
          
          <h1 className="text-2xl font-extrabold text-gray-900">
            E-TRAVEL WORLD AGENCY
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            VOTRE AGENCE, PARTOUT AVEC VOUS
          </p>
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
          Connexion Espace Administrateur
        </h2>

        {/* Messages d'Alerte */}
        {(error || success) && (
          <div className={`p-4 rounded-lg mb-6 ${error ? 'bg-red-50 border border-red-300' : 'bg-green-50 border border-green-300'}`}>
            <div className="flex items-start">
              <div className={`flex-shrink-0 ${error ? 'text-red-500' : 'text-green-500'}`}>
                {error ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${error ? 'text-red-800' : 'text-green-800'}`}>
                  {error ? 'Erreur' : 'Succès'}
                </p>
                <p className={`mt-1 text-sm ${error ? 'text-red-700' : 'text-green-700'}`}>
                  {error || success}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire de Connexion */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Adresse Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={loginForm.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E8E] focus:border-[#1B5E8E] transition"
                placeholder="votre.email@admin.com"
              />
            </div>
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={loginForm.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E8E] focus:border-[#1B5E8E] transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1B5E8E] focus:outline-none transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Bouton de Connexion */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 py-3 rounded-lg text-white font-bold transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#1B5E8E]/50 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#1B5E8E' }}
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Connexion en cours...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Séparateur */}
        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500 font-medium">OU</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Retour au site web */}
        <a
          href="/"
          className="block w-full py-3 bg-gray-100 text-gray-700 font-bold text-center rounded-lg hover:bg-gray-200 transition-all"
        >
          <Globe size={20} className="inline-block mr-2" /> Retour au site web
        </a>
      </div>

      {/* Infos du pied de page */}
      <div className="absolute bottom-4 text-center">
        <p className="text-white/80 text-sm">
          © 2025 e-TRAVEL WORLD AGENCY. Tous droits réservés.
        </p>
      </div>

      {/* Badge de sécurité */}
      <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white flex items-center gap-2 text-xs font-medium border border-white/30">
        <Shield size={16} className="text-white" />
        Accès Administrateur
      </div>
    </div>
  );
};

export default AdminLogin;