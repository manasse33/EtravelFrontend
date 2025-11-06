import React, { useState } from 'react';
import { Globe, Mail, Lock, Eye, EyeOff, Loader, AlertCircle, CheckCircle, LogIn, Shield } from 'lucide-react';

const AdminLogin = () => {
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
      
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      console.log('Login response:', data);

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.admin));

      setSuccess('Connexion réussie ! Redirection...');

      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);

    } catch (err) {
      console.error('Erreur de connexion:', err);
      
      if (err.message.includes('401') || err.message.includes('Identifiants')) {
        setError('Email ou mot de passe incorrect');
      } else {
        setError(err.message || 'Erreur de connexion. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-4">
            <Globe className="text-blue-600" size={40} />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">e-TRAVEL WORLD</h1>
          <p className="text-blue-200 text-lg">Espace Administration</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Connexion Admin</h2>
            <p className="text-gray-600">Connectez-vous pour accéder au tableau de bord</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg animate-pulse">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                <p className="text-green-800 font-medium">{success}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleInputChange}
                  placeholder="admin@etravel.com"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Mot de passe oublié ?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={24} />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <LogIn size={24} />
                  Se connecter
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 font-medium">OU</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Back to Website */}
          <a
            href="/"
            className="block w-full py-4 bg-gray-100 text-gray-700 font-bold text-center rounded-xl hover:bg-gray-200 transition-all"
          >
            Retour au site web
          </a>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm">
            © 2025 e-TRAVEL WORLD AGENCY. Tous droits réservés.
          </p>
          <p className="text-white/60 text-xs mt-2">
            Accès réservé aux administrateurs uniquement
          </p>
        </div>
      </div>

      {/* Security Badge */}
      <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
        <Shield className="text-white" size={16} />
        <span className="text-white text-sm font-medium">Connexion sécurisée</span>
      </div>
    </div>
  );
};

export default AdminLogin;