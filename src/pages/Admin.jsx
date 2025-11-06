import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, LogOut, Package, Calendar, Users, Search, DollarSign, TrendingUp, Globe, Award, Clock, Eye, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const API_BASE_URL = 'https://etravelbackend-production.up.railway.app/api';

const AdminPanel = () => {
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [packages, setPackages] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    package_type: 'destination',
    sub_type: '',
    country: 'RC',
    image: null,
    prices: []
  });

  // Statistiques calculées
  const stats = {
    totalPackages: packages.length,
    totalReservations: reservations.length,
    pendingReservations: reservations.filter(r => r.status === 'pending').length,
    approvedReservations: reservations.filter(r => r.status === 'approved').length,
    totalRevenue: reservations
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + (r.amount || 0), 0),
  };

  // Réservations récentes
  const recentReservations = reservations.slice(0, 5);

  useEffect(() => {
    if (token) {
      if (activeTab === 'dashboard') {
        loadAllData(token);
      } else {
        loadData(token);
      }
    }
  }, [activeTab, token]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const apiCall = async (endpoint, method = 'GET', body = null, isFormData = false) => {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (response.status === 401) {
      handleLogout();
      throw new Error('Session expirée');
    }

    return response.json();
  };

  const loadAllData = async (authToken) => {
    setLoading(true);
    try {
      const [packagesData, reservationsData] = await Promise.all([
        apiCall('/packages', 'GET'),
        apiCall('/admin/reservations', 'GET')
      ]);
      
      setPackages(packagesData.data || packagesData);
      setReservations(reservationsData.data || reservationsData);
    } catch (error) {
      showMessage('error', 'Erreur de chargement: ' + error.message);
    }
    setLoading(false);
  };

  const loadData = async (authToken) => {
    setLoading(true);
    try {
      if (activeTab === 'packages') {
        const data = await apiCall('/packages', 'GET');
        setPackages(data.data || data);
      } else {
        const data = await apiCall('/admin/reservations', 'GET');
        setReservations(data.data || data);
      }
    } catch (error) {
      showMessage('error', 'Erreur de chargement: ' + error.message);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();
      
      if (data.token) {
        setToken(data.token);
        setActiveTab('dashboard');
        showMessage('success', 'Connexion réussie');
        // Le useEffect va charger les données automatiquement
      } else {
        showMessage('error', 'Identifiants incorrects');
      }
    } catch (error) {
      showMessage('error', 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiCall('/admin/logout', 'POST');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setToken('');
    showMessage('success', 'Déconnexion réussie');
  };

  const handleSubmitPackage = async () => {
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('package_type', formData.package_type);
      formDataToSend.append('sub_type', formData.sub_type);
      formDataToSend.append('country', formData.country);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      formData.prices.forEach((price, index) => {
        formDataToSend.append(`prices[${index}][country]`, price.country);
        formDataToSend.append(`prices[${index}][min_people]`, price.min_people);
        formDataToSend.append(`prices[${index}][max_people]`, price.max_people);
        formDataToSend.append(`prices[${index}][price]`, price.price);
        formDataToSend.append(`prices[${index}][currency]`, price.currency);
      });

      if (editingPackage) {
        formDataToSend.append('_method', 'PUT');
        await apiCall(`/admin/packages/${editingPackage.id}`, 'POST', formDataToSend, true);
        showMessage('success', 'Package modifié avec succès');
      } else {
        await apiCall('/admin/packages', 'POST', formDataToSend, true);
        showMessage('success', 'Package créé avec succès');
      }

      setShowModal(false);
      resetForm();
      loadData(token);
    } catch (error) {
      showMessage('error', 'Erreur: ' + error.message);
    }
    setLoading(false);
  };

  const handleDeletePackage = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce package ?')) return;

    try {
      await apiCall(`/admin/packages/${id}`, 'DELETE');
      showMessage('success', 'Package supprimé');
      loadData(token);
    } catch (error) {
      showMessage('error', 'Erreur de suppression');
    }
  };

  const handleValidateReservation = async (id) => {
    try {
      await apiCall(`/admin/reservations/${id}/validate`, 'PUT');
      showMessage('success', 'Réservation approuvée');
      loadData(token);
    } catch (error) {
      showMessage('error', 'Erreur de validation');
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      await apiCall(`/admin/reservations/${id}/cancel`, 'PUT');
      showMessage('success', 'Réservation annulée');
      loadData(token);
    } catch (error) {
      showMessage('error', 'Erreur d\'annulation');
    }
  };

  const openEditModal = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      description: pkg.description || '',
      package_type: pkg.package_type,
      sub_type: pkg.sub_type || '',
      country: pkg.country || 'RC',
      image: null,
      prices: pkg.prices || []
    });
    setShowModal(true);
  };

  const addPrice = () => {
    setFormData({
      ...formData,
      prices: [...formData.prices, {
        country: 'RC',
        min_people: 1,
        max_people: 1,
        price: '',
        currency: 'XAF'
      }]
    });
  };

  const updatePrice = (index, field, value) => {
    const newPrices = [...formData.prices];
    newPrices[index][field] = value;
    setFormData({ ...formData, prices: newPrices });
  };

  const removePrice = (index) => {
    const newPrices = formData.prices.filter((_, i) => i !== index);
    setFormData({ ...formData, prices: newPrices });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      package_type: 'destination',
      sub_type: '',
      country: 'RC',
      image: null,
      prices: []
    });
    setEditingPackage(null);
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReservations = reservations.filter(res => 
    res.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHpNMTIgMTEwaDEydjEySDEyem0yNCAwaDEydjEySDM2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Globe className="text-white" size={40} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">e-TRAVEL WORLD</h1>
            <p className="text-gray-600 font-semibold">Administration</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-all"
                placeholder="admin@etravel.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {message.text && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl ${
          message.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-semibold">{message.text}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
              <Globe className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">e-TRAVEL WORLD</h1>
              <p className="text-xs text-gray-500 font-semibold tracking-wide">ADMIN PANEL</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-900 hover:text-white transition-all font-semibold border border-gray-200"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 font-bold transition-all relative ${
                activeTab === 'dashboard'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp size={20} />
                <span>Dashboard</span>
              </div>
              {activeTab === 'dashboard' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-lg"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className={`px-6 py-4 font-bold transition-all relative ${
                activeTab === 'packages'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package size={20} />
                <span>Packages</span>
              </div>
              {activeTab === 'packages' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-lg"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-6 py-4 font-bold transition-all relative ${
                activeTab === 'reservations'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar size={20} />
                <span>Réservations</span>
                {stats.pendingReservations > 0 && (
                  <span className="px-2 py-0.5 bg-yellow-400 text-gray-900 text-xs font-black rounded-full">
                    {stats.pendingReservations}
                  </span>
                )}
              </div>
              {activeTab === 'reservations' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-lg"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Vue d'ensemble</h2>
              <p className="text-gray-600">Bienvenue dans votre tableau de bord administrateur</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-600 transition-all hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="text-blue-600" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <h3 className="text-gray-600 font-semibold mb-1">Total Packages</h3>
                <p className="text-4xl font-black text-gray-900">{stats.totalPackages}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-yellow-400 transition-all hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Calendar className="text-yellow-600" size={24} />
                  </div>
                  <Clock className="text-yellow-500" size={20} />
                </div>
                <h3 className="text-gray-600 font-semibold mb-1">En attente</h3>
                <p className="text-4xl font-black text-gray-900">{stats.pendingReservations}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-green-500 transition-all hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <Award className="text-green-500" size={20} />
                </div>
                <h3 className="text-gray-600 font-semibold mb-1">Approuvées</h3>
                <p className="text-4xl font-black text-gray-900">{stats.approvedReservations}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-gray-900 transition-all hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Users className="text-gray-900" size={24} />
                  </div>
                  <DollarSign className="text-gray-900" size={20} />
                </div>
                <h3 className="text-gray-600 font-semibold mb-1">Total Réservations</h3>
                <p className="text-4xl font-black text-gray-900">{stats.totalReservations}</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition des packages */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-black text-gray-900 mb-6">Répartition des Packages</h3>
                <div className="space-y-4">
                  {['destination', 'ouikenac', 'city_tour'].map((type) => {
                    const count = packages.filter(p => p.package_type === type).length;
                    const percentage = stats.totalPackages > 0 ? (count / stats.totalPackages) * 100 : 0;
                    return (
                      <div key={type}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-700 capitalize">{type}</span>
                          <span className="font-black text-gray-900">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              type === 'destination' ? 'bg-blue-600' :
                              type === 'ouikenac' ? 'bg-yellow-400' : 'bg-green-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Statut des réservations */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-black text-gray-900 mb-6">Statut des Réservations</h3>
                <div className="space-y-4">
                  {[
                    { status: 'pending', label: 'En attente', color: 'bg-yellow-400' },
                    { status: 'approved', label: 'Approuvées', color: 'bg-green-500' },
                    { status: 'rejected', label: 'Rejetées', color: 'bg-red-500' }
                  ].map(({ status, label, color }) => {
                    const count = reservations.filter(r => r.status === status).length;
                    const percentage = stats.totalReservations > 0 ? (count / stats.totalReservations) * 100 : 0;
                    return (
                      <div key={status}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-700">{label}</span>
                          <span className="font-black text-gray-900">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${color}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Reservations */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <h3 className="text-xl font-black text-gray-900 mb-6">Réservations Récentes</h3>
              {recentReservations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune réservation récente</p>
              ) : (
                <div className="space-y-4">
                  {recentReservations.map((res) => (
                    <div key={res.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Users className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{res.full_name}</p>
                          <p className="text-sm text-gray-600">{res.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{res.date_reservation}</p>
                          <p className="text-sm font-semibold text-gray-900">{res.travelers} voyageurs</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          res.status === 'approved' ? 'bg-green-100 text-green-700' :
                          res.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {res.status === 'approved' ? 'Approuvée' :
                           res.status === 'rejected' ? 'Rejetée' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Gestion des Packages</h2>
                <p className="text-gray-600">Créez et gérez vos offres de voyage</p>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-blue-600 transition-all font-bold shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                <span>Nouveau Package</span>
              </button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un package..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-all font-semibold"
              />
            </div>

            <div className="grid gap-6">
              {loading ? (
                <div className="text-center py-20">
                  <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                  <p className="text-gray-500 font-semibold">Chargement...</p>
                </div>
              ) : filteredPackages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-200">
                  <Package className="mx-auto text-gray-300 mb-4" size={64} />
                  <p className="text-gray-500 text-lg font-semibold">Aucun package trouvé</p>
                </div>
              ) : (
                filteredPackages.map(pkg => (
                  <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-2xl font-black text-gray-900">{pkg.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            pkg.package_type === 'destination' ? 'bg-blue-100 text-blue-700' :
                            pkg.package_type === 'ouikenac' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {pkg.package_type}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">{pkg.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {pkg.country && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                              {pkg.country}
                            </span>
                          )}
                          {pkg.sub_type && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                              {pkg.sub_type}
                            </span>
                          )}
                        </div>

                        {pkg.prices && pkg.prices.length > 0 && (
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center space-x-2 mb-3">
                              <DollarSign size={18} className="text-blue-600" />
                              <h4 className="font-bold text-gray-900">Tarifs</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {pkg.prices.map((price, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 font-semibold">
                                      {price.min_people === price.max_people 
                                        ? `${price.min_people} pers.`
                                        : `${price.min_people}-${price.max_people} pers.`}
                                    </span>
                                    <span className="font-black text-blue-600">
                                      {price.price} {price.currency}
                                    </span>
                                  </div>
                                  {price.country && (
                                    <span className="text-xs text-gray-500 mt-1 block">{price.country}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 ml-6">
                        <button
                          onClick={() => openEditModal(pkg)}
                          className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border-2 border-blue-200 font-bold"
                          title="Modifier"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors border-2 border-red-200 font-bold"
                          title="Supprimer"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Gestion des Réservations</h2>
                <p className="text-gray-600">Validez ou rejetez les demandes de réservation</p>
              </div>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher une réservation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-all font-semibold"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden">
              {loading ? (
                <div className="text-center py-20">
                  <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                  <p className="text-gray-500 font-semibold">Chargement...</p>
                </div>
              ) : filteredReservations.length === 0 ? (
                <div className="text-center py-20">
                  <Calendar className="mx-auto text-gray-300 mb-4" size={64} />
                  <p className="text-gray-500 text-lg font-semibold">Aucune réservation trouvée</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Voyageurs</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredReservations.map(res => (
                        <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{res.full_name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 font-semibold">{res.email}</div>
                            <div className="text-sm text-gray-500">{res.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-semibold">{res.date_reservation}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                              <Users size={14} className="mr-1" />
                              {res.travelers}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black ${
                              res.status === 'approved' ? 'bg-green-100 text-green-700 border-2 border-green-200' :
                              res.status === 'rejected' ? 'bg-red-100 text-red-700 border-2 border-red-200' :
                              'bg-yellow-100 text-yellow-700 border-2 border-yellow-200'
                            }`}>
                              {res.status === 'approved' ? 'Approuvée' :
                               res.status === 'rejected' ? 'Rejetée' : 'En attente'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {res.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleValidateReservation(res.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border-2 border-green-200"
                                  title="Approuver"
                                >
                                  <Check size={20} />
                                </button>
                                <button
                                  onClick={() => handleCancelReservation(res.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border-2 border-red-200"
                                  title="Rejeter"
                                >
                                  <X size={20} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 z-10 rounded-t-2xl">
              <h2 className="text-3xl font-black text-white">
                {editingPackage ? 'Modifier le package' : 'Nouveau package'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Titre *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-all font-semibold"
                    placeholder="Nom du package"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-all"
                    placeholder="Description détaillée du package"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Type *</label>
                  <select
                    value={formData.package_type}
                    onChange={(e) => setFormData({...formData, package_type: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-all font-semibold"
                  >
                    <option value="ouikenac">Ouikenac</option>
                    <option value="destination">Destination</option>
                    <option value="city_tour">City Tour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pays</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-all font-semibold"
                  >
                    <option value="RC">RC (Congo-Brazzaville)</option>
                    <option value="RDC">RDC (Congo-Kinshasa)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Sous-type</label>
                  <input
                    type="text"
                    value={formData.sub_type}
                    onChange={(e) => setFormData({...formData, sub_type: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-all"
                    placeholder="Ex: Safari, Plage, Montagne..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign size={20} className="text-blue-600" />
                    <h3 className="text-lg font-black text-gray-900">Grille tarifaire</h3>
                  </div>
                  <button
                    type="button"
                    onClick={addPrice}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold"
                  >
                    <Plus size={18} />
                    <span>Ajouter un tarif</span>
                  </button>
                </div>

                {formData.prices.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <DollarSign className="mx-auto text-gray-300 mb-2" size={40} />
                    <p className="text-gray-500 font-semibold">Aucun tarif défini</p>
                    <p className="text-sm text-gray-400 mt-1">Cliquez sur "Ajouter un tarif" pour commencer</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.prices.map((price, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-sm font-black text-gray-700">Tarif #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removePrice(index)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Pays</label>
                            <select
                              value={price.country}
                              onChange={(e) => updatePrice(index, 'country', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 text-sm bg-white font-semibold"
                            >
                              <option value="RC">RC</option>
                              <option value="RDC">RDC</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Min pers.</label>
                            <input
                              type="number"
                              min="1"
                              value={price.min_people}
                              onChange={(e) => updatePrice(index, 'min_people', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 text-sm font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Max pers.</label>
                            <input
                              type="number"
                              min="1"
                              value={price.max_people}
                              onChange={(e) => updatePrice(index, 'max_people', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 text-sm font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Prix *</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={price.price}
                              onChange={(e) => updatePrice(index, 'price', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 text-sm font-semibold"
                              placeholder="0.00"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Devise</label>
                            <select
                              value={price.currency}
                              onChange={(e) => updatePrice(index, 'currency', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 text-sm bg-white font-semibold"
                            >
                              <option value="XAF">XAF</option>
                              <option value="EUR">EUR</option>
                              <option value="USD">USD</option>
                              <option value="CDF">CDF</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={handleSubmitPackage}
                  disabled={loading}
                  className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader className="w-5 h-5 border-2 animate-spin mr-2" />
                      Enregistrement...
                    </span>
                  ) : (
                    editingPackage ? 'Mettre à jour' : 'Créer le package'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-black hover:bg-gray-50 transition-colors text-lg"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;