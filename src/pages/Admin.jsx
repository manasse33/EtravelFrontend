import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Package, MapPin, TrendingUp, DollarSign, Calendar, Settings, Home, Globe, Building, Plane, Compass, Navigation, Menu, X, Upload, Loader2, CheckCircle, AlertCircle, XCircle, Edit2, Trash2, Plus, CornerDownRight } from 'lucide-react';

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
  if (reservation.city_tour_id || (reservation.reservable && reservation.reservable.nom)) return 'City Tour';
  
  return 'Non défini';
};

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


// --- ADMIN DASHBOARD CORE COMPONENT (Updated) ---

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
  const [confirmDialog, setConfirmDialog] = useState({ show: false, title: '', message: '', onConfirm: null, onCancel: null });

  // CRUD FORMS STATE
  const defaultGrid = {
    departure_country_id: '', arrival_country_id: '',
    departure_city_id: '', arrival_city_id: '',
    min_people: 1, max_people: 10, price: '', currency: 'CFA', image: null
  };
  const defaultInclusion = { name: '', description: '' };
  const defaultAdditionalCity = { city_id: '', type: 'escale' };


  const [countryForm, setCountryForm] = useState({ name: '', code: '' });
  const [cityForm, setCityForm] = useState({ name: '', country_id: '' });
  
  // Destination: Price grid removed, simple price added.
  const [destinationForm, setDestinationForm] = useState({
    title: '', description: '', image: null, departure_country_id: '', arrival_country_id: '', price: '', currency: 'CFA'
  });
  
  // Ouikenac: Simple price/min/max removed, complex grid/inclusions/cities added.
  const [ouikenacForm, setOuikenacForm] = useState({
    title: '', description: '', image: null, programme: '', active: true,
    grids: [defaultGrid],
    inclusions: [defaultInclusion],
    additional_cities: [defaultAdditionalCity],
  });
  
  // City Tour: Programme added.
  const [cityTourForm, setCityTourForm] = useState({
    nom: '', description: '', country_id: '', city_id: '', date: '', places_min: 1, places_max: 10, price: '', programme: ''
  });

  // EDIT MODAL STATE
  const [editItem, setEditItem] = useState(null); // { type: 'destination', data: {...} }
  const [editForm, setEditForm] = useState({});
  const [imageFile, setImageFile] = useState(null); // Main image for package
  const [gridImageFiles, setGridImageFiles] = useState({}); // For Ouikenac grid images


  // --- NOTIFICATION & CONFIRMATION HELPERS ---
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
        setConfirmDialog({ show: false, title: '', message: '', onConfirm: null, onCancel: null });
      },
      onCancel: () => setConfirmDialog({ show: false, title: '', message: '', onConfirm: null, onCancel: null })
    });
  };

  // --- DATA LOADING ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [countriesRes, destinationsRes, ouikenacsRes, toursRes, reservationsRes] = await Promise.all([
        fetch(`${API_BASE}/countries`).then(r => r.ok ? r.json() : Promise.reject(new Error('Erreur pays'))),
        fetch(`${API_BASE}/destinations`).then(r => r.ok ? r.json() : Promise.reject(new Error('Erreur destinations'))),
        // Important: load relations for Ouikenac (prices/grids, inclusions, additionalCities)
        fetch(`${API_BASE}/ouikenac`).then(r => r.ok ? r.json() : Promise.reject(new Error('Erreur Ouikenac'))),
        fetch(`${API_BASE}/city-tours`).then(r => r.ok ? r.json() : Promise.reject(new Error('Erreur City Tours'))),
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

  // --- IMAGE & FILE HANDLERS ---
  // Note: This is for the main package image (destination or ouikenac)
  const handleFileChange = (e, formSetter, formData, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Le fichier est trop volumineux. Taille maximale : 5MB', 'error');
        return;
      }
      if (!file.type.startsWith('image/')) {
        showNotification('Veuillez sélectionner une image valide', 'error');
        return;
      }
      if (isEdit) {
        setImageFile(file);
      } else {
        formSetter({ ...formData, image: file });
      }
    }
  };
  
  // --- DYNAMIC PRICE FIELDS HANDLERS (for OuikenacForm Grid) ---
  const handleOuikenacGridChange = (index, field, value) => {
    const newGrids = [...ouikenacForm.grids];
    newGrids[index][field] = value;
    setOuikenacForm({ ...ouikenacForm, grids: newGrids });
  };
  
  const addOuikenacGrid = () => {
    setOuikenacForm({
      ...ouikenacForm,
      grids: [...ouikenacForm.grids, defaultGrid]
    });
  };

  const removeOuikenacGrid = (index) => {
    setOuikenacForm({
      ...ouikenacForm,
      grids: ouikenacForm.grids.filter((_, i) => i !== index)
    });
  };
  
  // Grid Image Handler (for Ouikenac - currently not fully implemented in form structure to avoid complexity)
  /*
  const handleGridImageChange = (e, index) => {
    const file = e.target.files[0];
    const newGrids = [...ouikenacForm.grids];
    newGrids[index].image = file;
    setOuikenacForm({ ...ouikenacForm, grids: newGrids });
  };
  */

  // --- DYNAMIC INCLUSIONS HANDLERS (for OuikenacForm) ---
  const handleInclusionChange = (index, field, value) => {
    const newInclusions = [...ouikenacForm.inclusions];
    newInclusions[index][field] = value;
    setOuikenacForm({ ...ouikenacForm, inclusions: newInclusions });
  };
  
  const addInclusion = () => {
    setOuikenacForm({
      ...ouikenacForm,
      inclusions: [...ouikenacForm.inclusions, defaultInclusion]
    });
  };

  const removeInclusion = (index) => {
    setOuikenacForm({
      ...ouikenacForm,
      inclusions: ouikenacForm.inclusions.filter((_, i) => i !== index)
    });
  };
  
  // --- DYNAMIC ADDITIONAL CITIES HANDLERS (for OuikenacForm) ---
  const handleAdditionalCityChange = (index, field, value) => {
    const newCities = [...ouikenacForm.additional_cities];
    newCities[index][field] = value;
    setOuikenacForm({ ...ouikenacForm, additional_cities: newCities });
  };
  
  const addAdditionalCity = () => {
    setOuikenacForm({
      ...ouikenacForm,
      additional_cities: [...ouikenacForm.additional_cities, defaultAdditionalCity]
    });
  };

  const removeAdditionalCity = (index) => {
    setOuikenacForm({
      ...ouikenacForm,
      additional_cities: ouikenacForm.additional_cities.filter((_, i) => i !== index)
    });
  };


  // --- CRUD API HANDLERS (Create, Update, Delete) ---

  // Generic POST Handler (Creation)
  const handleCreation = async (endpoint, data, successMessage, formResetter) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
        body: data instanceof FormData ? data : JSON.stringify(data)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Erreur lors de l\'enregistrement');
      }
  
      formResetter();
      await loadData();
      showNotification(successMessage, 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
    setSubmitting(false);
  };

  // 1. ADD COUNTRY (ConfigController)
  const handleAddCountry = () => {
    if (!countryForm.name || !countryForm.code) {
      showNotification('Veuillez remplir le nom et le code du pays', 'warning');
      return;
    }
    handleCreation('countries', countryForm, 'Pays ajouté avec succès', () => setCountryForm({ name: '', code: '' }));
  };

  // 2. ADD CITY (ConfigController)
  const handleAddCity = () => {
    if (!cityForm.name || !cityForm.country_id) {
      showNotification('Veuillez sélectionner un pays et entrer le nom de la ville', 'warning');
      return;
    }
    handleCreation('cities', cityForm, 'Ville ajoutée avec succès', () => setCityForm({ name: '', country_id: '' }));
  };

  // 3. ADD DESTINATION (DestinationPackageController)
  const handleAddDestination = () => {
    // UPDATED LOGIC: Simple price, no more grid
    const { title, description, image, departure_country_id, arrival_country_id, price, currency } = destinationForm;

    if (!title || !departure_country_id || !arrival_country_id || !image || !price) {
      showNotification('Veuillez remplir tous les champs obligatoires (titre, image, pays de départ et d\'arrivée, prix)', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('departure_country_id', departure_country_id);
    formData.append('arrival_country_id', arrival_country_id);
    formData.append('image', image);
    formData.append('price', price); // Simple price
    formData.append('currency', currency);
    
    handleCreation('destinations', formData, 'Destination ajoutée avec succès', () => setDestinationForm({
        title: '', description: '', image: null, departure_country_id: '', arrival_country_id: '', price: '', currency: 'CFA'
    }));
  };

  // 4. ADD OUIKENAC (OuikenacController)
  const handleAddOuikenac = () => {
    const { title, description, image, programme, active, grids, inclusions, additional_cities } = ouikenacForm;

    // Validation (check main fields and at least one valid grid)
    const validGrids = grids.filter(g => g.price && g.min_people && g.departure_country_id && g.departure_city_id);

    if (!title || !image || validGrids.length === 0) {
      showNotification('Veuillez remplir le titre, choisir une image et configurer au moins une grille tarifaire complète.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('programme', programme || ''); // New field
    formData.append('active', active ? 1 : 0);
    formData.append('image', image);

    // Append Grids (Prices)
    validGrids.forEach((grid, index) => {
        // Append all required fields for each grid item (as per Laravel validation snippet)
        formData.append(`grids[${index}][price]`, grid.price);
        formData.append(`grids[${index}][currency]`, grid.currency);
        formData.append(`grids[${index}][min_people]`, grid.min_people);
        formData.append(`grids[${index}][max_people]`, grid.max_people || grid.min_people);
        formData.append(`grids[${index}][programme]`, grid.programme || '');
        formData.append(`grids[${index}][departure_country_id]`, grid.departure_country_id);
        formData.append(`grids[${index}][arrival_country_id]`, grid.arrival_country_id || grid.departure_country_id);
        formData.append(`grids[${index}][departure_city_id]`, grid.departure_city_id);
        formData.append(`grids[${index}][arrival_city_id]`, grid.arrival_city_id || '');
        // Optional: handle grid image if implemented in the future, currently omitted for simplicity:
        // if (grid.image) { formData.append(`grids[${index}][image]`, grid.image); }
    });
    
    // Filter and append Inclusions (as JSON, assuming the backend can handle list of strings or objects)
    const validInclusions = inclusions.filter(i => i.name).map(i => ({ name: i.name, description: i.description }));
    if (validInclusions.length > 0) {
        formData.append('inclusions', JSON.stringify(validInclusions));
    }

    // Filter and append Additional Cities (as JSON)
    const validAdditionalCities = additional_cities.filter(c => c.city_id);
    if (validAdditionalCities.length > 0) {
        formData.append('additional_cities', JSON.stringify(validAdditionalCities));
    }

    // Reset Form
    const resetForm = () => setOuikenacForm({
        title: '', description: '', image: null, programme: '', active: true,
        grids: [defaultGrid],
        inclusions: [defaultInclusion],
        additional_cities: [defaultAdditionalCity],
    });

    handleCreation('ouikenac', formData, 'Package Ouikenac ajouté avec succès', resetForm);
  };

  // 5. ADD CITY TOUR (CityTourController)
  const handleAddCityTour = () => {
    // UPDATED LOGIC: Programme added
    const { nom, description, country_id, city_id, date, places_min, places_max, price, programme } = cityTourForm;

    if (!nom || !country_id || !city_id || !date || !price) {
      showNotification('Veuillez remplir tous les champs obligatoires pour le City Tour', 'warning');
      return;
    }
    
    // CityTourController expects 'nom', 'date', 'programme', etc.
    const data = {
        nom, description, country_id, city_id, date, places_min, places_max, price, programme: programme, currency: 'CFA' 
    };

    handleCreation('city-tours', data, 'City Tour ajouté avec succès', () => setCityTourForm({
        nom: '', description: '', country_id: '', city_id: '', date: '', places_min: 1, places_max: 10, price: '', programme: ''
    }));
  };

  // Generic DELETE Handler (Unchanged)
  const handleDeleteItem = async (type, id) => {
    showConfirmDialog(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
      async () => {
        setSubmitting(true);
        try {
          const endpoint = type === 'city-tours' ? 'city-tours' : 
                           type === 'countries' ? 'countries' : 
                           type === 'cities' ? 'cities' : 
                           type; 
          const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
            method: 'DELETE'
          });
          
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

  // Generic UPDATE Handler (PATCH/PUT) - Unchanged
  const handleUpdateItem = async (type, id, data) => {
    setSubmitting(true);
    try {
        const isFormData = data instanceof FormData;
        
        if (isFormData) {
          data.append('_method', 'PATCH');
        }
        
        const response = await fetch(`${API_BASE}/${type}/${id}`, {
            method: 'POST', // Use POST for FormData with method override
            headers: isFormData ? {} : { 'Content-Type': 'application/json' },
            body: isFormData ? data : JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.message || `Erreur lors de la mise à jour du ${type}`);
        }
        
        setEditItem(null); // Close modal
        setEditForm({});
        setImageFile(null);
        setGridImageFiles({});
        await loadData();
        showNotification(`${type} mis à jour avec succès`, 'success');

    } catch (error) {
        showNotification(error.message, 'error');
    }
    setSubmitting(false);
  };
  
  // Specific Update Functions
  const handleUpdateDestination = () => {
    // UPDATED LOGIC: Simple price
    const { id, title, description, departure_country_id, arrival_country_id, price, currency } = editForm;

    if (!title || !departure_country_id || !arrival_country_id || !price) {
        showNotification('Veuillez remplir tous les champs obligatoires (titre, pays de départ et d\'arrivée, prix)', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('departure_country_id', departure_country_id);
    formData.append('arrival_country_id', arrival_country_id);
    formData.append('price', price); // Simple price
    formData.append('currency', currency);

    if (imageFile) {
        formData.append('image', imageFile);
    }

    handleUpdateItem('destinations', id, formData);
  };

  const handleUpdateOuikenac = () => {
    // UPDATED LOGIC: Complex structure (grids, inclusions, additional_cities, programme)
    const { id, title, description, programme, active, grids, inclusions, additional_cities } = editForm;

    // Validation (check main fields and at least one grid)
    const validGrids = grids.filter(g => g.price && g.min_people && g.departure_country_id && g.departure_city_id);
    if (!title || validGrids.length === 0) {
        showNotification('Veuillez remplir le titre et configurer au moins une grille tarifaire complète.', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('programme', programme || '');
    formData.append('active', active ? 1 : 0);

    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    // Append Grids (Prices)
    validGrids.forEach((grid, index) => {
        // If the grid has an 'id', it's an existing one to update/keep
        if (grid.id) {
             formData.append(`grids[${index}][id]`, grid.id);
        }
        // Append all required fields for each grid item
        formData.append(`grids[${index}][price]`, grid.price);
        formData.append(`grids[${index}][currency]`, grid.currency);
        formData.append(`grids[${index}][min_people]`, grid.min_people);
        formData.append(`grids[${index}][max_people]`, grid.max_people || grid.min_people);
        formData.append(`grids[${index}][programme]`, grid.programme || '');
        formData.append(`grids[${index}][departure_country_id]`, grid.departure_country_id);
        formData.append(`grids[${index}][arrival_country_id]`, grid.arrival_country_id || grid.departure_country_id);
        formData.append(`grids[${index}][departure_city_id]`, grid.departure_city_id);
        formData.append(`grids[${index}][arrival_city_id]`, grid.arrival_city_id || '');
        
        // Handle grid image file if present in the state (gridImageFiles)
        /* if (gridImageFiles[grid.id || `new-${index}`]) {
             formData.append(`grids[${index}][image]`, gridImageFiles[grid.id || `new-${index}`]);
        } */
    });

    // Filter and append Inclusions (as JSON)
    const validInclusions = inclusions.filter(i => i.name).map(i => ({ name: i.name, description: i.description, id: i.id || null }));
    if (validInclusions.length > 0) {
        formData.append('inclusions', JSON.stringify(validInclusions));
    }

    // Filter and append Additional Cities (as JSON)
    const validAdditionalCities = additional_cities.filter(c => c.city_id).map(c => ({ city_id: c.city_id, type: c.type }));
    if (validAdditionalCities.length > 0) {
        formData.append('additional_cities', JSON.stringify(validAdditionalCities));
    }

    handleUpdateItem('ouikenac', id, formData);
  };
  
  const handleUpdateCityTour = () => {
    // UPDATED LOGIC: Programme added
    const { id, nom, description, country_id, city_id, date, places_min, places_max, price, programme } = editForm;
    
    if (!nom || !country_id || !city_id || !date || !price) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'warning');
        return;
    }
    
    const updateData = {
        nom, description, country_id, city_id, date, 
        places_min, places_max, price, programme,
        currency: 'CFA' 
    };

    handleUpdateItem('city-tours', id, updateData);
  };
  
  const handleUpdateCountry = () => {
      const { id, name, code } = editForm;
      if (!name || !code) {
          showNotification('Veuillez remplir tous les champs obligatoires', 'warning');
          return;
      }
      handleUpdateItem('countries', id, { name, code });
  };
  
  const handleUpdateCity = () => {
      const { id, name, country_id } = editForm;
      if (!name || !country_id) {
          showNotification('Veuillez remplir tous les champs obligatoires', 'warning');
          return;
      }
      handleUpdateItem('cities', id, { name, country_id });
  };
  
  // Update Reservation Status (Reservation Management) - Unchanged
  const handleUpdateReservationStatus = async (id, status) => {
    showConfirmDialog(
      `Confirmer le changement de statut`,
      `Êtes-vous sûr de vouloir changer le statut de la réservation ${id} à "${status.toUpperCase()}" ?`,
      async () => {
        setSubmitting(true);
        try {
          const response = await fetch(`${API_BASE}/reservations/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erreur lors de la mise à jour du statut`);
          }
          await loadData();
          showNotification(`Statut de la réservation ${id} mis à jour à ${status.toUpperCase()}`, 'success');
        } catch (error) {
          showNotification(error.message, 'error');
        }
        setSubmitting(false);
      },
      status === 'cancelled' ? 'danger' : 'info'
    );
  };

  // Function to open edit modal (Initialize form state)
  const openEditModal = (type, item) => {
      setEditItem({ type, data: item });
      setImageFile(null); 
      
      let initialForm = { ...item };
      if (type === 'destination') {
          // Flatten price for destination (assuming one price field is used in DB if `prices` is not an array)
          initialForm.price = item.prices && item.prices.length > 0 ? item.prices[0].price : item.price || '';
          initialForm.currency = item.prices && item.prices.length > 0 ? item.prices[0].currency : item.currency || 'CFA';
      }
      if (type === 'ouikenac') {
          // Deep copy of nested arrays for Ouikenac
          initialForm.grids = item.prices ? item.prices.map(p => ({ 
              ...p, 
              // Ensure fields expected by the form are present
              departure_country_id: p.departure_country_id || '',
              arrival_country_id: p.arrival_country_id || '',
              departure_city_id: p.departure_city_id || '',
              arrival_city_id: p.arrival_city_id || '',
              currency: p.currency || 'CFA',
              programme: p.programme || '',
          })) : [defaultGrid];
          
          initialForm.inclusions = item.inclusions ? item.inclusions.map(i => ({ name: i.name, description: i.description, id: i.id })) : [defaultInclusion];
          
          initialForm.additional_cities = item.additional_cities ? item.additional_cities.map(c => ({ city_id: c.id, type: c.pivot.type })) : [defaultAdditionalCity];
          
          initialForm.programme = item.programme || '';
      }
      if (type === 'citytour') {
           initialForm.programme = item.programme || '';
      }
      
      setEditForm(initialForm);
  };
  
  
  // --- STATS CALCULATION (useMemo for efficiency) ---
  const reservationStats = useMemo(() => {
    const stats = {
        destination: 0,
        ouikenac: 0,
        cityTour: 0,
        totalReservations: reservations.length,
        totalRevenue: reservations
          .filter(r => r.status === 'confirmed' || r.status === 'paid')
          .reduce((sum, r) => sum + (r.price || 0), 0)
    };

    reservations.forEach(r => {
        const type = getReservationType(r);
        if (type === 'Destination') stats.destination++;
        if (type === 'Ouikenac') stats.ouikenac++;
        if (type === 'City Tour') stats.cityTour++;
    });

    return stats;
  }, [reservations]);

  const reservationTypeData = [
    { name: 'Destinations', value: reservationStats.destination, color: '#1b5e8e' },
    { name: 'Ouikenac', value: reservationStats.ouikenac, color: '#f18f13' },
    { name: 'City Tours', value: reservationStats.cityTour, color: '#40bcd5' },
  ].filter(d => d.value > 0);

  const stats = useMemo(() => ({
    totalReservations: reservations.length,
    totalRevenue: reservationStats.totalRevenue,
    pendingReservations: reservations.filter(r => r.status === 'pending').length,
    totalPackages: destinations.length + ouikenacs.length + cityTours.length
  }), [reservations, destinations, ouikenacs, cityTours, reservationStats]);


  // --- ADMIN DASHBOARD RENDER ---

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
      {/* Notification, Confirm Dialog, Loading Overlay */}
      <Notification show={notification.show} message={notification.message} type={notification.type} onClose={() => setNotification({ show: false, message: '', type: '' })} />
      <ConfirmDialog show={confirmDialog.show} title={confirmDialog.title} message={confirmDialog.message} type={confirmDialog.type} onConfirm={confirmDialog.onConfirm} onCancel={confirmDialog.onCancel} />
      {submitting && <LoadingOverlay message="Traitement en cours..." />}


      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-white w-64 z-40 lg:relative lg:translate-x-0 lg:shadow-xl shadow-lg border-r`}>
          <div className="p-6">
            <h1 className="text-2xl font-black text-gray-800" style={{ color: '#1b5e8e' }}>eTravel Admin</h1>
          </div>
          <nav className="mt-6">
            {menuItems.map(item => (
              <a 
                key={item.id}
                href="#"
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-6 py-3 transition-all ${activeTab === item.id ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <item.icon size={20} />
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-6 lg:mb-8">
            <button className="lg:hidden p-2 text-gray-600 hover:text-gray-800" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} />
            </button>
            <h2 className="text-3xl font-bold text-gray-800 capitalize">
              {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </header>

          {/* Tab Content */}
          <div className="content">
            {loading && activeTab !== 'dashboard' ? (
                <LoadingOverlay message="Chargement des données..." />
            ) : (
                <>
                {/* --- DASHBOARD TAB (Enhanced with Stats) --- */}
                {activeTab === 'dashboard' && (
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Aperçu Général</h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                            {/* Total Reservations */}
                            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4 transform hover:scale-[1.02] transition-transform" style={{ borderLeftColor: '#1b5e8e' }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-xs sm:text-sm">Réservations Totales</p>
                                        <p className="text-2xl sm:text-3xl font-bold mt-2">{stats.totalReservations}</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 sm:p-4 rounded-lg">
                                        <Calendar size={20} className="sm:w-6 sm:h-6" style={{ color: '#1b5e8e' }} />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Total Revenue */}
                            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4 transform hover:scale-[1.02] transition-transform" style={{ borderLeftColor: '#3fa535' }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-xs sm:text-sm">Revenus Confirmés</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-2">{stats.totalRevenue.toLocaleString()} FCFA</p>
                                    </div>
                                    <div className="bg-green-100 p-3 sm:p-4 rounded-lg">
                                        <DollarSign size={20} className="sm:w-6 sm:h-6" style={{ color: '#3fa535' }} />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Pending Reservations */}
                            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4 transform hover:scale-[1.02] transition-transform" style={{ borderLeftColor: '#f18f13' }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-xs sm:text-sm">Réservations en attente</p>
                                        <p className="text-2xl sm:text-3xl font-bold mt-2">{stats.pendingReservations}</p>
                                    </div>
                                    <div className="bg-yellow-100 p-3 sm:p-4 rounded-lg">
                                        <AlertCircle size={20} className="sm:w-6 sm:h-6" style={{ color: '#f18f13' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Total Packages */}
                            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4 transform hover:scale-[1.02] transition-transform" style={{ borderLeftColor: '#cd1422' }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-xs sm:text-sm">Packages/Tours actifs</p>
                                        <p className="text-2xl sm:text-3xl font-bold mt-2">{stats.totalPackages}</p>
                                    </div>
                                    <div className="bg-red-100 p-3 sm:p-4 rounded-lg">
                                        <Package size={20} className="sm:w-6 sm:h-6" style={{ color: '#cd1422' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reservation Stats Chart (New Requirement) */}
                        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md mb-6 sm:mb-8">
                            <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1b5e8e' }}>
                                <TrendingUp size={20} /> Répartition des Réservations par Type
                            </h3>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={reservationTypeData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {reservationTypeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value} réservations`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* --- CONFIGURATION TAB (Complete CRUD for Country/City) --- */}
                {activeTab === 'config' && (
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Configuration (Pays & Villes)</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            
                            {/* Add Country Section */}
                            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
                                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1b5e8e' }}>
                                    <Globe size={20} className="sm:w-6 sm:h-6" /> Ajouter un pays
                                </h3>
                                <div className="space-y-4">
                                    <input type="text" placeholder="Nom du pays" value={countryForm.name} onChange={e => setCountryForm({ ...countryForm, name: e.target.value })} className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base" />
                                    <input type="text" placeholder="Code (ex: CG, FR)" value={countryForm.code} onChange={e => setCountryForm({ ...countryForm, code: e.target.value.toUpperCase() })} className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base" />
                                    <button onClick={handleAddCountry} disabled={submitting} className="w-full text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base disabled:opacity-50" style={{ backgroundColor: '#1b5e8e' }}>
                                        <Plus size={18} className="inline-block mr-2" /> {submitting ? 'Envoi...' : 'Ajouter le pays'}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Add City Section */}
                            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
                                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1b5e8e' }}>
                                    <Building size={20} className="sm:w-6 sm:h-6" /> Ajouter une ville
                                </h3>
                                <div className="space-y-4">
                                    <select value={cityForm.country_id} onChange={e => setCityForm({ ...cityForm, country_id: e.target.value })} className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" required>
                                        <option value="">Sélectionnez le pays *</option>
                                        {countries.map(country => (
                                            <option key={country.id} value={country.id}>{country.name}</option>
                                        ))}
                                    </select>
                                    <input type="text" placeholder="Nom de la ville" value={cityForm.name} onChange={e => setCityForm({ ...cityForm, name: e.target.value })} className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base" />
                                    <button onClick={handleAddCity} disabled={submitting} className="w-full text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base disabled:opacity-50" style={{ backgroundColor: '#1b5e8e' }}>
                                        <Plus size={18} className="inline-block mr-2" /> {submitting ? 'Envoi...' : 'Ajouter la ville'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* List Countries & Cities */}
                        <div className="mt-8 bg-white rounded-xl p-4 sm:p-6 shadow-md">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Liste des Pays et Villes</h3>
                            <div className="space-y-6">
                                {countries.map(country => (
                                    <div key={country.id} className="border-b pb-4 last:border-b-0">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-lg text-gray-700">{country.name} ({country.code}) - {country.cities?.length || 0} villes</h4>
                                            <div className="flex gap-2">
                                                <button onClick={() => openEditModal('country', country)} className="text-blue-500 hover:text-blue-700 p-1 rounded transition"><Edit2 size={18} /></button>
                                                <button onClick={() => handleDeleteItem('countries', country.id)} disabled={submitting} className="text-red-500 hover:text-red-700 p-1 rounded transition disabled:opacity-50"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pl-4">
                                            {country.cities && country.cities.map(city => (
                                                <span key={city.id} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                                                    {city.name}
                                                    <button onClick={() => openEditModal('city', city)} className="text-blue-500 hover:text-blue-700 ml-1"><Edit2 size={12} /></button>
                                                    <button onClick={() => handleDeleteItem('cities', city.id)} disabled={submitting} className="text-red-500 hover:text-red-700 ml-1 disabled:opacity-50"><X size={12} /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}


                {/* --- DESTINATIONS TAB (Creation, Update, Delete) - UPDATED --- */}
                {activeTab === 'destinations' && (
                    <div>
                        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md mb-6 sm:mb-8">
                            <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#1b5e8e' }}>Ajouter une destination</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Titre *" value={destinationForm.title} onChange={e => setDestinationForm({ ...destinationForm, title: e.target.value })} className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" required />
                                    <div className="relative">
                                        <input type="file" accept="image/*" onChange={e => handleFileChange(e, setDestinationForm, destinationForm)} className="hidden" id="dest-image" />
                                        <label htmlFor="dest-image" className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm sm:text-base" >
                                            <Upload size={18} /> <span className="text-gray-600 truncate">{destinationForm.image ? destinationForm.image.name : 'Choisir une image *'}</span>
                                        </label>
                                    </div>
                                    <select value={destinationForm.departure_country_id} onChange={e => setDestinationForm({ ...destinationForm, departure_country_id: e.target.value })} className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" required>
                                        <option value="">Pays de départ *</option>
                                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <select value={destinationForm.arrival_country_id} onChange={e => setDestinationForm({ ...destinationForm, arrival_country_id: e.target.value })} className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" required>
                                        <option value="">Pays d'arrivée *</option>
                                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    
                                    {/* Simple Price Field (Replaced Dynamic Grid) */}
                                    <input type="number" placeholder="Prix (FCFA) *" value={destinationForm.price} onChange={e => setDestinationForm({ ...destinationForm, price: e.target.value })} className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" required />
                                    <select value={destinationForm.currency} onChange={e => setDestinationForm({ ...destinationForm, currency: e.target.value })} className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" required>
                                        <option value="CFA">CFA</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                    
                                </div>
                                
                                <textarea placeholder="Description" value={destinationForm.description} onChange={e => setDestinationForm({ ...destinationForm, description: e.target.value })} className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" rows="3" />
                                
                                <button onClick={handleAddDestination} disabled={submitting} className="w-full text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base disabled:opacity-50" style={{ backgroundColor: '#1b5e8e' }}>
                                    <Plus size={18} className="inline-block mr-2" /> {submitting ? 'Envoi...' : 'Ajouter la destination'}
                                </button>
                            </div>
                        </div>


                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Liste des Destinations ({destinations.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {destinations.map(dest => (
                                <div key={dest.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:shadow-xl transition-shadow duration-300">
                                    <img src={dest.image_url || '/placeholder.jpg'} alt={dest.title} className="w-full h-40 object-cover" />
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h4 className="font-bold text-base sm:text-lg mb-2 text-gray-800">{dest.title}</h4>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{dest.description}</p>
                                        
                                        {/* Pricing Info (Updated to show simple price/first price from prices relation if exists) */}
                                        <div className="mb-3 border-t pt-2 mt-auto">
                                            <p className="text-xs font-semibold text-gray-700 mb-1">Prix de base:</p>
                                            <div className="flex justify-between text-xs text-gray-600">
                                                <span>{dest.departure_country?.code || 'N/A'} - {dest.arrival_country?.code || 'N/A'}</span>
                                                <span className="font-bold" style={{ color: '#1b5e8e' }}>
                                                    {dest.price || (dest.prices && dest.prices[0] ? dest.prices[0].price : 'N/A')} {dest.currency || (dest.prices && dest.prices[0] ? dest.prices[0].currency : 'FCFA')}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => openEditModal('destination', dest)} className="flex-1 text-white py-2 rounded-lg text-xs sm:text-sm hover:opacity-90" style={{ backgroundColor: '#1b5e8e' }}>
                                                Modifier
                                            </button>
                                            <button onClick={() => handleDeleteItem('destinations', dest.id)} disabled={submitting} className="flex-1 text-white py-2 rounded-lg text-xs sm:text-sm hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: '#cd1422' }} >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* --- OUIKENAC TAB (Creation, Update, Delete) - UPDATED --- */}
                {activeTab === 'ouikenac' && (
                    <div>
                        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md mb-6 sm:mb-8">
                            <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#f18f13' }}>Ajouter un package Ouikenac</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Titre *" value={ouikenacForm.title} onChange={e => setOuikenacForm({ ...ouikenacForm, title: e.target.value })} className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base" required />
                                    <div className="relative">
                                        <input type="file" accept="image/*" onChange={e => handleFileChange(e, setOuikenacForm, ouikenacForm)} className="hidden" id="ouikenac-image" />
                                        <label htmlFor="ouikenac-image" className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm sm:text-base" >
                                            <Upload size={18} /> <span className="text-gray-600 truncate">{ouikenacForm.image ? ouikenacForm.image.name : 'Choisir une image *'}</span>
                                        </label>
                                    </div>
                                </div>

                                <textarea placeholder="Description" value={ouikenacForm.description} onChange={e => setOuikenacForm({ ...ouikenacForm, description: e.target.value })} className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base" rows="3" />
                                <textarea placeholder="Programme détaillé" value={ouikenacForm.programme} onChange={e => setOuikenacForm({ ...ouikenacForm, programme: e.target.value })} className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base" rows="3" />

                                {/* Dynamic Grids (Prices) */}
                                <h4 className="font-semibold mt-4 mb-2 flex items-center gap-2">
                                    <DollarSign size={18} /> Grille tarifaire & Villes de base (Variants) *
                                </h4>
                                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                                    {ouikenacForm.grids.map((grid, index) => (
                                        <div key={index} className="p-3 border rounded-lg bg-white relative">
                                            <h5 className="font-medium text-sm mb-2 text-orange-600">Option {index + 1}</h5>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                                <input type="number" placeholder="Prix (FCFA) *" value={grid.price} onChange={e => handleOuikenacGridChange(index, 'price', e.target.value)} className="px-3 py-2 border rounded-lg text-sm" required />
                                                <div className="flex gap-2">
                                                    <input type="number" placeholder="Min pers. *" value={grid.min_people} onChange={e => handleOuikenacGridChange(index, 'min_people', e.target.value)} className="w-1/2 px-3 py-2 border rounded-lg text-sm" required />
                                                    <input type="number" placeholder="Max pers." value={grid.max_people} onChange={e => handleOuikenacGridChange(index, 'max_people', e.target.value)} className="w-1/2 px-3 py-2 border rounded-lg text-sm" />
                                                </div>
                                                
                                                <select value={grid.departure_country_id} onChange={e => handleOuikenacGridChange(index, 'departure_country_id', e.target.value)} className="px-3 py-2 border rounded-lg text-sm" required>
                                                    <option value="">Pays Départ *</option>
                                                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                                <select value={grid.departure_city_id} onChange={e => handleOuikenacGridChange(index, 'departure_city_id', e.target.value)} className="px-3 py-2 border rounded-lg text-sm" required>
                                                    <option value="">Ville Départ *</option>
                                                    {cities.filter(c => c.country_id == grid.departure_country_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>

                                                <select value={grid.arrival_country_id} onChange={e => handleOuikenacGridChange(index, 'arrival_country_id', e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                                                    <option value="">Pays Arrivée</option>
                                                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                                <select value={grid.arrival_city_id} onChange={e => handleOuikenacGridChange(index, 'arrival_city_id', e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                                                    <option value="">Ville Arrivée</option>
                                                    {cities.filter(c => c.country_id == grid.arrival_country_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                            <textarea placeholder="Programme spécifique à cette option" value={grid.programme} onChange={e => handleOuikenacGridChange(index, 'programme', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" rows="1" />
                                            {ouikenacForm.grids.length > 1 && (
                                                <button onClick={() => removeOuikenacGrid(index)} type="button" className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"><X size={18} /></button>
                                            )}
                                        </div>
                                    ))}
                                    <button onClick={addOuikenacGrid} type="button" className="text-orange-500 hover:text-orange-700 text-sm font-semibold flex items-center gap-1"><Plus size={16} /> Ajouter une option/grille</button>
                                </div>
                                
                                {/* Dynamic Inclusions */}
                                <h4 className="font-semibold mt-4 mb-2 flex items-center gap-2">
                                    <CheckCircle size={18} /> Inclusions
                                </h4>
                                <div className="space-y-3 border p-4 rounded-lg bg-gray-50">
                                    {ouikenacForm.inclusions.map((inclusion, index) => (
                                        <div key={index} className="flex gap-2 items-start">
                                            <input type="text" placeholder="Nom de l'inclusion *" value={inclusion.name} onChange={e => handleInclusionChange(index, 'name', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                                            <input type="text" placeholder="Description (optionnel)" value={inclusion.description} onChange={e => handleInclusionChange(index, 'description', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                                            <button onClick={() => removeInclusion(index)} type="button" className="text-red-500 hover:text-red-700 p-1 mt-1"><X size={18} /></button>
                                        </div>
                                    ))}
                                    <button onClick={addInclusion} type="button" className="text-orange-500 hover:text-orange-700 text-sm font-semibold flex items-center gap-1"><Plus size={16} /> Ajouter une inclusion</button>
                                </div>
                                
                                {/* Dynamic Additional Cities */}
                                <h4 className="font-semibold mt-4 mb-2 flex items-center gap-2">
                                    <MapPin size={18} /> Villes additionnelles / Escales
                                </h4>
                                <div className="space-y-3 border p-4 rounded-lg bg-gray-50">
                                    {ouikenacForm.additional_cities.map((city, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <select value={city.city_id} onChange={e => handleAdditionalCityChange(index, 'city_id', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm">
                                                <option value="">Sélectionnez une ville</option>
                                                {cities.map(c => <option key={c.id} value={c.id}>{c.name} ({countries.find(co => co.id === c.country_id)?.code})</option>)}
                                            </select>
                                            <select value={city.type} onChange={e => handleAdditionalCityChange(index, 'type', e.target.value)} className="w-1/3 px-3 py-2 border rounded-lg text-sm">
                                                <option value="escale">Escale</option>
                                                <option value="destination">Destination</option>
                                                <option value="other">Autre</option>
                                            </select>
                                            <button onClick={() => removeAdditionalCity(index)} type="button" className="text-red-500 hover:text-red-700 p-1"><X size={18} /></button>
                                        </div>
                                    ))}
                                    <button onClick={addAdditionalCity} type="button" className="text-orange-500 hover:text-orange-700 text-sm font-semibold flex items-center gap-1"><Plus size={16} /> Ajouter une ville</button>
                                </div>


                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="ouikenac-active" checked={ouikenacForm.active} onChange={e => setOuikenacForm({ ...ouikenacForm, active: e.target.checked })} className="h-4 w-4 text-orange-600 border-gray-300 rounded" />
                                    <label htmlFor="ouikenac-active" className="text-sm font-medium text-gray-700">Actif</label>
                                </div>
                                
                                <button onClick={handleAddOuikenac} disabled={submitting} className="w-full text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base disabled:opacity-50" style={{ backgroundColor: '#f18f13' }}>
                                    <Plus size={18} className="inline-block mr-2" /> {submitting ? 'Envoi...' : 'Ajouter le Package Ouikenac'}
                                </button>
                            </div>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Liste des Packages Ouikenac ({ouikenacs.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {ouikenacs.map(pkg => (
                                <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:shadow-xl transition-shadow duration-300">
                                    <img src={pkg.image_url || '/placeholder.jpg'} alt={pkg.title} className="w-full h-40 object-cover" />
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h4 className="font-bold text-base sm:text-lg mb-2 text-gray-800">{pkg.title}</h4>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{pkg.description}</p>
                                        
                                        <div className="mb-3 border-t pt-2 mt-auto">
                                            <p className="text-xs font-semibold text-gray-700 mb-1">Détails (Option 1):</p>
                                            {pkg.prices && pkg.prices.length > 0 && (
                                                <>
                                                    <div className="flex justify-between text-xs text-gray-600">
                                                        <span>Prix:</span>
                                                        <span className="font-bold" style={{ color: '#f18f13' }}>{pkg.prices[0].price} {pkg.prices[0].currency}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs text-gray-600">
                                                        <span>Personnes:</span>
                                                        <span>{pkg.prices[0].min_people}-{pkg.prices[0].max_people}</span>
                                                    </div>
                                                </>
                                            )}
                                            
                                        </div>
                                        
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => openEditModal('ouikenac', pkg)} className="flex-1 text-white py-2 rounded-lg text-xs sm:text-sm hover:opacity-90" style={{ backgroundColor: '#f18f13' }}>
                                                Modifier
                                            </button>
                                            <button onClick={() => handleDeleteItem('ouikenac', pkg.id)} disabled={submitting} className="flex-1 text-white py-2 rounded-lg text-xs sm:text-sm hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: '#cd1422' }} >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* --- CITY TOUR TAB (Creation, Update, Delete) - UPDATED --- */}
                {activeTab === 'citytour' && (
                    <div>
                        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md mb-6 sm:mb-8">
                            <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#40bcd5' }}>Ajouter un City Tour</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Nom du Tour *" value={cityTourForm.nom} onChange={e => setCityTourForm({ ...cityTourForm, nom: e.target.value })} className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base" required />
                                <input type="number" placeholder="Prix (FCFA) *" value={cityTourForm.price} onChange={e => setCityTourForm({ ...cityTourForm, price: e.target.value })} className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base" required />
                                
                                <select value={cityTourForm.country_id} onChange={e => { setCityTourForm({ ...cityTourForm, country_id: e.target.value, city_id: '' }) }} className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base" required>
                                    <option value="">Sélectionnez le pays *</option>
                                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <select value={cityTourForm.city_id} onChange={e => setCityTourForm({ ...cityTourForm, city_id: e.target.value })} className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base" required disabled={!cityTourForm.country_id}>
                                    <option value="">Sélectionnez la ville *</option>
                                    {cities.filter(c => c.country_id === cityTourForm.country_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                
                                <input type="date" placeholder="Date de début *" value={cityTourForm.date} onChange={e => setCityTourForm({ ...cityTourForm, date: e.target.value })} className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base" required />
                                <div className="flex gap-2 sm:gap-4">
                                    <input type="number" placeholder="Min personnes *" value={cityTourForm.places_min} onChange={e => setCityTourForm({ ...cityTourForm, places_min: e.target.value })} className="w-1/2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base" />
                                    <input type="number" placeholder="Max personnes *" value={cityTourForm.places_max} onChange={e => setCityTourForm({ ...cityTourForm, places_max: e.target.value })} className="w-1/2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base" />
                                </div>
                                
                                <textarea placeholder="Description" value={cityTourForm.description} onChange={e => setCityTourForm({ ...cityTourForm, description: e.target.value })} className="col-span-1 md:col-span-2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base" rows="3" />
                                <textarea placeholder="Programme détaillé" value={cityTourForm.programme} onChange={e => setCityTourForm({ ...cityTourForm, programme: e.target.value })} className="col-span-1 md:col-span-2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base" rows="3" />
                                
                                <button onClick={handleAddCityTour} disabled={submitting} className="col-span-1 md:col-span-2 text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base disabled:opacity-50" style={{ backgroundColor: '#40bcd5' }}>
                                    <Plus size={18} className="inline-block mr-2" /> {submitting ? 'Envoi...' : 'Ajouter le City Tour'}
                                </button>
                            </div>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Liste des City Tours ({cityTours.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {cityTours.map(tour => (
                                <div key={tour.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:shadow-xl transition-shadow duration-300">
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h4 className="font-bold text-base sm:text-lg mb-2 text-gray-800">{tour.nom}</h4>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{tour.description}</p>
                                        
                                        <div className="mb-3 border-t pt-2 mt-auto">
                                            <p className="text-xs font-semibold text-gray-700 mb-1">Détails:</p>
                                            <div className="flex justify-between text-xs text-gray-600">
                                                <span>Lieu:</span>
                                                <span className="font-bold">{tour.city?.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-600">
                                                <span>Date:</span>
                                                <span className="font-bold">{new Date(tour.scheduled_date || tour.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-600">
                                                <span>Prix:</span>
                                                <span className="font-bold" style={{ color: '#40bcd5' }}>{tour.price} FCFA</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => openEditModal('citytour', tour)} className="flex-1 text-white py-2 rounded-lg text-xs sm:text-sm hover:opacity-90" style={{ backgroundColor: '#40bcd5' }}>
                                                Modifier
                                            </button>
                                            <button onClick={() => handleDeleteItem('city-tours', tour.id)} disabled={submitting} className="flex-1 text-white py-2 rounded-lg text-xs sm:text-sm hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: '#cd1422' }} >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* --- RESERVATIONS TAB (Update status, Vue/Details, Type) --- */}
                {activeTab === 'reservations' && (
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Gestion des Réservations</h2>
                        
                        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type de Package</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reservations.map(res => {
                                        const type = getReservationType(res);
                                        const statusColor = res.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                            res.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                                                            res.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800';

                                        return (
                                            <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">{res.id}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">{res.user_name || 'N/A'}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                    <div className="text-xs sm:text-sm">{res.email}</div>
                                                    <div className="text-xs text-gray-500">{res.phone}</div>
                                                </td>
                                                
                                                {/* Package Type Display */}
                                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                    <div className="text-xs sm:text-sm font-semibold" style={{ color: 
                                                        type === 'Destination' ? '#1b5e8e' : 
                                                        type === 'Ouikenac' ? '#f18f13' : 
                                                        type === 'City Tour' ? '#40bcd5' : '#777'
                                                    }}>
                                                        {type}
                                                    </div>
                                                    {res.reservable && (
                                                        <div className="text-xs text-gray-500 line-clamp-1">
                                                            {res.reservable.title || res.reservable.nom || `ID: ${res.reservable_id}`}
                                                        </div>
                                                    )}
                                                </td>
                                                
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                                                    <div>Prix: <span className="font-semibold">{res.price || 'N/A'}</span> FCFA</div>
                                                    {res.departure_date && <div>Départ: {new Date(res.departure_date).toLocaleDateString()}</div>}
                                                </td>
                                                
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                                                        {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                                                    </span>
                                                </td>
                                                
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {res.status === 'pending' && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')}
                                                                disabled={submitting}
                                                                className="text-white py-2 px-3 rounded-lg text-xs hover:opacity-90 whitespace-nowrap disabled:opacity-50"
                                                                style={{ backgroundColor: '#3fa535' }}
                                                            >
                                                                Confirmer
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')}
                                                                disabled={submitting}
                                                                className="text-white py-2 px-3 rounded-lg text-xs hover:opacity-90 whitespace-nowrap disabled:opacity-50"
                                                                style={{ backgroundColor: '#cd1422' }}
                                                            >
                                                                Rejeter
                                                            </button>
                                                        </div>
                                                    )}
                                                    {res.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => handleUpdateReservationStatus(res.id, 'paid')}
                                                            disabled={submitting}
                                                            className="text-white py-2 px-3 rounded-lg text-xs hover:opacity-90 whitespace-nowrap disabled:opacity-50"
                                                            style={{ backgroundColor: '#1b5e8e' }}
                                                        >
                                                            Marquer Payée
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                </>
            )}
          </div>
        </main>
      </div>

      {/* --- EDIT MODAL (Reusable for all entity types) --- */}
      {editItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                  <div className="flex justify-between items-center mb-4 border-b pb-3">
                      <h3 className="text-xl font-bold text-gray-900 capitalize">Modifier {editItem.type}</h3>
                      <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                  </div>
                  
                  {/* Edit Form Content */}
                  <div className="space-y-4">
                      {/* Form: Country/City */}
                      {(editItem.type === 'country' || editItem.type === 'city') && (
                          <>
                              {editItem.type === 'country' && (
                                  <>
                                      <input type="text" placeholder="Nom du pays" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                                      <input type="text" placeholder="Code (ex: CG, FR)" value={editForm.code || ''} onChange={e => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })} className="w-full px-3 py-2 border rounded-lg" required />
                                      <button onClick={handleUpdateCountry} disabled={submitting} className="w-full text-white py-2 rounded-lg font-medium transition disabled:opacity-50" style={{ backgroundColor: '#1b5e8e' }}>{submitting ? 'Mise à jour...' : 'Enregistrer les modifications'}</button>
                                  </>
                              )}
                              {editItem.type === 'city' && (
                                  <>
                                      <select value={editForm.country_id || ''} onChange={e => setEditForm({ ...editForm, country_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
                                          <option value="">Sélectionnez le pays *</option>
                                          {countries.map(country => (<option key={country.id} value={country.id}>{country.name}</option>))}
                                      </select>
                                      <input type="text" placeholder="Nom de la ville" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                                      <button onClick={handleUpdateCity} disabled={submitting} className="w-full text-white py-2 rounded-lg font-medium transition disabled:opacity-50" style={{ backgroundColor: '#1b5e8e' }}>{submitting ? 'Mise à jour...' : 'Enregistrer les modifications'}</button>
                                  </>
                              )}
                          </>
                      )}
                      
                      {/* Form: Destination - UPDATED */}
                      {editItem.type === 'destination' && (
                          <>
                              <input type="text" placeholder="Titre *" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                              <textarea placeholder="Description" value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows="3" />
                              
                              <div className="grid grid-cols-2 gap-4">
                                  <select value={editForm.departure_country_id || ''} onChange={e => setEditForm({ ...editForm, departure_country_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
                                      <option value="">Pays de départ *</option>
                                      {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                  </select>
                                  <select value={editForm.arrival_country_id || ''} onChange={e => setEditForm({ ...editForm, arrival_country_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
                                      <option value="">Pays d'arrivée *</option>
                                      {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                  </select>
                                  
                                  {/* Simple Price Fields */}
                                  <input type="number" placeholder="Prix (FCFA) *" value={editForm.price || ''} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                                  <select value={editForm.currency || 'CFA'} onChange={e => setEditForm({ ...editForm, currency: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
                                      <option value="CFA">CFA</option>
                                      <option value="USD">USD</option>
                                      <option value="EUR">EUR</option>
                                  </select>
                              </div>
                              
                              {/* Image upload */}
                              <div className="relative">
                                  <input type="file" accept="image/*" onChange={e => handleFileChange(e, setEditForm, editForm, true)} className="hidden" id="edit-dest-image" />
                                  <label htmlFor="edit-dest-image" className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm" >
                                      <Upload size={18} /> <span className="text-gray-600 truncate">{imageFile ? imageFile.name : editForm.image_url ? 'Image actuelle' : 'Choisir une image'}</span>
                                  </label>
                              </div>

                              <button onClick={handleUpdateDestination} disabled={submitting} className="w-full text-white py-2 rounded-lg font-medium transition disabled:opacity-50" style={{ backgroundColor: '#1b5e8e' }}>{submitting ? 'Mise à jour...' : 'Enregistrer les modifications'}</button>
                          </>
                      )}

                      {/* Form: Ouikenac - UPDATED */}
                      {editItem.type === 'ouikenac' && (
                          <>
                              <input type="text" placeholder="Titre *" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                              <textarea placeholder="Description" value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows="3" />
                              <textarea placeholder="Programme détaillé" value={editForm.programme || ''} onChange={e => setEditForm({ ...editForm, programme: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows="3" />

                              <div className="relative">
                                  <input type="file" accept="image/*" onChange={e => handleFileChange(e, setEditForm, editForm, true)} className="hidden" id="edit-ouikenac-image" />
                                  <label htmlFor="edit-ouikenac-image" className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm" >
                                      <Upload size={18} /> <span className="text-gray-600 truncate">{imageFile ? imageFile.name : editForm.image_url ? 'Image actuelle' : 'Choisir une image'}</span>
                                  </label>
                              </div>
                              
                              {/* Dynamic Grids (Prices) for Edit */}
                              <h4 className="font-semibold mt-4 mb-2 flex items-center gap-2 text-orange-600">
                                  <DollarSign size={18} /> Grille tarifaire & Villes de base *
                              </h4>
                              <div className="space-y-4 border p-4 rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
                                  {editForm.grids?.map((grid, index) => (
                                      <div key={grid.id || index} className="p-3 border rounded-lg bg-white relative">
                                          <h5 className="font-medium text-sm mb-2 text-orange-600">Option {index + 1} (ID: {grid.id || 'Nouveau'})</h5>
                                          <div className="grid grid-cols-2 gap-3 mb-3">
                                              <input type="number" placeholder="Prix (FCFA) *" value={grid.price || ''} onChange={e => {
                                                  const newGrids = [...editForm.grids]; newGrids[index].price = e.target.value; setEditForm({ ...editForm, grids: newGrids });
                                              }} className="px-3 py-2 border rounded-lg text-sm" required />
                                              <select value={grid.currency || 'CFA'} onChange={e => {
                                                  const newGrids = [...editForm.grids]; newGrids[index].currency = e.target.value; setEditForm({ ...editForm, grids: newGrids });
                                              }} className="px-3 py-2 border rounded-lg text-sm" required>
                                                  <option value="CFA">CFA</option><option value="USD">USD</option><option value="EUR">EUR</option>
                                              </select>
                                              <input type="number" placeholder="Min pers. *" value={grid.min_people || 1} onChange={e => {
                                                  const newGrids = [...editForm.grids]; newGrids[index].min_people = e.target.value; setEditForm({ ...editForm, grids: newGrids });
                                              }} className="px-3 py-2 border rounded-lg text-sm" required />
                                              <input type="number" placeholder="Max pers." value={grid.max_people || 10} onChange={e => {
                                                  const newGrids = [...editForm.grids]; newGrids[index].max_people = e.target.value; setEditForm({ ...editForm, grids: newGrids });
                                              }} className="px-3 py-2 border rounded-lg text-sm" />
                                              
                                              <select value={grid.departure_country_id || ''} onChange={e => {
                                                  const newGrids = [...editForm.grids]; newGrids[index].departure_country_id = e.target.value; newGrids[index].departure_city_id = ''; setEditForm({ ...editForm, grids: newGrids });
                                              }} className="px-3 py-2 border rounded-lg text-sm" required>
                                                  <option value="">Pays Départ *</option>{countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                              </select>
                                              <select value={grid.departure_city_id || ''} onChange={e => {
                                                  const newGrids = [...editForm.grids]; newGrids[index].departure_city_id = e.target.value; setEditForm({ ...editForm, grids: newGrids });
                                              }} className="px-3 py-2 border rounded-lg text-sm" required>
                                                  <option value="">Ville Départ *</option>{cities.filter(c => c.country_id == grid.departure_country_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                              </select>

                                              <select value={grid.arrival_country_id || ''} onChange={e => {
                                                  const newGrids = [...editForm.grids]; newGrids[index].arrival_country_id = e.target.value; newGrids[index].arrival_city_id = ''; setEditForm({ ...editForm, grids: newGrids });
                                              }} className="px-3 py-2 border rounded-lg text-sm">
                                                  <option value="">Pays Arrivée</option>{countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                              </select>
                                              <select value={grid.arrival_city_id || ''} onChange={e => {
                                                  const newGrids = [...editForm.grids]; newGrids[index].arrival_city_id = e.target.value; setEditForm({ ...editForm, grids: newGrids });
                                              }} className="px-3 py-2 border rounded-lg text-sm">
                                                  <option value="">Ville Arrivée</option>{cities.filter(c => c.country_id == grid.arrival_country_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                              </select>
                                          </div>
                                          <textarea placeholder="Programme spécifique" value={grid.programme || ''} onChange={e => {
                                              const newGrids = [...editForm.grids]; newGrids[index].programme = e.target.value; setEditForm({ ...editForm, grids: newGrids });
                                          }} className="w-full px-3 py-2 border rounded-lg text-sm" rows="1" />
                                          <button onClick={() => setEditForm({ ...editForm, grids: editForm.grids.filter((_, i) => i !== index) })} type="button" className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"><X size={18} /></button>
                                      </div>
                                  ))}
                                  <button onClick={() => setEditForm({ ...editForm, grids: [...(editForm.grids || []), defaultGrid] })} type="button" className="text-orange-500 hover:text-orange-700 text-sm font-semibold flex items-center gap-1"><Plus size={16} /> Ajouter une option/grille</button>
                              </div>
                              
                              {/* Dynamic Inclusions for Edit */}
                              <h4 className="font-semibold mt-4 mb-2 flex items-center gap-2 text-orange-600">
                                  <CheckCircle size={18} /> Inclusions
                              </h4>
                              <div className="space-y-3 border p-4 rounded-lg bg-gray-50 max-h-40 overflow-y-auto">
                                  {editForm.inclusions?.map((inclusion, index) => (
                                      <div key={inclusion.id || index} className="flex gap-2 items-start">
                                          <input type="text" placeholder="Nom de l'inclusion *" value={inclusion.name || ''} onChange={e => {
                                              const newInclusions = [...editForm.inclusions]; newInclusions[index].name = e.target.value; setEditForm({ ...editForm, inclusions: newInclusions });
                                          }} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                                          <input type="text" placeholder="Description (optionnel)" value={inclusion.description || ''} onChange={e => {
                                              const newInclusions = [...editForm.inclusions]; newInclusions[index].description = e.target.value; setEditForm({ ...editForm, inclusions: newInclusions });
                                          }} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                                          <button onClick={() => setEditForm({ ...editForm, inclusions: editForm.inclusions.filter((_, i) => i !== index) })} type="button" className="text-red-500 hover:text-red-700 p-1 mt-1"><X size={18} /></button>
                                      </div>
                                  ))}
                                  <button onClick={() => setEditForm({ ...editForm, inclusions: [...(editForm.inclusions || []), defaultInclusion] })} type="button" className="text-orange-500 hover:text-orange-700 text-sm font-semibold flex items-center gap-1"><Plus size={16} /> Ajouter une inclusion</button>
                              </div>

                              {/* Dynamic Additional Cities for Edit */}
                              <h4 className="font-semibold mt-4 mb-2 flex items-center gap-2 text-orange-600">
                                  <MapPin size={18} /> Villes additionnelles / Escales
                              </h4>
                              <div className="space-y-3 border p-4 rounded-lg bg-gray-50 max-h-40 overflow-y-auto">
                                  {editForm.additional_cities?.map((city, index) => (
                                      <div key={city.city_id || index} className="flex gap-2 items-center">
                                          <select value={city.city_id || ''} onChange={e => {
                                              const newCities = [...editForm.additional_cities]; newCities[index].city_id = e.target.value; setEditForm({ ...editForm, additional_cities: newCities });
                                          }} className="flex-1 px-3 py-2 border rounded-lg text-sm">
                                              <option value="">Sélectionnez une ville</option>
                                              {cities.map(c => <option key={c.id} value={c.id}>{c.name} ({countries.find(co => co.id === c.country_id)?.code})</option>)}
                                          </select>
                                          <select value={city.type || 'escale'} onChange={e => {
                                              const newCities = [...editForm.additional_cities]; newCities[index].type = e.target.value; setEditForm({ ...editForm, additional_cities: newCities });
                                          }} className="w-1/3 px-3 py-2 border rounded-lg text-sm">
                                              <option value="escale">Escale</option>
                                              <option value="destination">Destination</option>
                                              <option value="other">Autre</option>
                                          </select>
                                          <button onClick={() => setEditForm({ ...editForm, additional_cities: editForm.additional_cities.filter((_, i) => i !== index) })} type="button" className="text-red-500 hover:text-red-700 p-1"><X size={18} /></button>
                                      </div>
                                  ))}
                                  <button onClick={() => setEditForm({ ...editForm, additional_cities: [...(editForm.additional_cities || []), defaultAdditionalCity] })} type="button" className="text-orange-500 hover:text-orange-700 text-sm font-semibold flex items-center gap-1"><Plus size={16} /> Ajouter une ville</button>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                  <input type="checkbox" id="ouikenac-edit-active" checked={editForm.active || false} onChange={e => setEditForm({ ...editForm, active: e.target.checked })} className="h-4 w-4 text-orange-600 border-gray-300 rounded" />
                                  <label htmlFor="ouikenac-edit-active" className="text-sm font-medium text-gray-700">Actif</label>
                              </div>
                              <button onClick={handleUpdateOuikenac} disabled={submitting} className="w-full text-white py-2 rounded-lg font-medium transition disabled:opacity-50" style={{ backgroundColor: '#f18f13' }}>{submitting ? 'Mise à jour...' : 'Enregistrer les modifications'}</button>
                          </>
                      )}

                      {/* Form: City Tour - UPDATED */}
                      {editItem.type === 'citytour' && (
                          <>
                              <input type="text" placeholder="Nom du Tour *" value={editForm.title || editForm.nom || ''} onChange={e => setEditForm({ ...editForm, nom: e.target.value, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                              <textarea placeholder="Description" value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows="3" />
                              <textarea placeholder="Programme détaillé" value={editForm.programme || ''} onChange={e => setEditForm({ ...editForm, programme: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows="3" />
                              <input type="number" placeholder="Prix (FCFA) *" value={editForm.price || ''} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                              <input type="date" placeholder="Date de début *" value={editForm.scheduled_date || editForm.date || ''} onChange={e => setEditForm({ ...editForm, date: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />

                              <div className="grid grid-cols-2 gap-4">
                                  <select value={editForm.country_id || ''} onChange={e => setEditForm({ ...editForm, country_id: e.target.value, city_id: '' })} className="w-full px-3 py-2 border rounded-lg" required>
                                      <option value="">Sélectionnez le pays *</option>
                                      {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                  </select>
                                  <select value={editForm.city_id || ''} onChange={e => setEditForm({ ...editForm, city_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required disabled={!editForm.country_id}>
                                      <option value="">Sélectionnez la ville *</option>
                                      {cities.filter(c => c.country_id === editForm.country_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                  </select>
                              </div>

                              <button onClick={handleUpdateCityTour} disabled={submitting} className="w-full text-white py-2 rounded-lg font-medium transition disabled:opacity-50" style={{ backgroundColor: '#40bcd5' }}>{submitting ? 'Mise à jour...' : 'Enregistrer les modifications'}</button>
                          </>
                      )}
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
        .animate-progress { animation: progress 2s ease-in-out infinite alternate; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;