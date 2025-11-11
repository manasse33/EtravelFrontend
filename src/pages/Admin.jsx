import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Package, MapPin, TrendingUp, DollarSign, Calendar, Settings, Home, Globe, Building, Plane, Compass, Navigation, Menu, X, Upload } from 'lucide-react';

const API_BASE = 'https://etravelbackend-production.up.railway.app/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [ouikenacs, setOuikenacs] = useState([]);
  const [cityTours, setCityTours] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [countryForm, setCountryForm] = useState({ name: '', code: '' });
  const [cityForm, setCityForm] = useState({ name: '', country_id: '' });
  
  const [destinationForm, setDestinationForm] = useState({
    title: '', 
    description: '', 
    image: null, 
    departure_country_id: '',
    arrival_country_id: '',
    prices: [{ people_count: '', price: '' }],
    services: []
  });

  const [ouikenacForm, setOuikenacForm] = useState({
    nom: '', description: '', image: null, country_depart_id: '', country_arrivee_id: '',
    city_depart_id: '', city_arrivee_id: '', prix: '', places_min: 1, places_max: 10,
    programme: '', repas: false, transport: false, hebergement: false
  });

  const [cityTourForm, setCityTourForm] = useState({
    nom: '', description: '', country_id: '', date: '',
    prix: '', places_min: 1, places_max: 10
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [countriesRes, destinationsRes, ouikenacsRes, toursRes, reservationsRes] = await Promise.all([
        fetch(`${API_BASE}/countries`).then(r => r.json()),
        fetch(`${API_BASE}/destinations`).then(r => r.json()),
        fetch(`${API_BASE}/ouikenac`).then(r => r.json()),
        fetch(`${API_BASE}/city-tours`).then(r => r.json()),
        fetch(`${API_BASE}/reservations`).then(r => r.json())
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
    }
    setLoading(false);
  };

  const handleFileChange = (e, formSetter, formData) => {
    const file = e.target.files[0];
    if (file) {
      formSetter({ ...formData, image: file });
    }
  };

  const handleAddCountry = async () => {
    if (!countryForm.name || !countryForm.code) return;
    try {
      await fetch(`${API_BASE}/countries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(countryForm)
      });
      setCountryForm({ name: '', code: '' });
      loadData();
    } catch (error) {
      console.error('Erreur ajout pays:', error);
    }
  };

  const handleAddCity = async () => {
    if (!cityForm.name || !cityForm.country_id) return;
    try {
      await fetch(`${API_BASE}/cities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cityForm)
      });
      setCityForm({ name: '', country_id: '' });
      loadData();
    } catch (error) {
      console.error('Erreur ajout ville:', error);
    }
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
    if (!destinationForm.title || !destinationForm.departure_country_id || !destinationForm.arrival_country_id) return;
    
    try {
      const payload = {
        title: destinationForm.title,
        description: destinationForm.description,
        image: destinationForm.image ? URL.createObjectURL(destinationForm.image) : '',
        departure_country_id: destinationForm.departure_country_id,
        arrival_country_id: destinationForm.arrival_country_id,
        prices: destinationForm.prices.filter(p => p.people_count && p.price),
        services: destinationForm.services
      };
      
      await fetch(`${API_BASE}/destinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      setDestinationForm({
        title: '', 
        description: '', 
        image: null, 
        departure_country_id: '',
        arrival_country_id: '',
        prices: [{ people_count: '', price: '' }],
        services: []
      });
      loadData();
    } catch (error) {
      console.error('Erreur ajout destination:', error);
    }
  };

  const handleAddOuikenac = async () => {
    if (!ouikenacForm.nom || !ouikenacForm.city_depart_id || !ouikenacForm.city_arrivee_id || !ouikenacForm.prix) return;
    try {
      const formData = new FormData();
      Object.keys(ouikenacForm).forEach(key => {
        if (ouikenacForm[key] !== null) {
          formData.append(key, ouikenacForm[key]);
        }
      });
      
      await fetch(`${API_BASE}/ouikenac`, {
        method: 'POST',
        body: formData
      });
      setOuikenacForm({
        nom: '', description: '', image: null, country_depart_id: '', country_arrivee_id: '',
        city_depart_id: '', city_arrivee_id: '', prix: '', places_min: 1, places_max: 10,
        programme: '', repas: false, transport: false, hebergement: false
      });
      loadData();
    } catch (error) {
      console.error('Erreur ajout Ouikenac:', error);
    }
  };

  const handleAddCityTour = async () => {
    if (!cityTourForm.nom || !cityTourForm.country_id || !cityTourForm.date || !cityTourForm.prix) return;
    try {
      await fetch(`${API_BASE}/city-tours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cityTourForm)
      });
      setCityTourForm({
        nom: '', description: '', country_id: '', date: '',
        prix: '', places_min: 1, places_max: 10
      });
      loadData();
    } catch (error) {
      console.error('Erreur ajout City Tour:', error);
    }
  };

  const handleDeleteItem = async (type, id) => {
    try {
      await fetch(`${API_BASE}/${type}/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const handleUpdateReservationStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/reservations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      loadData();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Tableau de bord</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4" style={{ borderLeftColor: '#1b5e8e' }}>
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

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4" style={{ borderLeftColor: '#3fa535' }}>
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

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4" style={{ borderLeftColor: '#f18f13' }}>
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

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4" style={{ borderLeftColor: '#f7d617' }}>
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
                    onChange={e => setCountryForm({ ...countryForm, code: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <button
                    onClick={handleAddCountry}
                    className="w-full text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base"
                    style={{ backgroundColor: '#1b5e8e' }}
                  >
                    Ajouter le pays
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
                    className="w-full text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base"
                    style={{ backgroundColor: '#f18f13' }}
                  >
                    Ajouter la ville
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 bg-white rounded-xl p-4 sm:p-6 shadow-md">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Pays et villes configurés</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {countries.map(country => (
                  <div key={country.id} className="border border-gray-200 rounded-lg p-4">
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
                    placeholder="Titre"
                    value={destinationForm.title}
                    onChange={e => setDestinationForm({ ...destinationForm, title: e.target.value })}
                    className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
                  >
                    <option value="">Pays de départ</option>
                    {countries.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <select
                    value={destinationForm.arrival_country_id}
                    onChange={e => setDestinationForm({ ...destinationForm, arrival_country_id: e.target.value })}
                    className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    <option value="">Pays d'arrivée</option>
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
                  className="w-full text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base"
                  style={{ backgroundColor: '#1b5e8e' }}
                >
                  Ajouter la destination
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
                      className="w-full text-white py-2 rounded-lg text-xs sm:text-sm hover:opacity-90"
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
                  placeholder="Nom"
                  value={ouikenacForm.nom}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, nom: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
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
                  value={ouikenacForm.country_depart_id}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, country_depart_id: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                >
                  <option value="">Pays de départ</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select
                  value={ouikenacForm.country_arrivee_id}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, country_arrivee_id: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                >
                  <option value="">Pays d'arrivée</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select
                  value={ouikenacForm.city_depart_id}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, city_depart_id: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                >
                  <option value="">Ville de départ</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select
                  value={ouikenacForm.city_arrivee_id}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, city_arrivee_id: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                >
                  <option value="">Ville d'arrivée</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Prix"
                  value={ouikenacForm.prix}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, prix: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                />
                <div className="flex gap-2 sm:gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={ouikenacForm.places_min}
                    onChange={e => setOuikenacForm({ ...ouikenacForm, places_min: e.target.value })}
                    className="w-1/2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={ouikenacForm.places_max}
                    onChange={e => setOuikenacForm({ ...ouikenacForm, places_max: e.target.value })}
                    className="w-1/2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-wrap gap-4 sm:gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={ouikenacForm.repas}
                      onChange={e => setOuikenacForm({ ...ouikenacForm, repas: e.target.checked })}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <span>Repas inclus</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={ouikenacForm.transport}
                      onChange={e => setOuikenacForm({ ...ouikenacForm, transport: e.target.checked })}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <span>Transport</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={ouikenacForm.hebergement}
                      onChange={e => setOuikenacForm({ ...ouikenacForm, hebergement: e.target.checked })}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <span>Hébergement</span>
                  </label>
                </div>
                <textarea
                  placeholder="Description"
                  value={ouikenacForm.description}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, description: e.target.value })}
                  className="col-span-1 md:col-span-2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  rows="3"
                />
                <textarea
                  placeholder="Programme"
                  value={ouikenacForm.programme}
                  onChange={e => setOuikenacForm({ ...ouikenacForm, programme: e.target.value })}
                  className="col-span-1 md:col-span-2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  rows="3"
                />
                <button
                  onClick={handleAddOuikenac}
                  className="col-span-1 md:col-span-2 text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base"
                  style={{ backgroundColor: '#f18f13' }}
                >
                  Ajouter le package Ouikenac
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {ouikenacs.map(ouik => (
                <div key={ouik.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  {ouik.image && (
                    <img src={ouik.image} alt={ouik.nom} className="w-full h-40 sm:h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <h4 className="font-bold text-base sm:text-lg mb-2">{ouik.nom}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{ouik.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {ouik.repas && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Repas</span>}
                      {ouik.transport && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Transport</span>}
                      {ouik.hebergement && <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Hébergement</span>}
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-sm sm:text-base" style={{ color: '#f18f13' }}>{ouik.prix} FCFA</span>
                      <span className="text-xs sm:text-sm text-gray-500">{ouik.places_min}-{ouik.places_max} pers.</span>
                    </div>
                    <button
                      onClick={() => handleDeleteItem('ouikenac', ouik.id)}
                      className="w-full text-white py-2 rounded-lg text-xs sm:text-sm hover:opacity-90"
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
                  placeholder="Nom du tour"
                  value={cityTourForm.nom}
                  onChange={e => setCityTourForm({ ...cityTourForm, nom: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
                <select
                  value={cityTourForm.country_id}
                  onChange={e => setCityTourForm({ ...cityTourForm, country_id: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                >
                  <option value="">Sélectionner un pays</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={cityTourForm.date}
                  onChange={e => setCityTourForm({ ...cityTourForm, date: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
                <input
                  type="number"
                  placeholder="Prix"
                  value={cityTourForm.prix}
                  onChange={e => setCityTourForm({ ...cityTourForm, prix: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
                <div className="flex gap-2 sm:gap-4">
                  <input
                    type="number"
                    placeholder="Min personnes"
                    value={cityTourForm.places_min}
                    onChange={e => setCityTourForm({ ...cityTourForm, places_min: e.target.value })}
                    className="w-1/2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                  />
                  <input
                    type="number"
                    placeholder="Max personnes"
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
                  className="col-span-1 md:col-span-2 text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base"
                  style={{ backgroundColor: '#40bcd5' }}
                >
                  Ajouter le City Tour
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {cityTours.map(tour => (
                <div key={tour.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-4">
                    <h4 className="font-bold text-base sm:text-lg mb-2">{tour.nom}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{tour.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={14} className="text-gray-500 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm text-gray-600">{tour.date}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-sm sm:text-base" style={{ color: '#40bcd5' }}>{tour.prix} FCFA</span>
                      <span className="text-xs sm:text-sm text-gray-500">{tour.places_min}-{tour.places_max} pers.</span>
                    </div>
                    <button
                      onClick={() => handleDeleteItem('city-tours', tour.id)}
                      className="w-full text-white py-2 rounded-lg text-xs sm:text-sm hover:opacity-90"
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
                                className="px-2 sm:px-3 py-1 text-white rounded text-xs hover:opacity-90 whitespace-nowrap"
                                style={{ backgroundColor: '#3fa535' }}
                              >
                                Approuver
                              </button>
                              <button
                                onClick={() => handleUpdateReservationStatus(res.id, 'rejected')}
                                className="px-2 sm:px-3 py-1 text-white rounded text-xs hover:opacity-90 whitespace-nowrap"
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
    </div>
  );
};

export default AdminDashboard;
