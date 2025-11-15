import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Package, MapPin, TrendingUp, DollarSign, Calendar, Settings, Home, Globe, Building, Plane, Compass, Navigation, Menu, X, Upload, Loader2, CheckCircle, AlertCircle, XCircle, Edit2, Trash2, Plus, CornerDownRight, Info, Map, Zap, Aperture, BookOpen, Clock, Users as UsersIcon, List, Eye, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'https://etravelbackend-production.up.railway.app/api';

// --- ASSUMPTION & HELPERS ---
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
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return 'N/A';
  return numPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const getOuikenacPriceDetails = (ouikenac) => {
    if (!ouikenac.prices || ouikenac.prices.length === 0) {
        return { display: 'Prix non défini', minPrice: null, minPeople: null };
    }
    
    const sortedPrices = ouikenac.prices.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    const minPriceObj = sortedPrices[0];
    
    const minPrice = formatPrice(minPriceObj.price);
    const currency = minPriceObj.currency || 'CFA';
    const minPeople = minPriceObj.min_people || 1;
    
    return { 
        display: `${minPrice} ${currency} (Min. ${minPeople} pers.)`,
        minPrice: minPriceObj.price,
        minPeople: minPeople
    };
};

// --- API CLIENT ---
const api = axios.create({
  baseURL: API_BASE,
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

const DataTable = ({ columns, data, onAction }) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                <Info size={30} className="mx-auto mb-3 text-gray-400" />
                <p>Aucune donnée disponible pour l'instant.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map(col => (
                            <th key={col.header} className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map(row => (
                        <tr key={row.id} className="hover:bg-gray-50 transition">
                            {columns.map(col => (
                                <td key={col.accessor} className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {col.render ? col.render(row) : (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


// --- COMPOSANT PRINCIPAL ADMIN ---

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  
  // States pour les relations
  const [editRelations, setEditRelations] = useState({ 
    prices: [], 
    additionalCities: [], 
    inclusions: [],
    services: [],
  });

  // Data States
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [ouikenacs, setOuikenacs] = useState([]);
  const [cityTours, setCityTours] = useState([]);
  const [reservations, setReservations] = useState([]);

  // --- HELPERS ---
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
  };
  
  const defaultForms = {
    country: { name: '', code: '' },
    city: { name: '', country_id: '' },
    destination: { 
        title: '', 
        description: '', 
        departure_country_id: '', 
        price: '', 
        currency: 'CFA',
        image: null
    },
    ouikenac: { 
        title: '', 
        description: '',
        image: null
    },
    cityTour: { 
        nom: '', 
        country_id: '', 
        city_id: '', 
        date: '', 
        places_min: 1, 
        places_max: 2, 
        price: '', 
        currency: 'CFA',
        description: '',
        programme: '',
        image: null
    }
  };

  const openModal = (type, data = null) => {
    setModalType(type);
    setIsEdit(!!data);
    setFile(null);
    setFileName('');

    if (data) {
        const formData = { 
            ...data, 
            nom: data.nom || data.title, 
            date: data.date ? data.date.split('T')[0] : (data.tour_date ? new Date(data.tour_date).toISOString().split('T')[0] : ''),
            country_id: data.country_id || data.city?.country_id || '',
            city_id: data.city_id || '',
            price: data.prices?.[0]?.price || data.price || '',
            currency: data.prices?.[0]?.currency || data.currency || 'CFA',
            places_min: data.min_people || data.places_min || 1,
            places_max: data.max_people || data.places_max || 2,
        };
        
        setEditForm(formData);

        setEditRelations({
            prices: data.prices || [],
            additionalCities: data.additional_cities || [],
            inclusions: data.inclusions || [],
            services: data.services || data.inclusions || [],
        });
    } else {
        setEditForm(defaultForms[type] || {});
        setEditRelations({ prices: [], additionalCities: [], inclusions: [], services: [] });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditForm({});
    setEditRelations({ prices: [], additionalCities: [], inclusions: [], services: [] });
    setFile(null);
    setFileName('');
    setModalType(null);
  };

  const handleFormChange = (e) => {
    e.persist && e.persist();
    const { name, value, type } = e.target;
    
    if (type === 'file') {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    } else {
        setEditForm(prevForm => { 
            const newForm = {
                ...prevForm, 
                [name]: value 
            };
            return newForm;
        });
    }
  };
  
  // --- RELATION MANAGEMENT ---

  const handleUpdateRelation = (relationType, index, field, value) => {
    setEditRelations(prev => {
        const newArray = [...prev[relationType]];
        newArray[index] = { 
            ...newArray[index], 
            [field]: field.includes('_id') || field.includes('price') || field.includes('people') ? (value ? parseInt(value) : null) : value 
        };
        return { ...prev, [relationType]: newArray };
    });
  };

  const handleAddRelation = (relationType, defaultItem) => {
    setEditRelations(prev => ({ 
        ...prev, 
        [relationType]: [...prev[relationType], defaultItem]
    }));
  };

  const handleRemoveRelation = (relationType, index) => {
    setEditRelations(prev => ({
        ...prev,
        [relationType]: prev[relationType].filter((_, i) => i !== index)
    }));
  };
  
  // --- FETCHING & CRUD OPERATIONS ---

  const fetchAllData = async () => {
    setLoading(true);
    try {
        const [
            countriesRes,
            citiesRes,
            destinationsRes,
            ouikenacsRes,
            cityToursRes,
            reservationsRes
        ] = await Promise.all([
            api.get('/countries'),
            api.get('/cities'),
            api.get('/destination-packages'),
            api.get('/ouikenacs'),
            api.get('/city-tours'),
            api.get('/reservations')
        ]);
        
        setCountries(countriesRes.data);
        setCities(citiesRes.data);
        setDestinations(destinationsRes.data);
        setOuikenacs(ouikenacsRes.data);
        setCityTours(cityToursRes.data);
        setReservations(reservationsRes.data);
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error.response?.data || error);
        showNotification('Erreur lors du chargement des données initiales.', 'error');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []); 
  
  const getEndpoint = (type) => {
    switch (type) {
        case 'country': return 'countries';
        case 'city': return 'cities';
        case 'destination': return 'destination-packages';
        case 'ouikenac': return 'ouikenacs';
        case 'cityTour': return 'city-tours';
        default: return '';
    }
  };

  const handleCreateUpdate = async (type) => {
    setSubmitting(true);
    const isUpdating = isEdit;
    const endpoint = getEndpoint(type);
    
    const formData = new FormData();
    const dataToSubmit = { ...editForm };
    
    Object.keys(dataToSubmit).forEach(key => {
        if (key !== 'image' && key !== 'cities' && dataToSubmit[key] !== null && dataToSubmit[key] !== '') {
            formData.append(key, dataToSubmit[key]);
        }
    });

    if (file) {
        formData.append('image', file);
    }

    if (type === 'ouikenac') {
        formData.append('grids', JSON.stringify(editRelations.prices.map(p => ({
            ...p,
            departure_country_id: p.departure_country_id || null, 
            arrival_country_id: p.arrival_country_id || null, 
            min_people: parseInt(p.min_people) || 1, 
            max_people: parseInt(p.max_people) || 2, 
            price: parseFloat(p.price) || 0,
        }))));
        formData.append('inclusions', JSON.stringify(editRelations.inclusions));
        formData.append('additional_cities', JSON.stringify(editRelations.additionalCities.map(c => c.id)));
    } else if (type === 'destination') {
        formData.append('services', JSON.stringify(editRelations.services));
        formData.append('price', parseFloat(dataToSubmit.price));
        formData.append('currency', dataToSubmit.currency);
    } else if (type === 'cityTour') {
        formData.append('nom', dataToSubmit.nom);
        formData.append('price', parseFloat(dataToSubmit.price));
        formData.append('currency', dataToSubmit.currency);
        formData.append('places_min', parseInt(dataToSubmit.places_min));
        formData.append('places_max', parseInt(dataToSubmit.places_max));
    }

    try {
        let response;
        if (isUpdating) {
            formData.append('_method', 'PUT'); 
            response = await api.post(`/${endpoint}/${dataToSubmit.id}`, formData);
        } else {
            response = await api.post(`/${endpoint}`, formData);
        }
        
        closeModal();
        await fetchAllData();
        showNotification(response.data.message || `${type.charAt(0).toUpperCase() + type.slice(1)} ${isUpdating ? 'mis à jour' : 'créé'} avec succès.`, 'success');

    } catch (error) {
        console.error('Erreur CRUD:', error.response?.data || error);
        const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Erreur lors de l\'opération.';
        showNotification(errorMsg, 'error');
    } finally {
        setSubmitting(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ce ${type} (ID: ${id}) ?`)) return;

    setSubmitting(true);
    const endpoint = getEndpoint(type);

    try {
        const response = await api.delete(`/${endpoint}/${id}`);
        await fetchAllData(); 
        showNotification(response.data.message || `${type.charAt(0).toUpperCase() + type.slice(1)} supprimé avec succès.`, 'success');
    } catch (error) {
        console.error('Erreur Suppression:', error.response?.data || error);
        showNotification(error.response?.data?.message || 'Erreur lors de la suppression.', 'error');
    } finally {
        setSubmitting(false);
    }
  };
  
  // --- RENDERING HELPERS (FORMS) ---

  const getFormTitle = (action) => isEdit ? `Modifier ${action}` : `Créer ${action}`;

  const RelationListManager = ({ relationType, items, itemTemplate, title, emptyMessage }) => (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 mt-4">
        <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <List size={20} className="text-primary" /> {title}
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {items.length === 0 ? (
                <p className="text-sm text-gray-500">{emptyMessage}</p>
            ) : (
                items.map((item, index) => (
                    <div key={index} className="p-3 bg-white rounded-md border border-gray-200 shadow-sm flex items-center justify-between gap-3">
                        <div className="flex-1 space-y-2">
                            {itemTemplate(item, index)}
                        </div>
                        <button 
                            type="button" 
                            onClick={() => handleRemoveRelation(relationType, index)} 
                            className="text-red-500 hover:text-red-700 p-1"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))
            )}
        </div>
        <button 
            type="button" 
            onClick={() => handleAddRelation(relationType, relationType === 'prices' ? { 
                departure_country_id: null, 
                arrival_country_id: null, 
                min_people: 1, 
                max_people: 2, 
                price: 0, 
                currency: 'CFA' 
            } : { name: '', description: '' })} 
            className="mt-4 w-full bg-primary/10 text-primary py-2 rounded-lg font-medium transition hover:bg-primary/20 flex items-center justify-center gap-2"
        >
            <Plus size={20} /> Ajouter {title.toLowerCase().includes('prix') ? 'une grille' : 'un élément'}
        </button>
    </div>
  );

  // MODAL CONTENT
  const ModalContent = () => {
    // --- DESTINATION ---
    if (modalType === 'destination') {
        const itemTemplate = (item, index) => (
            <input
                type="text"
                value={item.name || ''}
                onChange={(e) => handleUpdateRelation('services', index, 'name', e.target.value)}
                placeholder="Nom du service (Ex: Assurance Voyage)"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-primary focus:outline-none"
            />
        );
        
        return (
            <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{getFormTitle('un Package Destination')}</h2>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={editForm.title || ''} 
                                onChange={(e) => handleFormChange(e)} 
                                required 
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pays de Départ *</label>
                            <select 
                                name="departure_country_id" 
                                value={editForm.departure_country_id || ''} 
                                onChange={(e) => handleFormChange(e)} 
                                required 
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Sélectionnez un Pays</option>
                                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                            name="description" 
                            value={editForm.description || ''} 
                            onChange={(e) => handleFormChange(e)} 
                            rows="3" 
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix de base *</label>
                            <input 
                                type="number" 
                                name="price" 
                                value={editForm.price || ''} 
                                onChange={handleFormChange} 
                                required 
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none" 
                                min="0" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Devise *</label>
                            <select 
                                name="currency" 
                                value={editForm.currency || 'CFA'} 
                                onChange={handleFormChange} 
                                required 
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
                            >
                                <option value="CFA">CFA</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image du Package {isEdit && !file && editForm.image && <span className="text-gray-500 text-xs"> (Actuelle)</span>}
                            </label>
                            <div className="relative">
                                <input 
                                    type="file" 
                                    name="image" 
                                    id="destination-image"
                                    onChange={handleFormChange} 
                                    accept="image/*"
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
                                />
                                {fileName && <p className="text-xs text-gray-600 mt-1">Fichier: {fileName}</p>}
                            </div>
                        </div>
                        {isEdit && (file || editForm.image) && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
                                <img src={file ? URL.createObjectURL(file) : editForm.image} alt="Image actuelle" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <RelationListManager
                        relationType="services"
                        items={editRelations.services}
                        itemTemplate={itemTemplate}
                        title="Services Inclus"
                        emptyMessage="Ajoutez les services offerts dans ce package."
                    />
                </div>

                <button 
                    onClick={() => handleCreateUpdate('destination')} 
                    disabled={submitting} 
                    className="w-full mt-6 bg-primary text-white py-2 rounded-lg font-medium transition hover:bg-primary/90 disabled:opacity-50"
                >
                    {submitting ? 'Envoi en cours...' : (isEdit ? 'Enregistrer les modifications' : 'Créer le Package')}
                </button>
            </>
        );
    }
    
    // --- OUIKENAC ---
    if (modalType === 'ouikenac') {
        const priceItemTemplate = (price, index) => (
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                <select 
                    value={price.departure_country_id || ''} 
                    onChange={(e) => handleUpdateRelation('prices', index, 'departure_country_id', e.target.value)} 
                    required 
                    className="col-span-2 block w-full border border-gray-300 rounded-md p-2 text-sm focus:border-primary focus:outline-none"
                >
                    <option value="">Départ *</option>
                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select 
                    value={price.arrival_country_id || ''} 
                    onChange={(e) => handleUpdateRelation('prices', index, 'arrival_country_id', e.target.value)} 
                    required 
                    className="col-span-2 block w-full border border-gray-300 rounded-md p-2 text-sm focus:border-primary focus:outline-none"
                >
                    <option value="">Arrivée *</option>
                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input 
                    type="number" 
                    placeholder="Min Pers. *" 
                    value={price.min_people || 1} 
                    onChange={(e) => handleUpdateRelation('prices', index, 'min_people', e.target.value)} 
                    required 
                    className="col-span-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:border-primary focus:outline-none" 
                    min="1" 
                />
                <input 
                    type="number" 
                    placeholder="Max Pers. *" 
                    value={price.max_people || 2} 
                    onChange={(e) => handleUpdateRelation('prices', index, 'max_people', e.target.value)} 
                    required 
                    className="col-span-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:border-primary focus:outline-none" 
                    min="1" 
                />
                <input 
                    type="number" 
                    placeholder="Prix *" 
                    value={price.price || 0} 
                    onChange={(e) => handleUpdateRelation('prices', index, 'price', e.target.value)} 
                    required 
                    className="col-span-2 sm:col-span-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:border-primary focus:outline-none" 
                    min="0" 
                />
                <select 
                    value={price.currency || 'CFA'} 
                    onChange={(e) => handleUpdateRelation('prices', index, 'currency', e.target.value)} 
                    required 
                    className="col-span-2 sm:col-span-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:border-primary focus:outline-none"
                >
                    <option value="CFA">CFA</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                </select>
            </div>
        );

        const inclusionItemTemplate = (item, index) => (
             <input
                type="text"
                value={item.name || ''}
                onChange={(e) => handleUpdateRelation('inclusions', index, 'name', e.target.value)}
                placeholder="Nom de l'inclusion (Ex: Transport A/R)"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-primary focus:outline-none"
            />
        );

        return (
            <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{getFormTitle('un Package Ouikenac')}</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={editForm.title || ''} 
                            onChange={handleFormChange} 
                            required 
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                            name="description" 
                            value={editForm.description || ''} 
                            onChange={handleFormChange} 
                            rows="3" 
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image du Package {isEdit && !file && editForm.image && <span className="text-gray-500 text-xs"> (Actuelle)</span>}
                            </label>
                            <div className="relative">
                                <input 
                                    type="file" 
                                    name="image" 
                                    id="ouikenac-image"
                                    onChange={handleFormChange} 
                                    accept="image/*"
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
                                />
                                {fileName && <p className="text-xs text-gray-600 mt-1">Fichier: {fileName}</p>}
                            </div>
                        </div>
                        {isEdit && (file || editForm.image) && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
                                <img src={file ? URL.createObjectURL(file) : editForm.image} alt="Image actuelle" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <RelationListManager
                        relationType="prices"
                        items={editRelations.prices}
                        itemTemplate={priceItemTemplate}
                        title="Grilles de Prix"
                        emptyMessage="Ajoutez au moins une grille de prix."
                    />

                    <RelationListManager
                        relationType="inclusions"
                        items={editRelations.inclusions}
                        itemTemplate={inclusionItemTemplate}
                        title="Inclusions du Package"
                        emptyMessage="Ajoutez les inclusions (services/activités)."
                    />

                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 mt-4">
                        <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <MapPin size={20} className="text-primary" /> Villes Additionnelles
                        </h4>
                        <select 
                            multiple
                            value={editRelations.additionalCities.map(c => c.id)}
                            onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions, option => ({ id: parseInt(option.value), name: option.label }));
                                setEditRelations(prev => ({ ...prev, additionalCities: selectedOptions }));
                            }} 
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none max-h-40"
                        >
                            {cities.map(c => <option key={c.id} value={c.id}>{c.name} ({c.country.name})</option>)}
                        </select>
                        <p className="text-xs text-gray-500 mt-2">Maintenez CTRL ou CMD pour sélectionner plusieurs villes.</p>
                    </div>
                </div>

                <button 
                    onClick={() => handleCreateUpdate('ouikenac')} 
                    disabled={submitting} 
                    className="w-full mt-6 bg-warning text-white py-2 rounded-lg font-medium transition hover:bg-warning/90 disabled:opacity-50"
                >
                    {submitting ? 'Envoi en cours...' : (isEdit ? 'Enregistrer les modifications' : 'Créer le Package')}
                </button>
            </>
        );
    } 
    
    // --- CITY TOUR ---
    if (modalType === 'cityTour') {
        const selectedCountryCities = cities.filter(c => c.country_id === parseInt(editForm.country_id));
        return (
            <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{getFormTitle('un City Tour')}</h2>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Titre du Tour *</label>
                            <input 
                                type="text" 
                                name="nom" 
                                value={editForm.nom || ''} 
                                onChange={handleFormChange} 
                                required 
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date du Tour *</label>
                            <input 
                                type="date" 
                                name="date" 
                                value={editForm.date || ''} 
                                onChange={handleFormChange} 
                                required 
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                            <select 
                                name="country_id" 
                                value={editForm.country_id || ''} 
                                onChange={handleFormChange} 
                                required 
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
                            >
                                <option value="">Sélectionnez un Pays</option>
                                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                            <select 
                                name="city_id" 
                                value={editForm.city_id || ''} 
                                onChange={handleFormChange} 
                                required 
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none" 
                                disabled={!editForm.country_id}
                            >
                                <option value="">Sélectionnez la ville</option>
                                {selectedCountryCities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix *</label>
                            <input 
                                type="number" 
                                name="price" 
                                value={editForm.price || ''} 
                                onChange={handleFormChange} 
                                required 
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none" 
                                min="0" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Devise *</label>
                            <select 
                                name="currency" 
                                value={editForm.currency || 'CFA'} 
                                onChange={handleFormChange} 
                                required 
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
                            >
                                <option value="CFA">CFA</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min. Places *</label>
                            <input 
                                type="number" 
                                name="places_min" 
                                value={editForm.places_min || 1} 
                                onChange={handleFormChange} 
                                required 
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none" 
                                min="1" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max. Places *</label>
                            <input 
                                type="number" 
                                name="places_max" 
                                value={editForm.places_max || 2} 
                                onChange={handleFormChange} 
                                required 
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none" 
                                min={editForm.places_min || 1} 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                            name="description" 
                            value={editForm.description || ''} 
                            onChange={handleFormChange} 
                            rows="3" 
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Programme (Détails du Tour)</label>
                        <textarea 
                            name="programme" 
                            value={editForm.programme || ''} 
                            onChange={handleFormChange} 
                            rows="5" 
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
                        />
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image du Tour {isEdit && !file && editForm.image && <span className="text-gray-500 text-xs"> (Actuelle)</span>}
                            </label>
                            <div className="relative">
                                <input 
                                    type="file" 
                                    name="image" 
                                    id="citytour-image"
                                    onChange={handleFormChange} 
                                    accept="image/*"
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
                                />
                                {fileName && <p className="text-xs text-gray-600 mt-1">Fichier: {fileName}</p>}
                            </div>
                        </div>
                        {isEdit && (file || editForm.image) && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
                                <img src={file ? URL.createObjectURL(file) : editForm.image} alt="Image actuelle" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                <button 
                    onClick={() => handleCreateUpdate('cityTour')} 
                    disabled={submitting} 
                    className="w-full mt-6 bg-cyan text-white py-2 rounded-lg font-medium transition hover:bg-cyan/90 disabled:opacity-50"
                >
                    {submitting ? 'Envoi en cours...' : (isEdit ? 'Enregistrer les modifications' : 'Créer le Tour')}
                </button>
            </>
        );
    }
    
    // --- COUNTRY ---
    if (modalType === 'country') {
        return (
            <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{getFormTitle('un Pays')}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Pays *</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={editForm.name || ''} 
                            onChange={handleFormChange} 
                            required 
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code (Ex: CG ou DRC) *</label>
                        <input 
                            type="text" 
                            name="code" 
                            value={editForm.code || ''} 
                            onChange={handleFormChange} 
                            required 
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none" 
                            maxLength="3" 
                        />
                    </div>
                </div>
                <button 
                    onClick={() => handleCreateUpdate('country')} 
                    disabled={submitting} 
                    className="w-full mt-6 bg-primary text-white py-2 rounded-lg font-medium transition hover:bg-primary/90 disabled:opacity-50"
                >
                    {submitting ? 'Envoi en cours...' : (isEdit ? 'Enregistrer les modifications' : 'Créer le Pays')}
                </button>
            </>
        );
    }
    
    // --- CITY ---
    if (modalType === 'city') {
        return (
            <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{getFormTitle('une Ville')}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la Ville *</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={editForm.name || ''} 
                            onChange={handleFormChange} 
                            required 
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                        <select 
                            name="country_id" 
                            value={editForm.country_id || ''} 
                            onChange={handleFormChange} 
                            required 
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:outline-none"
                        >
                            <option value="">Sélectionnez un Pays</option>
                            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
                <button 
                    onClick={() => handleCreateUpdate('city')} 
                    disabled={submitting} 
                    className="w-full mt-6 bg-primary text-white py-2 rounded-lg font-medium transition hover:bg-primary/90 disabled:opacity-50"
                >
                    {submitting ? 'Envoi en cours...' : (isEdit ? 'Enregistrer les modifications' : 'Créer la Ville')}
                </button>
            </>
        );
    }
    
    return null;
  };

  // DASHBOARD DATA
  const { totalReservations, totalRevenue, totalPackages, reservationChartData, packagesByCountryChartData, monthlyRevenueChartData, conversionScore } = useMemo(() => {
    const totalReservations = reservations.length;
    
    const totalRevenue = reservations.reduce((sum, r) => {
        let price = 0;
        const type = getReservationType(r);
        if (type === 'Destination') price = 500000;
        else if (type === 'Ouikenac') price = 250000;
        else if (type === 'City Tour') price = 50000;
        return sum + price; 
    }, 0);
    
    const totalPackages = destinations.length + ouikenacs.length + cityTours.length;

    const reservationCounts = reservations.reduce((acc, r) => {
        const type = getReservationType(r);
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const reservationChartData = Object.keys(reservationCounts).map(key => ({
        name: key,
        value: reservationCounts[key]
    }));
    
    const packagesByCountry = {};
    countries.forEach(country => {
        packagesByCountry[country.name] = { destinations: 0, ouikenacs: 0, cityTours: 0 };
    });

    destinations.forEach(d => {
        if (d.departure_country?.name) {
            packagesByCountry[d.departure_country.name].destinations += 1;
        }
    });

    ouikenacs.forEach(o => {
        const firstPrice = o.prices?.[0];
        if (firstPrice && firstPrice.arrivalCountry?.name) {
             packagesByCountry[firstPrice.arrivalCountry.name].ouikenacs += 1;
        }
    });

    cityTours.forEach(t => {
        if (t.city?.country?.name) {
            packagesByCountry[t.city.country.name].cityTours += 1;
        }
    });

    const packagesByCountryChartData = Object.keys(packagesByCountry)
        .filter(countryName => 
             packagesByCountry[countryName].destinations > 0 || 
             packagesByCountry[countryName].ouikenacs > 0 || 
             packagesByCountry[countryName].cityTours > 0
        )
        .map(countryName => ({
            name: countryName,
            ...packagesByCountry[countryName]
        }));
        
    const monthlyRevenueChartData = [
        { name: 'Jan', Revenue: 4000000 }, { name: 'Fév', Revenue: 3000000 }, { name: 'Mar', Revenue: 5500000 }, 
        { name: 'Avr', Revenue: 4200000 }, { name: 'Mai', Revenue: 6800000 }, { name: 'Jui', Revenue: 7500000 }, 
        { name: 'Jul', Revenue: 8100000 }, { name: 'Aou', Revenue: 11000000 }, { name: 'Sep', Revenue: 8800000 }, 
        { name: 'Oct', Revenue: 12500000 }, { name: 'Nov', Revenue: 10200000 }, { name: 'Dec', Revenue: 14000000 }, 
    ]; 
    
    const conversionScore = destinations.length > 0 ? (totalReservations / totalPackages * 100).toFixed(1) : 0;
    
    return { totalReservations, totalRevenue, totalPackages, reservationChartData, packagesByCountryChartData, monthlyRevenueChartData, conversionScore };
  }, [reservations, destinations, ouikenacs, cityTours, countries]);

  const PIE_COLORS = ['#1b5e8e', '#f18f13', '#007335', '#40bcd5', '#f7b406'];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5; 
    const x = cx + radius * Math.cos(-midAngle * RADIAN); 
    const y = cy + radius * Math.sin(-midAngle * RADIAN); 
    return ( 
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: '10px' }}>
            {`${name} (${(percent * 100).toFixed(0)}%)`}
        </text>
    );
  };
    
  // --- JSX TEMPLATE ---

  return (
    <div className="min-h-screen bg-light-bg flex">
      {loading && <LoadingOverlay />}
      {submitting && <LoadingOverlay />}
      <Notification show={notification.show} message={notification.message} type={notification.type} onClose={() => setNotification({ show: false, message: '', type: '' })} />

      {/* Sidebar */}
      <aside className={`fixed z-40 lg:relative ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 w-64 bg-gray-900 flex flex-col h-screen`}>
        <div className="flex items-center justify-between p-6 bg-gray-800">
          <h2 className="text-xl font-bold text-white">e-TRAVEL ADMIN</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white hover:text-primary transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center w-full p-3 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          >
            <Home size={20} className="mr-3" /> Tableau de Bord
          </button>
          
          <h3 className="text-xs uppercase text-gray-500 font-semibold mt-4 mb-2 pt-2 border-t border-gray-700">Gestion des Packages</h3>
          
          <button 
            onClick={() => setActiveTab('destinations')} 
            className={`flex items-center w-full p-3 rounded-lg font-medium transition-colors ${activeTab === 'destinations' ? 'bg-primary text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          >
            <Plane size={20} className="mr-3" /> Destinations
          </button>
          
          <button 
            onClick={() => setActiveTab('ouikenacs')} 
            className={`flex items-center w-full p-3 rounded-lg font-medium transition-colors ${activeTab === 'ouikenacs' ? 'bg-primary text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          >
            <Zap size={20} className="mr-3" /> Ouikenac
          </button>

          <button 
            onClick={() => setActiveTab('city-tours')} 
            className={`flex items-center w-full p-3 rounded-lg font-medium transition-colors ${activeTab === 'city-tours' ? 'bg-primary text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          >
            <Map size={20} className="mr-3" /> City Tours
          </button>
          
          <h3 className="text-xs uppercase text-gray-500 font-semibold mt-4 mb-2 pt-2 border-t border-gray-700">Paramètres</h3>

          <button 
            onClick={() => setActiveTab('countries')} 
            className={`flex items-center w-full p-3 rounded-lg font-medium transition-colors ${activeTab === 'countries' ? 'bg-primary text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          >
            <Globe size={20} className="mr-3" /> Pays
          </button>
          
          <button 
            onClick={() => setActiveTab('cities')} 
            className={`flex items-center w-full p-3 rounded-lg font-medium transition-colors ${activeTab === 'cities' ? 'bg-primary text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          >
            <Building size={20} className="mr-3" /> Villes
          </button>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8">
        
        <header className="flex items-center justify-between lg:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-900 p-2">
            <Menu size={28} />
          </button>
        </header>

        {/* --- 1. DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Tableau de Bord</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardCard 
                icon={Users} 
                title="Réservations" 
                value={totalReservations} 
                color="primary" 
                detail="Total Clients" 
              />
              <DashboardCard 
                icon={DollarSign} 
                title="Revenu Estimé" 
                value={`${formatPrice(totalRevenue)} XAF`} 
                color="secondary" 
                detail="Total Annuel Simulé" 
              />
              <DashboardCard 
                icon={Package} 
                title="Packages Actifs" 
                value={totalPackages} 
                color="green" 
                detail="Destination, Ouikenac, City Tour" 
              />
              <DashboardCard 
                icon={TrendingUp} 
                title="Score de Conversion" 
                value={`${conversionScore}%`} 
                color="warning" 
                detail="Réservations / Packages" 
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={20} className="text-primary" /> Réservations par Type</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={reservationChartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                {reservationChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} réservations`} />
                            <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingLeft: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe size={20} className="text-primary" /> Packages par Pays</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={packagesByCountryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" stroke="#4b5563" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#4b5563" style={{ fontSize: '12px' }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="destinations" fill="#1b5e8e" name="Destinations" />
                            <Bar dataKey="ouikenacs" fill="#f18f13" name="Ouikenac" />
                            <Bar dataKey="cityTours" fill="#40bcd5" name="City Tours" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Aperture size={20} className="text-primary" /> Évolution des Revenus Mensuels (Estimé)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyRevenueChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" stroke="#4b5563" style={{ fontSize: '12px' }} />
                            <YAxis tickFormatter={val => formatPrice(val)} stroke="#4b5563" style={{ fontSize: '12px' }} />
                            <Tooltip formatter={(value) => [`${formatPrice(value)} XAF`, 'Revenu']} />
                            <Legend />
                            <Line type="monotone" dataKey="Revenue" stroke="#007335" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

            </div>
          </div>
        )}

        {/* --- 2. DESTINATIONS --- */}
        {activeTab === 'destinations' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Gestion des Destinations</h2>
                    <button onClick={() => openModal('destination')} className="bg-primary text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors">
                        <Plus size={20} /> Nouvelle Destination
                    </button>
                </div>
                <DataTable 
                    data={destinations}
                    columns={[
                        { header: 'ID', accessor: 'id' },
                        { header: 'Titre', accessor: 'title' },
                        { header: 'Départ', accessor: (d) => d.departure_country?.name || 'N/A' },
                        { header: 'Prix Min', accessor: (d) => `${formatPrice(d.prices?.[0]?.price || d.price)} ${d.prices?.[0]?.currency || d.currency || 'CFA'}` },
                        { header: 'Actions', accessor: 'actions', render: (d) => (
                            <div className="flex gap-2 min-w-[60px]">
                                <button onClick={() => openModal('destination', d)} className="text-primary hover:text-primary/90 transition" title="Modifier le package">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={() => handleDelete('destination', d.id)} className="text-red-500 hover:text-red-700 transition" title="Supprimer">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        )},
                    ]}
                />
            </div>
        )}

        {/* --- 3. OUIKENAC --- */}
        {activeTab === 'ouikenacs' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Gestion des Packages Ouikenac</h2>
                    <button onClick={() => openModal('ouikenac')} className="bg-warning text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-warning/90 transition-colors">
                        <Plus size={20} /> Nouveau Ouikenac
                    </button>
                </div>
                <DataTable 
                    data={ouikenacs}
                    columns={[
                        { header: 'ID', accessor: 'id' },
                        { header: 'Titre', accessor: 'title' },
                        { header: 'Prix', accessor: (o) => {
                            const details = getOuikenacPriceDetails(o); 
                            return <span className="font-medium text-secondary">{details.display.split('(')[0].trim()}</span>;
                        }},
                        { header: 'Grilles', accessor: (o) => o.prices?.length || 0 },
                        { header: 'Actions', accessor: 'actions', render: (o) => (
                            <div className="flex gap-2 min-w-[60px]">
                                <button onClick={() => openModal('ouikenac', o)} className="text-warning hover:text-warning/90 transition" title="Modifier le package">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={() => handleDelete('ouikenac', o.id)} className="text-red-500 hover:text-red-700 transition" title="Supprimer">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        )},
                    ]}
                />
            </div>
        )}

        {/* --- 4. CITY TOURS --- */}
        {activeTab === 'city-tours' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Gestion des City Tours</h2>
                    <button onClick={() => openModal('cityTour')} className="bg-cyan text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-cyan/90 transition-colors">
                        <Plus size={20} /> Nouveau City Tour
                    </button>
                </div>
                <DataTable 
                    data={cityTours}
                    columns={[
                        { header: 'ID', accessor: 'id' },
                        { header: 'Titre', accessor: 'title' },
                        { header: 'Ville/Pays', accessor: (t) => `${t.city?.name || 'N/A'} (${t.country?.code || 'N/A'})` },
                        { header: 'Date', accessor: (t) => t.date ? new Date(t.date).toLocaleDateString('fr-FR') : 'N/A' },
                        { header: 'Prix', accessor: (t) => `${formatPrice(t.price)} ${t.currency || 'CFA'}` },
                        { header: 'Actions', accessor: 'actions', render: (t) => (
                            <div className="flex gap-2 min-w-[60px]">
                                <button onClick={() => openModal('cityTour', t)} className="text-cyan hover:text-cyan/90 transition" title="Modifier le tour">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={() => handleDelete('cityTour', t.id)} className="text-red-500 hover:text-red-700 transition" title="Supprimer">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        )},
                    ]}
                />
            </div>
        )}
        
        {/* --- 5. PAYS --- */}
        {activeTab === 'countries' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Gestion des Pays</h2>
                    <button onClick={() => openModal('country')} className="bg-primary text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors">
                        <Plus size={20} /> Nouveau Pays
                    </button>
                </div>
                 <DataTable 
                    data={countries}
                    columns={[
                        { header: 'ID', accessor: 'id' },
                        { header: 'Nom', accessor: 'name' },
                        { header: 'Code', accessor: 'code' },
                        { header: 'Villes', accessor: (c) => c.cities?.length || 0 },
                        { header: 'Actions', accessor: 'actions', render: (c) => ( 
                            <div className="flex gap-2 min-w-[60px]">
                                <button onClick={() => openModal('country', c)} className="text-primary hover:text-primary/90 transition" title="Modifier le pays">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={() => handleDelete('country', c.id)} className="text-red-500 hover:text-red-700 transition" title="Supprimer">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        )},
                    ]}
                />
            </div>
        )}
        
        {/* --- 6. VILLES --- */}
        {activeTab === 'cities' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Gestion des Villes</h2>
                    <button onClick={() => openModal('city')} className="bg-primary text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors">
                        <Plus size={20} /> Nouvelle Ville
                    </button>
                </div>
                 <DataTable 
                    data={cities}
                    columns={[
                        { header: 'ID', accessor: 'id' },
                        { header: 'Nom', accessor: 'name' },
                        { header: 'Pays', accessor: (c) => c.country?.name || 'N/A' },
                        { header: 'Actions', accessor: 'actions', render: (c) => ( 
                            <div className="flex gap-2 min-w-[60px]">
                                <button onClick={() => openModal('city', c)} className="text-primary hover:text-primary/90 transition" title="Modifier la ville">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={() => handleDelete('city', c.id)} className="text-red-500 hover:text-red-700 transition" title="Supprimer">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        )},
                    ]}
                />
            </div>
        )}

      </main>

      {/* MODAL */}
      {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-in" onClick={e => e.stopPropagation()}>
                  <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-2 z-10 bg-white rounded-full transition-colors">
                      <X size={24} />
                  </button>
                  <div className="p-6 sm:p-8">
                      <ModalContent />
                  </div>
              </div>
          </div>
      )}

      <style jsx global>{`
        :root { 
          --primary: #1b5e8e;
          --secondary: #f18f13;
          --green: #007335;
          --warning: #f7b406;
          --cyan: #40bcd5;
          --light-bg: #f5f7f9;
        }

        .text-primary { color: var(--primary) !important; }
        .bg-primary { background-color: var(--primary) !important; }
        .border-primary { border-color: var(--primary) !important; }
        .hover\\:bg-primary\\/90:hover { background-color: rgba(27, 94, 142, 0.9) !important; }
        .hover\\:text-primary:hover { color: var(--primary) !important; }
        .hover\\:text-primary\\/90:hover { color: rgba(27, 94, 142, 0.9) !important; }
        .bg-primary\\/10 { background-color: rgba(27, 94, 142, 0.1) !important; }
        .bg-primary\\/20 { background-color: rgba(27, 94, 142, 0.2) !important; }
        .border-primary\\/20 { border-color: rgba(27, 94, 142, 0.2) !important; }

        .text-secondary { color: var(--secondary) !important; }
        
        .text-green { color: var(--green) !important; }
        .bg-green { background-color: var(--green) !important; }

        .text-warning { color: var(--warning) !important; }
        .bg-warning { background-color: var(--warning) !important; }
        .hover\\:bg-warning\\/90:hover { background-color: rgba(247, 180, 6, 0.9) !important; }
        .hover\\:text-warning:hover { color: var(--warning) !important; }
        .hover\\:text-warning\\/90:hover { color: rgba(247, 180, 6, 0.9) !important; }
        .bg-warning\\/20 { background-color: rgba(247, 180, 6, 0.2) !important; }
        .border-warning\\/50 { border-color: rgba(247, 180, 6, 0.5) !important; }

        .text-cyan { color: var(--cyan) !important; }
        .bg-cyan { background-color: var(--cyan) !important; }
        .hover\\:bg-cyan\\/90:hover { background-color: rgba(64, 188, 213, 0.9) !important; }
        .hover\\:text-cyan:hover { color: var(--cyan) !important; }
        .hover\\:text-cyan\\/90:hover { color: rgba(64, 188, 213, 0.9) !important; }

        .bg-light-bg { background-color: var(--light-bg) !important; }

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
        .animate-progress { animation: progress 1.5s infinite linear; }
      `}</style>
    </div>
  );
};

const DashboardCard = ({ icon: Icon, title, value, color, detail }) => {
    const colorClasses = {
        primary: { bg: 'bg-primary/10', text: 'text-primary', iconBg: 'bg-primary' },
        secondary: { bg: 'bg-secondary/10', text: 'text-secondary', iconBg: 'bg-secondary' },
        green: { bg: 'bg-green/10', text: 'text-green', iconBg: 'bg-green' },
        warning: { bg: 'bg-warning/20', text: 'text-warning', iconBg: 'bg-warning' },
    };

    const c = colorClasses[color] || colorClasses.primary;

    return (
        <div className={`p-6 bg-white rounded-2xl shadow-xl border border-gray-200 transition-all hover:shadow-2xl`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${c.iconBg} text-white shadow-lg flex-shrink-0`}>
                    <Icon size={24} />
                </div>
            </div>
            <p className="text-xs mt-3 text-gray-400">{detail}</p>
        </div>
    );
};

export default AdminDashboard;