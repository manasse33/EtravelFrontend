import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Package, MapPin, TrendingUp, DollarSign, Calendar, Settings, Home, Globe, Building, Plane, Compass, Navigation, Menu, X, Upload, Loader2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

// Composant de notification moderne
const Notification = ({ show, message, type, onClose }) => {
  if (!show) return null;

  const icons = {
    success: <CheckCircle size={24} />,
    error: <XCircle size={24} />,
    warning: <AlertCircle size={24} />
  };

  const colors = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800'
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full ${colors[type]} border-l-4 rounded-r-xl p-4 shadow-2xl animate-slide-in`}>
      <div className="flex items-start gap-3">
        <div className={iconColors[type]}>
          {icons[type]}
        </div>
        <div className="flex-1">
          <p className="font-semibold mb-1">
            {type === 'success' ? 'Succès' : type === 'error' ? 'Erreur' : 'Attention'}
          </p>
          <p className="text-sm">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// Composant de chargement moderne
const LoadingOverlay = ({ message = 'Chargement...' }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
      <div className="flex flex-col items-center">
        <div className="relative">
          <Loader2 className="animate-spin h-16 w-16 text-blue-600" />
          <div className="absolute inset-0 h-16 w-16 border-4 border-blue-200 rounded-full"></div>
        </div>
        <p className="text-gray-700 font-semibold text-lg mt-6">{message}</p>
        <div className="w-full bg-gray-200 rounded-full h-1 mt-4 overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  </div>
);

// Composant de confirmation moderne
const ConfirmDialog = ({ show, title, message, onConfirm, onCancel, type = 'warning' }) => {
  if (!show) return null;

  const colors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'}`}>
            <AlertCircle className={type === 'danger' ? 'text-red-600' : 'text-yellow-600'} size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 text-white font-semibold rounded-lg transition-all ${colors[type] || colors.warning}`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [ouikenacs, setOuikenacs] = useState([]);
  const [cityTours, setCityTours] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, title: '', message: '', onConfirm: null });

  const [countryForm, setCountryForm] = useState({ name: '', code: '' });
  const [cityForm, setCityForm] = useState({ name: '', country_id: '' });
  
  const [destinationForm, setDestinationForm] = useState({
    title: '', 
    description: '', 
    image: null, 
    departure_country_id: '',
    arrival_country_id: '',
    prices: [{ people_count: '', price: '' }]
  });

  const [ouikenacForm, setOuikenacForm] = useState({
    title: '',
    description: '',
    image: null,
    departure_country_id: '',
    arrival_country_id: '',
    departure_city_id: '',
    arrival_city_id: '',
    min_people: 1,
    max_people: 10,
    price: '',
    active: true
  });

  const [cityTourForm, setCityTourForm] = useState({
    nom: '',
    description: '',
    country_id: '',
    city_id: '',
    date: '',
    places_min: 1,
    places_max: 10,
    price: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const showConfirmDialog = (title, message, onConfirm, type = 'warning') => {
    setConfirmDialog({
      show: true,
      title,
      message,
      type,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog({ show: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [countriesRes, destinationsRes, ouikenacsRes, toursRes, reservationsRes] = await Promise.all([
        fetch(`${API_BASE}/countries`).then(r => {
          if (!r.ok) throw new Error('Erreur lors du chargement des pays');
          return r.json();
        }),
        fetch(`${API_BASE}/destinations`).then(r => {
          if (!r.ok) throw new Error('Erreur lors du chargement des destinations');
          return r.json();
        }),
        fetch(`${API_BASE}/ouikenac`).then(r => {
          if (!r.ok) throw new Error('Erreur lors du chargement des packages Ouikenac');
          return r.json();
        }),
        fetch(`${API_BASE}/city-tours`).then(r => {
          if (!r.ok) throw new Error('Erreur lors du chargement des city tours');
          return r.json();
        }),
        fetch(`${API_BASE}/reservations`).then(r => {
          if (!r.ok) throw new Error('Erreur lors du chargement des réservations');
          return r.json();
        })
      ]);
      
      setCountries(countriesRes);
      setDestinations(destinationsRes);
      setOuikenacs(ouikenacsRes);
      setCityTours(toursRes);
      setReservations(reservationsRes);
      
      const allCities = countriesRes.flatMap(c => c.cities || []);
      setCities(allCities);
    } catch (error) {
      console.error('Erreur chargement:', error);
      showNotification(error.message || 'Erreur lors du chargement des données', 'error');
    }
    setLoading(false);
  };

  const handleFileChange = (e, formSetter, formData) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Le fichier est trop volumineux. Taille maximale : 5MB', 'error');
        return;
      }
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        showNotification('Veuillez sélectionner une image valide', 'error');
        return;
      }
      formSetter({ ...formData, image: file });
    }
  };

  const handleAddCountry = async () => {
    if (!countryForm.name || !countryForm.code) {
      showNotification('Veuillez remplir tous les champs obligatoires', 'warning');
      return;
    }
    
    if (countryForm.code.length !== 2) {
      showNotification('Le code pays doit contenir exactement 2 caractères', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/countries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(countryForm)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout du pays');
      }
      
      setCountryForm({ name: '', code: '' });
      await loadData();
      showNotification('Pays ajouté avec succès', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
    setSubmitting(false);
  };

  const handleAddCity = async () => {
    if (!cityForm.name || !cityForm.country_id) {
      showNotification('Veuillez remplir tous les champs obligatoires', 'warning');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/cities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cityForm)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout de la ville');
      }
      
      setCityForm({ name: '', country_id: '' });
      await loadData();
      showNotification('Ville ajoutée avec succès', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
    setSubmitting(false);
  };

  const addPriceField = () => {
    setDestinationForm({
      ...destinationForm,
      prices: [...destinationForm.prices, { people_count: '', price: '' }]
    });
  };

  const updatePriceField = (index, field, value) => {
    const newPrices = [...destinationForm.prices];
    newPrices[index][field] = value;
    setDestinationForm({ ...destinationForm, prices: newPrices });
  };

  const removePriceField = (index) => {
    const newPrices = destinationForm.prices.filter((_, i) => i !== index);
    setDestinationForm({ ...destinationForm, prices: newPrices });
  };

  const handleAddDestination = async () => {
    if (!destinationForm.title || !destinationForm.departure_country_id || !destinationForm.arrival_country_id) {
      showNotification('Veuillez remplir tous les champs obligatoires (titre, pays de départ et d\'arrivée)', 'warning');
      return;
    }
    
    const validPrices = destinationForm.prices.filter(p => p.people_count && p.price);
    if (validPrices.length === 0) {
      showNotification('Veuillez ajouter au moins un tarif valide', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', destinationForm.title);
      formData.append('description', destinationForm.description);
      formData.append('departure_country_id', destinationForm.departure_country_id);
      formData.append('arrival_country_id', destinationForm.arrival_country_id);
      
      if (destinationForm.image) {
        formData.append('image', destinationForm.image);
      }
      
      formData.append('prices', JSON.stringify(validPrices));
      
      const response = await fetch(`${API_BASE}/destinations`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Erreur lors de l\'ajout de la destination');
      }
      
      setDestinationForm({
        title: '', 
        description: '', 
        image: null, 
        departure_country_id: '',
        arrival_country_id: '',
        prices: [{ people_count: '', price: '' }]
      });
      
      const fileInput = document.getElementById('dest-image');
      if (fileInput) fileInput.value = '';
      
      await loadData();
      showNotification('Destination ajoutée avec succès', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
    setSubmitting(false);
  };

  const handleAddOuikenac = async () => {
    if (!ouikenacForm.title || !ouikenacForm.departure_city_id || !ouikenacForm.arrival_city_id || !ouikenacForm.price) {
      showNotification('Veuillez remplir tous les champs obligatoires', 'warning');
      return;
    }
    
    if (parseInt(ouikenacForm.min_people) > parseInt(ouikenacForm.max_people)) {
      showNotification('Le nombre minimum de personnes ne peut pas être supérieur au maximum', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', ouikenacForm.title);
      formData.append('description', ouikenacForm.description);
      formData.append('departure_country_id', ouikenacForm.departure_country_id);
      formData.append('arrival_country_id', ouikenacForm.arrival_country_id);
      formData.append('departure_city_id', ouikenacForm.departure_city_id);
      formData.append('arrival_city_id', ouikenacForm.arrival_city_id);
      formData.append('min_people', ouikenacForm.min_people);
      formData.append('max_people', ouikenacForm.max_people);
      formData.append('price', ouikenacForm.price);
      formData.append('active', ouikenacForm.active ? '1' : '0');
      
      if (ouikenacForm.image) {
        formData.append('image', ouikenacForm.image);
      }
      
      const response = await fetch(`${API_BASE}/ouikenac`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Erreur lors de l\'ajout du package Ouikenac');
      }
      
      setOuikenacForm({
        title: '',
        description: '',
        image: null,
        departure_country_id: '',
        arrival_country_id: '',
        departure_city_id: '',
        arrival_city_id: '',
        min_people: 1,
        max_people: 10,
        price: '',
        active: true
      });
      
      const fileInput = document.getElementById('ouik-image');
      if (fileInput) fileInput.value = '';
      
      await loadData();
      showNotification('Package Ouikenac ajouté avec succès', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
    setSubmitting(false);
  };

  const handleAddCityTour = async () => {
    if (!cityTourForm.nom || !cityTourForm.country_id || !cityTourForm.city_id || !cityTourForm.date || !cityTourForm.price) {
      showNotification('Veuillez remplir tous les champs obligatoires', 'warning');
      return;
    }
    
    if (parseInt(cityTourForm.places_min) > parseInt(cityTourForm.places_max)) {
      showNotification('Le nombre minimum de places ne peut pas être supérieur au maximum', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/city-tours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cityTourForm)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout du City Tour');
      }
      
      setCityTourForm({
        nom: '',
        description: '',
        country_id: '',
        city_id: '',
        date: '',
        places_min: 1,
        places_max: 10,
        price: ''
      });
      
      await loadData();
      showNotification('City Tour ajouté avec succès', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
    setSubmitting(false);
  };

  const handleDeleteItem = async (type, id) => {
    showConfirmDialog(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
      async () => {
        setSubmitting(true);
        try {
          const response = await fetch(`${API_BASE}/${type}/${id}`, { method: 'DELETE' });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la suppression');
          }
          
          await loadData();
          showNotification('Élément supprimé avec succès', 'success');
        } catch (error) {
          showNotification(error.message, 'error');
        }
        setSubmitting(false);
      },
      'danger'
    );
  };

  const handleUpdateReservationStatus = async (id, status) => {
    const statusMessages = {
      approved: 'approuver',
      rejected: 'rejeter',
      cancelled: 'annuler'
    };

    showConfirmDialog(
      `Confirmer l'action`,
      `Êtes-vous sûr de vouloir ${statusMessages[status]} cette réservation ?`,
      async () => {
        setSubmitting(true);
        try {
          const response = await fetch(`${API_BASE}/reservations/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la mise à jour du statut');
          }
          
          await loadData();
          showNotification('Statut mis à jour avec succès', 'success');
        } catch (error) {
          showNotification(error.message, 'error');
        }
        setSubmitting(false);
      }
    );
  };

  const stats = {
    totalReservations: reservations.length,
    pendingReservations: reservations.filter(r => r.status === 'pending').length,
    totalRevenue: reservations.filter(r => r.status === 'approved').reduce((sum, r) => sum + parseFloat(r.total_price || 0), 0),
    totalDestinations: destinations.length + ouikenacs.length + cityTours.length,
    totalCountries: countries.length,
    totalCities: cities.length
  };

  const revenueData = reservations
    .filter(r => r.status === 'approved')
    .reduce((acc, r) => {
      const month = new Date(r.created_at).toLocaleDateString('fr-FR', { month: 'short' });
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.revenue += parseFloat(r.total_price || 0);
      } else {
        acc.push({ month, revenue: parseFloat(r.total_price || 0) });
      }
      return acc;
    }, []);

  const statusData = [
    { name: 'En attente', value: reservations.filter(r => r.status === 'pending').length, color: '#f7d617' },
    { name: 'Approuvées', value: reservations.filter(r => r.status === 'approved').length, color: '#3fa535' },
    { name: 'Rejetées', value: reservations.filter(r => r.status === 'rejected').length, color: '#cd1422' },
    { name: 'Annulées', value: reservations.filter(r => r.status === 'cancelled').length, color: '#777' }
  ];

  const destinationTypeData = [
    { name: 'Destinations', value: destinations.length, color: '#1b5e8e' },
    { name: 'Ouikenac', value: ouikenacs.length, color: '#f18f13' },
    { name: 'City Tours', value: cityTours.length, color: '#40bcd5' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'config', label: 'Configuration', icon: Settings },
    { id: 'destinations', label: 'Destinations', icon: Plane },
    { id: 'ouikenac', label: 'Ouikenac', icon: Compass },
    { id: 'citytour', label: 'City Tour', icon: Navigation },
    { id: 'reservations', label: 'Réservations', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: '', type: '' })}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ show: false, title: '', message: '', onConfirm: null })}
      />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 flex items-center justify-between p-4">
        <h1 className="text-xl font-bold" style={{ color: '#1b5e8e' }}>eTravel Admin</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6 border-b border-gray-200 hidden lg:block">
          <h1 className="text-2xl font-bold" style={{ color: '#1b5e8e' }}>eTravel Admin</h1>
        </div>
        <nav className="p-4 mt-16 lg:mt-0">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === item.id ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={activeTab === item.id ? { backgroundColor: '#1b5e8e' } : {}}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">
        {/* Loading Overlay */}
        {(loading || submitting) && (
          <LoadingOverlay message={loading ? 'Chargement des données...' : 'Traitement en cours...'} />
        )}

        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Tableau de bord</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4 transform hover:scale-105 transition-transform" style={{ borderLeftColor: '#1b5e8e' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Réservations</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-2">{stats.totalReservations}</p>
                  </div>
                  <div className="bg-blue-100 p-3 sm:p-4 rounded-lg">
                    <Calendar size={20} className="sm:w-6 sm:h-6" style={{ color: '#1b5e8e' }} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4 transform hover:scale-105 transition-transform" style={{ borderLeftColor: '#3fa535' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-2">{stats.totalRevenue.toFixed(0)} FCFA</p>
                  </div>
                  <div className="bg-green-100 p-3 sm:p-4 rounded-lg">
                    <DollarSign size={20} className="sm:w-6 sm:h-6" style={{ color: '#3fa535' }} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4 transform hover:scale-105 transition-transform" style={{ borderLeftColor: '#f18f13' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Offres Totales</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-2">{stats.totalDestinations}</p>
                  </div>
                  <div className="bg-orange-100 p-3 sm:p-4 rounded-lg">
                    <MapPin size={20} className="sm:w-6 sm:h-6" style={{ color: '#f18f13' }} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4 transform hover:scale-105 transition-transform" style={{ borderLeftColor: '#f7d617' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">En attente</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-2">{stats.pendingReservations}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 sm:p-4 rounded-lg">
                    <TrendingUp size={20} className="sm:w-6 sm:h-6" style={{ color: '#f7d617' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Revenus mensuels</h3>
                <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="revenue" stroke="#1b5e8e" strokeWidth={3} name="Revenus (FCFA)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Statut des réservations</h3>
                <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={entry => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Répartition des offres</h3>
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <BarChart data={destinationTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="value" name="Nombre" fill="#1b5e8e">
                    {destinationTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Configuration</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1b5e8e' }}>
                  <Globe size={20} className="sm:w-6 sm:h-6" />
                  Ajouter un pays
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nom du pays"
                    value={countryForm.name}
                    onChange={e => setCountryForm({ ...countryForm, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Code (ex: CG, FR)"
                    value={countryForm.code}
                    onChange={e => setCountryForm({ ...countryForm, code: e.target.value.toUpperCase() })}
                    maxLength={2}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <button
                    onClick={handleAddCountry}
                    disabled={submitting}
                    className="w-full text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base disabled:opacity-50"
                    style={{ backgroundColor: '#1b5e8e' }}
                  >
                    {submitting ? 'Ajout...' : 'Ajouter le pays'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#f18f13' }}>
                  <Building size={20} className="sm:w-6 sm:h-6" />
                  Ajouter une ville
                </h3>
                <div className="space-y-4">
                  <select
                    value={cityForm.country_id}
                    onChange={e => setCityForm({ ...cityForm, country_id: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Sélectionner un pays</option>
                    {countries.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Nom de la ville"
                    value={cityForm.name}
                    onChange={e => setCityForm({ ...cityForm, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <button
                    onClick={handleAddCity}
                    disabled={submitting}
                    className="w-full text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base disabled:opacity-50"
                    style={{ backgroundColor: '#f18f13' }}
                  >
                    {submitting ? 'Ajout...' : 'Ajouter la ville'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 bg-white rounded-xl p-4 sm:p-6 shadow-md">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Pays et villes configurés</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {countries.map(country => (
                  <div key={country.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe size={18} style={{ color: '#1b5e8e' }} />
                      <h4 className="font-bold text-base sm:text-lg">{country.name} ({country.code})</h4>
                    </div>
                    <div className="ml-6 sm:ml-7 space-y-1">
                      {country.cities?.map(city => (
                        <div key={city.id} className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                          <Building size={12} className="sm:w-3.5 sm:h-3.5" style={{ color: '#f18f13' }} />
                          {city.name}
                        </div>
                      ))}
                      {(!country.cities || country.cities.length === 0) && (
                        <p className="text-xs sm:text-sm text-gray-400 italic">Aucune ville</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'destinations' && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Destinations Populaires</h2>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#1b5e8e' }}>Ajouter une destination</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Titre *"
                    value={destinationForm.title}
                    onChange={e => setDestinationForm({ ...destinationForm, title: e.target.value })}
                    className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    required
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange(e, setDestinationForm, destinationForm)}
                      className="hidden"
                      id="dest-image"
                    />
                    <label 
                      htmlFor="dest-image"
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm sm:text-base"
                    >
                      <Upload size={18} />
                      <span className="text-gray-600 truncate">{destinationForm.image ? destinationForm.image.name : 'Choisir une image'}</span>
                    </label>
                  </div>
                  <select
                    value={destinationForm.departure_country_id}
                    onChange={e => setDestinationForm({ ...destinationForm, departure_country_id: e.target.value })}
                    className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    required
                  >
                    <option value="">Pays de départ *</option>
                    {countries.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <select
                    value={destinationForm.arrival_country_id}
                    onChange={e => setDestinationForm({ ...destinationForm, arrival_country_id: e.target.value })}
                    className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    required
                  >
                    <option value="">Pays d'arrivée *</option>
                    {countries.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <textarea
                  placeholder="Description"
                  value={destinationForm.description}
                  onChange={e => setDestinationForm({ ...destinationForm, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  rows="3"
                />

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm sm:text-base" style={{ color: '#1b5e8e' }}>Tarifs par nombre de personnes</h4>
                    <button
                      onClick={addPriceField}
                      type="button"
                      className="px-3 py-1 text-white rounded text-xs sm:text-sm hover:opacity-90"
                      style={{ backgroundColor: '#1b5e8e' }}
                    >
                      + Ajouter un tarif
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {destinationForm.prices.map((price, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Nb personnes"
                          value={price.people_count}
                          onChange={e => updatePriceField(index, 'people_count', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Prix (FCFA)"
                          value={price.price}
                          onChange={e => updatePriceField(index, 'price', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        {destinationForm.prices.length > 1 && (
                          <button
                            onClick={() => removePriceField(index)}
                            type="button"
                            className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:opacity-90"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddDestination}
                  disabled={submitting}
                  className="w-full text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base disabled:opacity-50"
                  style={{ backgroundColor: '#1b5e8e' }}
                >
                  {submitting ? 'Ajout en cours...' : 'Ajouter la destination'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {destinations.map(dest => (
                <div key={dest.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  {dest.image && (
                    <img src={dest.image} alt={dest.title} className="w-full h-40 sm:h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <h4 className="font-bold text-base sm:text-lg mb-2">{dest.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{dest.description}</p>
                    
                    {dest.prices && dest.prices.length > 0 && (
                      <div className="mb-3 border-t pt-2">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Tarifs:</p>
                        {dest.prices.map((price, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-gray-600">
                            <span>{price.people_count} pers.</span>
                            <span className="font-bold" style={{ color: '#1b5e8e' }}>{price.price} FCFA</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleDeleteItem('destinations', dest.id)}
                      disabled={submitting}
                      className="w-full text-white py-2 rounded-lg text-xs sm:text-sm hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: '#cd1422' }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ouikenac' && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Packages Ouikenac</h2>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#f18f13' }}>Ajouter un package Ouikenac</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Titre *"
                  value={ouikenacForm.title}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, title: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  required
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileChange(e, setOuikenacForm, ouikenacForm)}
                    className="hidden"
                    id="ouik-image"
                  />
                  <label 
                    htmlFor="ouik-image"
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm sm:text-base"
                  >
                    <Upload size={18} />
                    <span className="text-gray-600 truncate">{ouikenacForm.image ? ouikenacForm.image.name : 'Choisir une image'}</span>
                  </label>
                </div>
                <select
                  value={ouikenacForm.departure_country_id}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, departure_country_id: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  required
                >
                  <option value="">Pays de départ *</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select
                  value={ouikenacForm.arrival_country_id}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, arrival_country_id: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                >
                  <option value="">Pays d'arrivée</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select
                  value={ouikenacForm.departure_city_id}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, departure_city_id: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  required
                >
                  <option value="">Ville de départ *</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select
                  value={ouikenacForm.arrival_city_id}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, arrival_city_id: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  required
                >
                  <option value="">Ville d'arrivée *</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Prix *"
                  value={ouikenacForm.price}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, price: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  required
                />
                <div className="flex gap-2 sm:gap-4">
                  <input
                    type="number"
                    placeholder="Min *"
                    value={ouikenacForm.min_people}
                    onChange={e => setOuikenacForm({ ...ouikenacForm, min_people: e.target.value })}
                    className="w-1/2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  />
                  <input
                    type="number"
                    placeholder="Max *"
                    value={ouikenacForm.max_people}
                    onChange={e => setOuikenacForm({ ...ouikenacForm, max_people: e.target.value })}
                    className="w-1/2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={ouikenacForm.description}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, description: e.target.value })}
                  className="col-span-1 md:col-span-2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  rows="3"
                />
                <button
                  onClick={handleAddOuikenac}
                  disabled={submitting}
                  className="col-span-1 md:col-span-2 text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base disabled:opacity-50"
                  style={{ backgroundColor: '#f18f13' }}
                >
                  {submitting ? 'Ajout en cours...' : 'Ajouter le package Ouikenac'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {ouikenacs.map(ouik => (
                <div key={ouik.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  {ouik.image && (
                    <img src={ouik.image} alt={ouik.title} className="w-full h-40 sm:h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <h4 className="font-bold text-base sm:text-lg mb-2">{ouik.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{ouik.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-sm sm:text-base" style={{ color: '#f18f13' }}>
                        {ouik.prices && ouik.prices[0] ? ouik.prices[0].price : ouik.price} FCFA
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">{ouik.min_people}-{ouik.max_people} pers.</span>
                    </div>
                    <button
                      onClick={() => handleDeleteItem('ouikenac', ouik.id)}
                      disabled={submitting}
                      className="w-full text-white py-2 rounded-lg text-xs sm:text-sm hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: '#cd1422' }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'citytour' && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">City Tours</h2>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#40bcd5' }}>Ajouter un City Tour</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom du tour *"
                  value={cityTourForm.nom}
                  onChange={e => setCityTourForm({ ...cityTourForm, nom: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                  required
                />
                <select
                  value={cityTourForm.country_id}
                  onChange={e => setCityTourForm({ ...cityTourForm, country_id: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                  required
                >
                  <option value="">Sélectionner un pays *</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select
                  value={cityTourForm.city_id}
                  onChange={e => setCityTourForm({ ...cityTourForm, city_id: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                  required
                >
                  <option value="">Sélectionner une ville *</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={cityTourForm.date}
                  onChange={e => setCityTourForm({ ...cityTourForm, date: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                  required
                />
                <input
                  type="number"
                  placeholder="Prix *"
                  value={cityTourForm.price}
                  onChange={e => setCityTourForm({ ...cityTourForm, price: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                  required
                />
                <div className="flex gap-2 sm:gap-4">
                  <input
                    type="number"
                    placeholder="Min personnes *"
                    value={cityTourForm.places_min}
                    onChange={e => setCityTourForm({ ...cityTourForm, places_min: e.target.value })}
                    className="w-1/2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                  />
                  <input
                    type="number"
                    placeholder="Max personnes *"
                    value={cityTourForm.places_max}
                    onChange={e => setCityTourForm({ ...cityTourForm, places_max: e.target.value })}
                    className="w-1/2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={cityTourForm.description}
                  onChange={e => setCityTourForm({ ...cityTourForm, description: e.target.value })}
                  className="col-span-1 md:col-span-2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                  rows="3"
                />
                <button
                  onClick={handleAddCityTour}
                  disabled={submitting}
                  className="col-span-1 md:col-span-2 text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base disabled:opacity-50"
                  style={{ backgroundColor: '#40bcd5' }}
                >
                  {submitting ? 'Ajout en cours...' : 'Ajouter le City Tour'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {cityTours.map(tour => (
                <div key={tour.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-4">
                    <h4 className="font-bold text-base sm:text-lg mb-2">{tour.title || tour.nom}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{tour.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={14} className="text-gray-500 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm text-gray-600">{tour.scheduled_date || tour.date}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-sm sm:text-base" style={{ color: '#40bcd5' }}>
                        {tour.prices && tour.prices[0] ? tour.prices[0].price : tour.price} FCFA
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">{tour.places_min || tour.min_people}-{tour.places_max || tour.max_people} pers.</span>
                    </div>
                    <button
                      onClick={() => handleDeleteItem('city-tours', tour.id)}
                      disabled={submitting}
                      className="w-full text-white py-2 rounded-lg text-xs sm:text-sm hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: '#cd1422' }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Gestion des réservations</h2>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="text-white" style={{ backgroundColor: '#1b5e8e' }}>
                    <tr>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">Client</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">Contact</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">Dates</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">Voyageurs</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">Prix</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">Statut</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res, idx) => (
                      <tr key={res.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm">{res.full_name}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="text-xs sm:text-sm">{res.email}</div>
                          <div className="text-xs text-gray-500">{res.phone}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                          <div>{res.date_from}</div>
                          <div className="text-gray-500">au {res.date_to}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">{res.travelers}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-xs sm:text-sm">{res.total_price} {res.currency}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            res.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            res.status === 'approved' ? 'bg-green-100 text-green-800' :
                            res.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {res.status === 'pending' ? 'En attente' :
                             res.status === 'approved' ? 'Approuvée' :
                             res.status === 'rejected' ? 'Rejetée' : 'Annulée'}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          {res.status === 'pending' && (
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => handleUpdateReservationStatus(res.id, 'approved')}
                                disabled={submitting}
                                className="px-2 sm:px-3 py-1 text-white rounded text-xs hover:opacity-90 whitespace-nowrap disabled:opacity-50"
                                style={{ backgroundColor: '#3fa535' }}
                              >
                                Approuver
                              </button>
                              <button
                                onClick={() => handleUpdateReservationStatus(res.id, 'rejected')}
                                disabled={submitting}
                                className="px-2 sm:px-3 py-1 text-white rounded text-xs hover:opacity-90 whitespace-nowrap disabled:opacity-50"
                                style={{ backgroundColor: '#cd1422' }}
                              >
                                Rejeter
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;