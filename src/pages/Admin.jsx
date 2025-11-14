import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Package, MapPin, TrendingUp, DollarSign, Calendar, Settings, Home, Globe, Building, Plane, Compass, Navigation, Menu, X, Upload, Loader2, CheckCircle, AlertCircle, XCircle, Edit2, Trash2, Plus, CornerDownRight, Info } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'https://etravelbackend-production.up.railway.app/api';

// --- ASSUMPTION & HELPERS ---
// Détermine le type de package d'une réservation (basé sur une structure Laravel polymorphe courante)
const getReservationType = (reservation) => {
  if (reservation.reservable_type) {
    if (reservation.reservable_type.includes('DestinationPackage')) return 'Destination';
    if (reservation.reservable_type.includes('OuikenacPackage')) return 'Ouikenac';
    if (reservation.reservable_type.includes('CityTour')) return 'City Tour';
  }
  if (reservation.destination_package_id || (reservation.reservable && reservation.reservable.title)) return 'Destination'; 
  if (reservation.ouikenac_package_id || (reservation.reservable && reservation.reservable.title && reservation.reservable_type && reservation.reservable_type.includes('Ouikenac'))) return 'Ouikenac';
  if (reservation.city_tour_id || (reservation.reservable && reservation.reservable.title && reservation.reservable_type && reservation.reservable_type.includes('CityTour'))) return 'City Tour';
  
  return 'Inconnu';
};

const formatPrice = (price) => {
  if (!price) return 'N/A';
  return parseFloat(price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// --- API CLIENT ---
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- COMPOSANTS RÉUTILISABLES ---

const Notification = ({ show, message, type, onClose }) => {
  if (!show) return null;

  const configs = {
    success: { icon: <CheckCircle size={24} />, bg: 'bg-green-100', border: 'border-green', text: 'text-green' },
    error: { icon: <XCircle size={24} />, bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-800' },
    warning: { icon: <AlertCircle size={24} />, bg: 'bg-warning/20', border: 'border-warning/50', text: 'text-gray-900' }
  };

  const config = configs[type];

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full ${config.bg} border-l-4 ${config.border} rounded-r-xl p-4 shadow-2xl animate-slide-in`}>
      <div className="flex items-start gap-3">
        <div className={config.text}>{config.icon}</div>
        <div className="flex-1">
          <p className="font-semibold mb-1">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
          <p className="text-sm text-gray-700">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center">
                <div className="relative">
                    <Loader2 className="animate-spin h-12 w-12 text-primary" />
                    <div className="absolute inset-0 h-12 w-12 border-4 border-primary/20 rounded-full"></div>
                </div>
                <p className="text-gray-700 font-semibold text-lg mt-6">Chargement des données...</p>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-4 overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-progress"></div>
                </div>
            </div>
        </div>
    </div>
);

// --- COMPOSANT PRINCIPAL ADMIN ---

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
  // Data States
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [ouikenacs, setOuikenacs] = useState([]);
  const [cityTours, setCityTours] = useState([]);
  const [reservations, setReservations] = useState([]);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'country', 'destination', 'ouikenac', 'cityTour'
  const [isEdit, setIsEdit] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editRelations, setEditRelations] = useState({ prices: [], additionalCities: [], inclusions: [] }); // Specific for Ouikenac
  
  // NOUVEAU: État pour l'ajout de ville dans la modale pays
  const [newCityForm, setNewCityForm] = useState({ name: '', country_id: null });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const getReservationLabel = useMemo(() => (reservable) => {
    if (!reservable) return 'N/A';
    if (reservable.title) return reservable.title;
    if (reservable.name) return reservable.name;
    return 'Détails non chargés';
  }, []);

  // --- DATA FETCHING (EAGER LOADING INCLUS) ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [countriesRes, destinationsRes, ouikenacsRes, toursRes, reservationsRes] = await Promise.all([
        // S'assurer que les pays chargent bien les villes
        fetch(`${API_BASE}/countries?with=cities`).then(r => r.ok ? r.json() : Promise.reject(new Error('Erreur pays'))),
        
        // Charger le pays de départ pour les destinations
        fetch(`${API_BASE}/destinations?with=departureCountry`).then(r => r.ok ? r.json() : Promise.reject(new Error('Erreur destinations'))),
        
        // Charger les relations complexes de Ouikenac
        fetch(`${API_BASE}/ouikenac?with=prices.departureCountry,prices.arrivalCountry,additionalCities.city.country,inclusions`).then(r => r.ok ? r.json() : Promise.reject(new Error('Erreur Ouikenac'))),
        
        // Charger la ville du City Tour et son pays associé
        fetch(`${API_BASE}/city-tours?with=city.country`).then(r => r.ok ? r.json() : Promise.reject(new Error('Erreur City Tours'))),
        
        fetch(`${API_BASE}/reservations?with=reservable`).then(r => r.ok ? r.json() : Promise.reject(new Error('Erreur réservations')))
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

  // --- DASHBOARD DATA ---
  const dashboardData = useMemo(() => {
    const totalReservations = reservations.length;
    const totalRevenue = reservations.reduce((sum, r) => sum + (r.price || 0), 0);
    const totalPackages = destinations.length + ouikenacs.length + cityTours.length;

    const reservationsByType = reservations.reduce((acc, r) => {
      const type = getReservationType(r);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(reservationsByType).map(([name, value]) => ({ name, value }));
    
    return { totalReservations, totalRevenue, totalPackages, reservationsByType, chartData };
  }, [reservations, destinations, ouikenacs, cityTours]);

  // --- MODAL & FORM LOGIC ---
  const openModal = (type, data = null) => {
    setModalType(type);
    setIsEdit(!!data);
    setShowModal(true);
    
    if (data) {
      // Pour les entités simples
      setEditForm(data);

      // Pour Pays, initialiser la forme d'ajout de ville
      if (type === 'country') {
          setNewCityForm({ name: '', country_id: data.id });
      }

      // Pour Ouikenac, initialiser les relations
      if (type === 'ouikenac') {
        setEditRelations({ 
          prices: data.prices || [], 
          additionalCities: data.additional_cities || [], 
          inclusions: data.inclusions || [] 
        });
      }
    } else {
      // Valeurs par défaut pour la création
      const defaultForms = {
        country: { name: '', code: '' },
        destination: { title: '', description: '', departure_country_id: '' },
        ouikenac: { title: '', description: '', duration: 'Week-end', period: 'Tous les week-ends', active: true },
        cityTour: { name: '', description: '', price: 0, currency: 'CFA', country_id: '', city_id: '' }
      };
      setEditForm(defaultForms[type] || {});
      setEditRelations({ prices: [], additionalCities: [], inclusions: [] });
      setNewCityForm({ name: '', country_id: null }); // Réinitialiser l'ajout de ville
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditForm({});
    setEditRelations({ prices: [], additionalCities: [], inclusions: [] });
    setNewCityForm({ name: '', country_id: null });
    setModalType(null);
  };
  
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // --- CRUD HANDLERS (EXEMPLES) ---

  const handleCreateOrUpdate = async (endpoint, data, successMessage) => {
    setSubmitting(true);
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `${API_BASE}/${endpoint}/${data.id}` : `${API_BASE}/${endpoint}`;
      
      // Ajouter les relations pour Ouikenac
      let payload = data;
      if (modalType === 'ouikenac') {
        payload = {
            ...data,
            prices: editRelations.prices.map(p => ({
                ...p,
                // Ensure IDs are numbers for the backend
                departure_country_id: parseInt(p.departure_country_id),
                arrival_country_id: parseInt(p.arrival_country_id),
                min_people: parseInt(p.min_people),
                max_people: parseInt(p.max_people),
                price: parseFloat(p.price),
            })),
            additional_cities: editRelations.additionalCities.map(ac => ({
                ...ac,
                city_id: parseInt(ac.city_id)
            })),
            inclusions: editRelations.inclusions
        };
      }
      
      await api({ method, url, data: payload });
      showNotification(successMessage, 'success');
      
      // Si on crée un pays, on ferme la modale. Si on modifie, on recharge pour garder les données à jour
      // (important si on modifie le nom dans la modale et qu'on veut ajouter une ville après)
      if (modalType === 'country' && isEdit) {
          // On recharge les données pour mettre à jour la liste des pays (nécessaire pour la sidebar/table)
          await loadData();
          
          // On met à jour l'état de la modale avec les nouvelles données du pays
          const updatedCountry = countries.find(c => c.id === data.id);
          if (updatedCountry) {
              setEditForm(updatedCountry);
          }
      } else {
          closeModal();
          await loadData();
      }
      
    } catch (error) {
      console.error('Erreur CRUD:', error.response?.data || error);
      showNotification(error.response?.data?.message || 'Erreur lors de l\'opération.', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDelete = async (endpoint, id, successMessage) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer cet élément (ID: ${id}) ?`)) return;

    setSubmitting(true);
    try {
      await api.delete(`${API_BASE}/${endpoint}/${id}`);
      showNotification(successMessage, 'success');
      await loadData();
    } catch (error) {
      console.error('Erreur Suppression:', error.response?.data || error);
      showNotification(error.response?.data?.message || 'Erreur lors de la suppression.', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // NOUVEAU: CRUD pour les Villes (spécifique à la modale Pays)
  const handleAddCity = async (countryId, cityName) => {
    if (!cityName.trim()) {
        showNotification('Le nom de la ville est requis.', 'warning');
        return;
    }
    setSubmitting(true);
    try {
        // Supposons une route Laravel: POST /api/countries/{id}/cities
        await api.post(`${API_BASE}/countries/${countryId}/cities`, { name: cityName });
        showNotification('Ville ajoutée avec succès.', 'success');
        
        // Rafraîchir les données et mettre à jour l'état de la modale
        await loadData();
        
        // Mettre à jour l'état de la modale avec les données complètes du pays
        const updatedCountry = countries.find(c => c.id === countryId);
        if (updatedCountry) {
            setEditForm(updatedCountry);
        }
        
        setNewCityForm(prev => ({ ...prev, name: '' })); // Vider l'input de la ville
    } catch (error) {
        console.error('Erreur Ajout Ville:', error.response?.data || error);
        showNotification(error.response?.data?.message || 'Erreur lors de l\'ajout de la ville.', 'error');
    } finally {
        setSubmitting(false);
    }
  };

  const handleDeleteCity = async (cityId) => {
      if (!window.confirm(`Êtes-vous sûr de vouloir supprimer cette ville (ID: ${cityId}) ?`)) return;

      setSubmitting(true);
      try {
          // Supposons une route Laravel: DELETE /api/cities/{id}
          await api.delete(`${API_BASE}/cities/${cityId}`);
          showNotification('Ville supprimée.', 'success');
          
          // Rafraîchir les données et mettre à jour l'état de la modale
          await loadData();
          
          // Mettre à jour l'état de la modale en filtrant la ville supprimée
          setEditForm(prev => ({
              ...prev,
              cities: prev.cities.filter(c => c.id !== cityId)
          }));
      } catch (error) {
          console.error('Erreur Suppression Ville:', error.response?.data || error);
          showNotification(error.response?.data?.message || 'Erreur lors de la suppression de la ville.', 'error');
      } finally {
          setSubmitting(false);
      }
  };

  // --- OUICKENAC RELATION MANAGEMENT ---
  // (Le code de gestion des relations Ouikenac reste inchangé)

  const handleAddPrice = () => {
    setEditRelations(prev => ({
        ...prev,
        prices: [...prev.prices, { 
            departure_country_id: '', 
            arrival_country_id: '', 
            min_people: 1, 
            max_people: 2, 
            price: 0, 
            currency: 'CFA' 
        }]
    }));
  };

  const handleUpdatePrice = (index, field, value) => {
    const updatedPrices = [...editRelations.prices];
    updatedPrices[index][field] = value;
    setEditRelations(prev => ({ ...prev, prices: updatedPrices }));
  };

  const handleRemovePrice = (index) => {
    setEditRelations(prev => ({
        ...prev,
        prices: prev.prices.filter((_, i) => i !== index)
    }));
  };
  
  const handleAddInclusion = () => {
    setEditRelations(prev => ({
        ...prev,
        inclusions: [...prev.inclusions, { name: '' }]
    }));
  };

  const handleUpdateInclusion = (index, value) => {
    const updatedInclusions = [...editRelations.inclusions];
    updatedInclusions[index].name = value;
    setEditRelations(prev => ({ ...prev, inclusions: updatedInclusions }));
  };

  const handleRemoveInclusion = (index) => {
    setEditRelations(prev => ({
        ...prev,
        inclusions: prev.inclusions.filter((_, i) => i !== index)
    }));
  };
  
  const handleAddAdditionalCity = () => {
    setEditRelations(prev => ({
        ...prev,
        additionalCities: [...prev.additionalCities, { city_id: '', type: 'stopover' }]
    }));
  };

  const handleUpdateAdditionalCity = (index, field, value) => {
    const updatedCities = [...editRelations.additionalCities];
    updatedCities[index][field] = value;
    setEditRelations(prev => ({ ...prev, additionalCities: updatedCities }));
  };

  const handleRemoveAdditionalCity = (index) => {
    setEditRelations(prev => ({
        ...prev,
        additionalCities: prev.additionalCities.filter((_, i) => i !== index)
    }));
  };
  
  // --- RENDER MODAL CONTENT ---

  const renderModalContent = () => {
    if (!modalType) return null;

    const getFormTitle = (type) => isEdit ? `Modifier ${type}` : `Ajouter ${type}`;
    
    // --- Entités Simples (Pays) ---
    if (modalType === 'country') {
      return (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{getFormTitle('un Pays')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input type="text" name="name" value={editForm.name || ''} onChange={handleFormChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Code (Ex: RC, RDC)</label>
              <input type="text" name="code" value={editForm.code || ''} onChange={handleFormChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary" />
            </div>
          </div>
          
          {/* NOUVEAU: Gestion des Villes (uniquement en modification) */}
          {isEdit && (
              <div className="mt-8 border-t pt-6 border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={20} className="text-primary" /> Gestion des Villes</h3>
                  
                  {/* Liste des villes existantes */}
                  <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2">
                      {(editForm.cities || []).length === 0 ? (
                          <p className="text-sm text-gray-500">Aucune ville n'est encore associée à ce pays.</p>
                      ) : (
                          (editForm.cities || []).map(city => (
                              <div key={city.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md border border-gray-200">
                                  <span className="text-gray-700 font-medium">{city.name}</span>
                                  <button onClick={() => handleDeleteCity(city.id)} disabled={submitting} className="text-red-500 hover:text-red-700 disabled:opacity-50 transition p-1" title="Supprimer la ville">
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                          ))
                      )}
                  </div>
                  
                  {/* Formulaire pour ajouter une nouvelle ville */}
                  <div className="flex gap-2">
                      <input 
                          type="text" 
                          placeholder="Nom de la nouvelle ville"
                          value={newCityForm.name} 
                          onChange={(e) => setNewCityForm(prev => ({ ...prev, name: e.target.value }))}
                          className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary"
                      />
                      <button 
                          onClick={() => handleAddCity(editForm.id, newCityForm.name)} 
                          disabled={submitting || !newCityForm.name.trim()}
                          className="bg-primary text-white px-3 py-2 rounded-lg font-medium transition hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1 text-sm"
                      >
                          <Plus size={16} /> Ajouter
                      </button>
                  </div>
              </div>
          )}
          {/* Fin NOUVEAU: Gestion des Villes */}
          
          <button onClick={() => handleCreateOrUpdate('countries', editForm, isEdit ? 'Pays mis à jour.' : 'Pays créé.')} disabled={submitting} className="w-full mt-6 bg-primary text-white py-2 rounded-lg font-medium transition hover:bg-primary/90 disabled:opacity-50">
            {submitting ? 'Envoi en cours...' : (isEdit ? 'Enregistrer les modifications du Pays' : 'Créer le Pays')}
          </button>
        </>
      );
    }
    
    // --- Destination Packages ---
    if (modalType === 'destination') {
        return (
            <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{getFormTitle('une Destination')}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Titre</label>
                        <input type="text" name="title" value={editForm.title || ''} onChange={handleFormChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={editForm.description || ''} onChange={handleFormChange} rows="3" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pays de Départ</label>
                        <select name="departure_country_id" value={editForm.departure_country_id || ''} onChange={handleFormChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary">
                            <option value="">Sélectionnez un pays</option>
                            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    {/* Add other fields like price, image_url, etc. here if needed */}
                </div>
                <button onClick={() => handleCreateOrUpdate('destinations', editForm, isEdit ? 'Destination mise à jour.' : 'Destination créée.')} disabled={submitting} className="w-full mt-6 bg-primary text-white py-2 rounded-lg font-medium transition hover:bg-primary/90 disabled:opacity-50">
                    {submitting ? 'Envoi en cours...' : (isEdit ? 'Enregistrer les modifications' : 'Créer la Destination')}
                </button>
            </>
        );
    }
    
    // --- Ouikenac Packages (Complexe) ---
    if (modalType === 'ouikenac') {
        return (
            <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{getFormTitle('un Package Ouikenac')}</h2>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Titre</label>
                            <input type="text" name="title" value={editForm.title || ''} onChange={handleFormChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Statut</label>
                            <select name="active" value={editForm.active ? 'true' : 'false'} onChange={(e) => setEditForm(prev => ({...prev, active: e.target.value === 'true'}))} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary">
                                <option value="true">Actif</option>
                                <option value="false">Inactif</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={editForm.description || ''} onChange={handleFormChange} rows="3" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Durée</label>
                            <input type="text" name="duration" value={editForm.duration || ''} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Période</label>
                            <input type="text" name="period" value={editForm.period || ''} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary" />
                        </div>
                    </div>
                    
                    {/* Tarifs (Prices) */}
                    <div className="border p-4 rounded-lg bg-primary/10 border-primary/20">
                        <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2"><DollarSign size={20} /> Tarifs (Grilles de Prix)</h3>
                        <div className="space-y-4">
                            {editRelations.prices.map((price, index) => (
                                <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                                    <div className="grid grid-cols-4 gap-4 mb-2">
                                        <select value={price.departure_country_id || ''} onChange={(e) => handleUpdatePrice(index, 'departure_country_id', e.target.value)} required className="col-span-2 block w-full border border-gray-300 rounded-md p-2 text-sm focus:border-primary">
                                            <option value="">Départ</option>
                                            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <select value={price.arrival_country_id || ''} onChange={(e) => handleUpdatePrice(index, 'arrival_country_id', e.target.value)} required className="col-span-2 block w-full border border-gray-300 rounded-md p-2 text-sm focus:border-primary">
                                            <option value="">Arrivée</option>
                                            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        
                                        <input type="number" placeholder="Min Pers." value={price.min_people || 1} onChange={(e) => handleUpdatePrice(index, 'min_people', e.target.value)} required className="col-span-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:border-primary" />
                                        <input type="number" placeholder="Max Pers." value={price.max_people || 2} onChange={(e) => handleUpdatePrice(index, 'max_people', e.target.value)} required className="col-span-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:border-primary" />
                                        <input type="number" placeholder="Prix" value={price.price || 0} onChange={(e) => handleUpdatePrice(index, 'price', e.target.value)} required className="col-span-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:border-primary" />
                                        <select value={price.currency || 'CFA'} onChange={(e) => handleUpdatePrice(index, 'currency', e.target.value)} className="col-span-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:border-primary">
                                            <option value="CFA">CFA</option>
                                            <option value="USD">USD</option>
                                        </select>
                                        <button onClick={() => handleRemovePrice(index)} className="col-span-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm">Supprimer</button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={handleAddPrice} className="w-full bg-secondary text-white py-2 rounded-lg font-medium transition hover:bg-secondary/90 flex items-center justify-center gap-2"><Plus size={16} /> Ajouter Tarif</button>
                        </div>
                    </div>
                    
                    {/* Inclusions */}
                    <div className="border p-4 rounded-lg bg-green/10 border-green/20">
                        <h3 className="text-lg font-bold text-green mb-3 flex items-center gap-2"><CheckCircle size={20} /> Inclusions</h3>
                        <div className="space-y-2">
                            {editRelations.inclusions.map((inclusion, index) => (
                                <div key={index} className="flex gap-2">
                                    <input type="text" placeholder="Nom de l'inclusion" value={inclusion.name || ''} onChange={(e) => handleUpdateInclusion(index, e.target.value)} className="flex-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:border-green" />
                                    <button onClick={() => handleRemoveInclusion(index)} className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <button onClick={handleAddInclusion} className="w-full bg-green text-white py-2 rounded-lg font-medium transition hover:bg-green/90 flex items-center justify-center gap-2"><Plus size={16} /> Ajouter Inclusion</button>
                        </div>
                    </div>
                    
                    {/* Villes Additionnelles */}
                    <div className="border p-4 rounded-lg bg-warning/20 border-warning/50">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><MapPin size={20} className="text-warning" /> Villes Supplémentaires</h3>
                        <div className="space-y-2">
                            {editRelations.additionalCities.map((ac, index) => (
                                <div key={index} className="flex gap-2">
                                    <select value={ac.city_id || ''} onChange={(e) => handleUpdateAdditionalCity(index, 'city_id', e.target.value)} required className="flex-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:border-warning">
                                        <option value="">Sélectionnez une Ville</option>
                                        {cities.map(city => <option key={city.id} value={city.id}>{city.name} ({countries.find(c => c.id === city.country_id)?.code})</option>)}
                                    </select>
                                    <select value={ac.type || 'stopover'} onChange={(e) => handleUpdateAdditionalCity(index, 'type', e.target.value)} required className="block w-40 border border-gray-300 rounded-md p-2 text-sm focus:border-warning">
                                        <option value="stopover">Étape</option>
                                        <option value="visit">Visite</option>
                                    </select>
                                    <button onClick={() => handleRemoveAdditionalCity(index)} className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <button onClick={handleAddAdditionalCity} className="w-full bg-warning text-gray-900 py-2 rounded-lg font-medium transition hover:bg-warning/90 flex items-center justify-center gap-2"><Plus size={16} /> Ajouter Ville</button>
                        </div>
                    </div>

                </div>
                <button onClick={() => handleCreateOrUpdate('ouikenac', editForm, isEdit ? 'Package Ouikenac mis à jour.' : 'Package Ouikenac créé.')} disabled={submitting} className="w-full mt-6 bg-primary text-white py-2 rounded-lg font-medium transition hover:bg-primary/90 disabled:opacity-50">
                    {submitting ? 'Envoi en cours...' : (isEdit ? 'Enregistrer les modifications' : 'Créer le Package')}
                </button>
            </>
        );
    }

    // --- City Tour ---
    if (modalType === 'cityTour') {
        return (
            <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{getFormTitle('un City Tour')}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nom du Tour</label>
                        <input type="text" name="name" value={editForm.name || ''} onChange={handleFormChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={editForm.description || ''} onChange={handleFormChange} rows="3" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prix</label>
                            <input type="number" name="price" value={editForm.price || 0} onChange={handleFormChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Devise</label>
                            <select name="currency" value={editForm.currency || 'CFA'} onChange={handleFormChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary">
                                <option value="CFA">CFA</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pays (pour filtrer la ville)</label>
                        <select 
                            name="country_id" 
                            value={editForm.country_id || editForm.city?.country_id || ''} 
                            onChange={(e) => setEditForm(prev => ({...prev, country_id: e.target.value, city_id: ''}))} 
                            required 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary"
                        >
                            <option value="">Sélectionnez le pays *</option>
                            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ville du Tour</label>
                        <select name="city_id" value={editForm.city_id || editForm.city?.id || ''} onChange={handleFormChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary" disabled={!editForm.country_id && !editForm.city?.country_id}>
                            <option value="">Sélectionnez la ville *</option>
                            {cities.filter(c => c.country_id === (editForm.country_id || editForm.city?.country_id)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
                <button onClick={() => handleCreateOrUpdate('city-tours', editForm, isEdit ? 'City Tour mis à jour.' : 'City Tour créé.')} disabled={submitting} className="w-full mt-6 bg-primary text-white py-2 rounded-lg font-medium transition hover:bg-primary/90 disabled:opacity-50">
                    {submitting ? 'Envoi en cours...' : (isEdit ? 'Enregistrer les modifications' : 'Créer le City Tour')}
                </button>
            </>
        );
    }

    return <p>Sélection de formulaire invalide.</p>;
  };
  
  // --- RENDER TABS ---
  const renderTabContent = () => {
    
    // --- DASHBOARD VIEW ---
    if (activeTab === 'dashboard') {
        const { totalReservations, totalRevenue, totalPackages, chartData } = dashboardData;
        const RADIAN = Math.PI / 180;
        const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            
            return (
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-bold">
                    {`${name} (${(percent * 100).toFixed(0)}%)`}
                </text>
            );
        };
        
        const PIE_COLORS = ['#1b5e8e', '#f18f13', '#007335', '#f7b406'];

        return (
            <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard 
                        icon={TrendingUp} 
                        title="Réservations Totales" 
                        value={totalReservations} 
                        color="primary" 
                    />
                    <StatCard 
                        icon={DollarSign} 
                        title="Revenu Estimé" 
                        value={`${formatPrice(totalRevenue)} CFA`} 
                        color="green" 
                    />
                    <StatCard 
                        icon={Package} 
                        title="Packages Actifs" 
                        value={totalPackages} 
                        color="secondary" 
                    />
                    <StatCard 
                        icon={Users} 
                        title="Utilisateurs" 
                        value="N/A" 
                        color="warning" 
                    />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2"><Calendar size={20} className="text-primary" /> Réservations par Type</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2"><MapPin size={20} className="text-primary" /> Packages par Pays</h3>
                        <div className="text-gray-600">
                            {/* Simple text display for now, can be replaced by a BarChart */}
                            <p className="p-3 bg-gray-50 rounded-lg">Fonctionnalité de répartition géographique à venir.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // --- RESERVATIONS VIEW ---
    if (activeTab === 'reservations') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Users size={24} className="text-primary" /> Liste des Réservations</h2>
                </div>
                <DataTable 
                    columns={[
                        { header: 'ID', accessor: 'id' },
                        { header: 'Nom', accessor: 'full_name' },
                        { header: 'Email', accessor: 'email' },
                        { header: 'Téléphone', accessor: 'phone' },
                        { header: 'Type', accessor: (r) => getReservationType(r) },
                        { header: 'Package', accessor: (r) => getReservationLabel(r.reservable) },
                        { header: 'Message', accessor: 'message' },
                        { header: 'Actions', accessor: 'actions', render: (r) => (
                            <button onClick={() => handleDelete('reservations', r.id, 'Réservation supprimée.')} disabled={submitting} className="text-red-500 hover:text-red-700 disabled:opacity-50 transition">
                                <Trash2 size={20} />
                            </button>
                        )}
                    ]} 
                    data={reservations} 
                />
            </div>
        );
    }
    
    // --- COUNTRIES VIEW ---
    if (activeTab === 'countries') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Globe size={24} className="text-primary" /> Gestion des Pays</h2>
                    <button onClick={() => openModal('country')} className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition hover:bg-primary/90 flex items-center gap-2"><Plus size={20} /> Nouveau Pays</button>
                </div>
                <DataTable 
                    columns={[
                        { header: 'ID', accessor: 'id' },
                        { header: 'Nom', accessor: 'name' },
                        { header: 'Code', accessor: 'code' },
                        { header: 'Villes', accessor: (c) => c.cities?.length || 0 },
                        { header: 'Actions', accessor: 'actions', render: (c) => (
                            <div className="flex gap-2">
                                <button onClick={() => openModal('country', c)} className="text-primary hover:text-primary/90 transition">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={() => handleDelete('countries', c.id, 'Pays supprimé.')} disabled={submitting} className="text-red-500 hover:text-red-700 disabled:opacity-50 transition">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        )}
                    ]} 
                    data={countries} 
                />
            </div>
        );
    }
    
    // --- DESTINATIONS VIEW ---
    if (activeTab === 'destinations') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Plane size={24} className="text-primary" /> Gestion des Destinations</h2>
                    <button onClick={() => openModal('destination')} className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition hover:bg-primary/90 flex items-center gap-2"><Plus size={20} /> Nouvelle Destination</button>
                </div>
                <DataTable 
                    columns={[
                        { header: 'ID', accessor: 'id' },
                        { header: 'Titre', accessor: 'title' },
                        { header: 'Description', accessor: (d) => `${d.description.substring(0, 50)}...` },
                        { header: 'Pays Départ', accessor: (d) => d.departure_country?.code || 'N/A' },
                        { header: 'Actions', accessor: 'actions', render: (d) => (
                            <div className="flex gap-2">
                                <button onClick={() => openModal('destination', d)} className="text-primary hover:text-primary/90 transition">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={() => handleDelete('destinations', d.id, 'Destination supprimée.')} disabled={submitting} className="text-red-500 hover:text-red-700 disabled:opacity-50 transition">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        )}
                    ]} 
                    data={destinations} 
                />
            </div>
        );
    }
    
    // --- OUIKENAC VIEW ---
    if (activeTab === 'ouikenacs') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Building size={24} className="text-warning" /> Gestion des Ouikenacs</h2>
                    <button onClick={() => openModal('ouikenac')} className="bg-warning text-gray-900 px-4 py-2 rounded-lg font-medium transition hover:bg-warning/90 flex items-center gap-2"><Plus size={20} /> Nouveau Package</button>
                </div>
                <DataTable 
                    columns={[
                        { header: 'ID', accessor: 'id' },
                        { header: 'Titre', accessor: 'title' },
                        { header: 'Statut', accessor: (o) => o.active ? <span className="text-green font-semibold">Actif</span> : <span className="text-red-500">Inactif</span> },
                        { header: 'Prix Min', accessor: (o) => {
                            const minPrice = o.prices?.length ? o.prices.reduce((min, p) => Math.min(min, p.price), Infinity) : 0;
                            const currency = o.prices?.[0]?.currency || 'CFA';
                            return `${formatPrice(minPrice)} ${currency}`;
                        }},
                        { header: 'Actions', accessor: 'actions', render: (o) => (
                            <div className="flex gap-2">
                                <button onClick={() => openModal('ouikenac', o)} className="text-warning hover:text-warning/90 transition">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={() => handleDelete('ouikenac', o.id, 'Ouikenac supprimé.')} disabled={submitting} className="text-red-500 hover:text-red-700 disabled:opacity-50 transition">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        )}
                    ]} 
                    data={ouikenacs} 
                />
            </div>
        );
    }
    
    // --- CITY TOURS VIEW ---
    if (activeTab === 'cityTours') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Compass size={24} className="text-green" /> Gestion des City Tours</h2>
                    <button onClick={() => openModal('cityTour')} className="bg-green text-white px-4 py-2 rounded-lg font-medium transition hover:bg-green/90 flex items-center gap-2"><Plus size={20} /> Nouveau City Tour</button>
                </div>
                <DataTable 
                    columns={[
                        { header: 'ID', accessor: 'id' },
                        { header: 'Nom', accessor: 'name' },
                        { header: 'Ville/Pays', accessor: (t) => `${t.city?.name || 'N/A'} (${t.city?.country?.code || 'N/A'})` },
                        { header: 'Prix', accessor: (t) => `${formatPrice(t.price)} ${t.currency}` },
                        { header: 'Actions', accessor: 'actions', render: (t) => (
                            <div className="flex gap-2">
                                <button onClick={() => openModal('cityTour', t)} className="text-green hover:text-green/90 transition">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={() => handleDelete('city-tours', t.id, 'City Tour supprimé.')} disabled={submitting} className="text-red-500 hover:text-red-700 disabled:opacity-50 transition">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        )}
                    ]} 
                    data={cityTours} 
                />
            </div>
        );
    }
    
    return <div className="p-10 text-center text-gray-500">Sélectionnez un onglet.</div>;
  };

  // --- COMPOSANTS DE PRÉSENTATION ---

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border-t-4 border-${color} flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <Icon size={40} className={`text-${color}/60`} />
    </div>
  );

  const DataTable = ({ columns, data }) => {
    if (data.length === 0) {
        return (
            <div className="text-center p-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Info size={32} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">Aucune donnée disponible pour le moment.</p>
            </div>
        );
    }
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    {columns.map(col => (
                        <th key={col.header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {data.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 transition">
                        {columns.map(col => (
                            <td key={col.header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {col.render ? col.render(row) : (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor])}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
  };
  
  const NavItem = ({ icon: Icon, label, tab }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setIsSidebarOpen(false); // Ferme la sidebar après la sélection sur mobile
      }}
      className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${
        activeTab === tab 
          ? 'bg-primary text-white font-bold shadow-lg shadow-primary/30' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} className="mr-3" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <LoadingOverlay />}
      <Notification 
        show={notification.show} 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ show: false, message: '', type: '' })} 
      />

      <div className="flex">
        
        {/* Sidebar Overlay (Mobile) */}
        {isSidebarOpen && (
            <div 
                className="fixed inset-0 bg-black/50 lg:hidden z-40" 
                onClick={() => setIsSidebarOpen(false)}
            ></div>
        )}

        {/* Sidebar */}
        <div className={`
            w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-screen shadow-2xl z-50 
            fixed top-0 left-0 
            transform transition-transform duration-300 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:static lg:h-auto lg:shadow-none lg:border-r 
            lg:flex 
        `}>
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-gray-900">e-TRAVEL <span className="text-primary">ADMIN</span></h1>
            <p className="text-xs text-primary tracking-wider">WORLD AGENCY</p>
          </div>
          {/* Bouton de fermeture sur mobile (visible uniquement si ouvert) */}
          <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="absolute top-4 right-4 text-gray-700 p-2 rounded-full hover:bg-gray-100 lg:hidden" 
              aria-label="Fermer le menu"
          >
              <X size={24} />
          </button>

          <nav className="space-y-3 flex-1">
            <NavItem icon={Home} label="Tableau de Bord" tab="dashboard" />
            <NavItem icon={Users} label="Réservations" tab="reservations" />
            <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-semibold uppercase text-gray-400 mb-2">Catalogue</h3>
                <NavItem icon={Globe} label="Pays" tab="countries" />
                <NavItem icon={Plane} label="Destinations" tab="destinations" />
                <NavItem icon={Building} label="Ouikenac" tab="ouikenacs" />
                <NavItem icon={Compass} label="City Tours" tab="cityTours" />
            </div>
          </nav>
        </div>

        {/* Content */}
        {/* MODIFIÉ: Ajout de lg:ml-64 au conteneur parent (plus sémantique) */}
        <div className="flex-1 lg:ml-64"> 
          <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-10 bg-white p-6 rounded-xl shadow-md sticky top-0 z-40 flex justify-between items-center">
              {/* Menu Toggle Button (Mobile) */}
              <button 
                  onClick={() => setIsSidebarOpen(true)} 
                  className="text-gray-700 lg:hidden p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Ouvrir le menu"
              >
                  <Menu size={24} />
              </button>
              <h2 className="text-xl md:text-3xl font-bold text-gray-800 capitalize">{activeTab.replace(/([A-Z])/g, ' $1')}</h2>
              <div className="w-10 lg:hidden"></div> {/* Espaceur pour aligner le titre au centre entre le bouton menu et un espace vide */}
            </header>
            
            <main className="pb-10">
              {renderTabContent()}
            </main>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-in mx-4" onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 z-10 text-gray-700" aria-label="Fermer"><X size={24} /></button>
            <div className="p-8">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}

      {/* Styles for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
        
        /* Styles pour gérer la sidebar sur les petits écrans quand elle est ouverte */
        @media (max-width: 1023px) { /* lg breakpoint */
            .w-64.bg-white.fixed {
                width: 100%; 
                max-width: 320px; 
            }
            .lg\\:ml-64 { margin-left: 0; } 
        }
      `}</style>
      
      {/* Tailwind Custom Colors (Charte graphique officielle E-TRAVEL WORLD AGENCY) */}
      <style jsx global>
        {`
        /* Charte graphique officielle E-TRAVEL WORLD AGENCY */
        /* Codes Hex: #1b5e8e (Primary/Bleu), #f18f13 (Secondary/Orange), #007335 (Green), #f7b406 (Warning/Jaune) */
        
        /* 1. Définition des variables CSS */
        :root { 
          --primary: #1b5e8e;
          --secondary: #f18f13;
          --green: #007335;
          --warning: #f7b406;
          --red-500: #ef4444; /* Standard Red for Deletion */
        }

        /* 2. Classes utilitaires de base (text, bg, border) */
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
        .border-primary { border-color: var(--primary); }
        .focus\\:border-primary:focus { border-color: var(--primary); }
        .focus\\:ring-primary:focus { --tw-ring-color: var(--primary); }

        
        .text-secondary { color: var(--secondary); }
        .bg-secondary { background-color: var(--secondary); }
        
        .text-green { color: var(--green); }
        .bg-green { background-color: var(--green); }
        .border-green { border-color: var(--green); }
        .text-green\\/60 { color: rgba(0, 115, 53, 0.6); }

        .text-warning { color: var(--warning); }
        .bg-warning { background-color: var(--warning); }
        .border-warning { border-color: var(--warning); }
        
        .text-primary\\/90 { color: rgba(27, 94, 142, 0.9); }

        /* 3. Classes d'opacité et de survol manquantes (utiliser rgba pour la robustesse) */
        
        /* Opacité 10% / 20% / 30% / 60% */
        .bg-primary\\/10 { background-color: rgba(27, 94, 142, 0.1); }
        .border-primary\\/20 { border-color: rgba(27, 94, 142, 0.2); }
        .shadow-primary\\/30 { --tw-shadow-color: rgba(27, 94, 142, 0.3); --tw-shadow: var(--tw-shadow-color) 0 10px 15px -3px, var(--tw-shadow-color) 0 4px 6px -4px; box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow); }
        .text-primary\\/60 { color: rgba(27, 94, 142, 0.6); }

        .bg-green\\/10 { background-color: rgba(0, 115, 53, 0.1); }
        .border-green\\/20 { border-color: rgba(0, 115, 53, 0.2); }
        
        .bg-warning\\/20 { background-color: rgba(247, 180, 6, 0.2); }
        .border-warning\\/50 { border-color: rgba(247, 180, 6, 0.5); }


        /* Survol (hover) - Opacité 90% */
        .hover\\:bg-primary\\/90:hover { background-color: rgba(27, 94, 142, 0.9) !important; }
        .hover\\:bg-secondary\\/90:hover { background-color: rgba(241, 143, 19, 0.9) !important; }
        .hover\\:bg-green\\/90:hover { background-color: rgba(0, 115, 53, 0.9) !important; }
        .hover\\:bg-warning\\/90:hover { background-color: rgba(247, 180, 6, 0.9) !important; }
        
        /* Survol (hover) - Couleur de base */
        .hover\\:text-primary:hover { color: var(--primary); }
        .hover\\:text-secondary:hover { color: var(--secondary); }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;