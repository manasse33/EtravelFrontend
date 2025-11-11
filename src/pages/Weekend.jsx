import React, { useState, useEffect } from 'react';
import { Globe, Menu, X, ArrowRight, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Calendar, Loader, AlertCircle, CheckCircle, Eye, Users, Clock, DollarSign, Info, XCircle } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
    <div className={`fixed top-20 right-4 z-50 max-w-md w-full ${colors[type]} border-l-4 rounded-r-xl p-4 shadow-2xl animate-slide-in`}>
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
          <Loader className="animate-spin h-16 w-16 text-blue-600" />
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

const OuikenacPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('RC');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const [formData, setFormData] = useState({
    reservable_id: '',
    type: 'ouikenac-package',
    full_name: '',
    email: '',
    phone: '',
    // date_from: '',
    // date_to: '',
    // travelers: '',
    currency: 'CFA',
    message: ''
  });

  // Configuration de l'API
  const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Notification
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  // Récupérer les packages au chargement
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/ouikenac');
      console.log('Packages récupérés:', response.data);
      const packagesData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setPackages(packagesData);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des packages:', err);
      setError('Impossible de charger les packages. Veuillez réessayer plus tard.');
      showNotification('Impossible de charger les packages. Veuillez réessayer plus tard.', 'error');
      setLoading(false);
    }
  };

  // Filtrer les packages par pays de départ
  const currentPackages = packages.filter(pkg => {
    if (selectedCountry === 'RC') {
      return pkg.departure_country?.code === 'RC';
    } else if (selectedCountry === 'RDC') {
      return pkg.departure_country?.code === 'rdc' || pkg.departure_country?.code === 'RDC';
    }
    return false;
  });

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.reservable_id) {
      showNotification('Veuillez sélectionner un package avant de réserver.', 'warning');
      return;
    }

    // if (!formData.full_name || !formData.email || !formData.travelers) {
    //   showNotification('Veuillez remplir tous les champs obligatoires.', 'warning');
    //   return;
    // }

    // if (parseInt(formData.travelers) < 1) {
    //   showNotification('Le nombre de voyageurs doit être au moins 1.', 'warning');
    //   return;
    // }

    try {
      setSubmitting(true);
      setError(null);
      
      const reservationData = {
        reservable_id: parseInt(formData.reservable_id),
        type: formData.type,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        // date_from: formData.date_from || null,
        // date_to: formData.date_to || null,
        // travelers: parseInt(formData.travelers),
        currency: formData.currency,
        message: formData.message
      };

      console.log('Envoi de la réservation:', reservationData);
      
      const response = await api.post('/reservations', reservationData);
      
      console.log('Réservation créée:', response.data);
      
      setSubmitSuccess(true);
      showNotification('Réservation envoyée avec succès ! Nous vous contacterons très bientôt.', 'success');
      
      // Réinitialiser le formulaire
      setFormData({
        reservable_id: '',
        type: 'ouikenac-package',
        full_name: '',
        email: '',
        phone: '',
        // date_from: '',
        // date_to: '',
        // travelers: '',
        currency: 'CFA',
        message: ''
      });

      // Masquer le message de succès après 5 secondes
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

    } catch (err) {
      console.error('Erreur lors de la réservation:', err);
      
      if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        showNotification(errors[0] || 'Erreur de validation', 'error');
      } else {
        showNotification(
          err.response?.data?.message || 'Erreur lors de l\'envoi de la réservation. Veuillez réessayer.', 
          'error'
        );
      }
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi de la réservation. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePackageSelect = (packageId) => {
    setFormData(prev => ({ 
      ...prev, 
      reservable_id: packageId,
      type: 'ouikenac-package'
    }));
    // Scroll vers le formulaire
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fonction pour voir les détails d'un package
  const handleViewDetails = async (pkg) => {
    try {
      setLoadingDetails(true);
      setSelectedPackage(pkg);
      setShowModal(true);
    } catch (err) {
      console.error('Erreur lors de la récupération des détails:', err);
      showNotification('Impossible de charger les détails du package.', 'error');
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Notification */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: '', type: '' })}
      />

      {/* Loading Overlay */}
      {submitting && <LoadingOverlay message="Envoi de votre réservation..." />}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <Globe className="text-blue-600" size={36} />
              <div>
                <h1 className="text-2xl font-black text-gray-900">e-TRAVEL WORLD</h1>
                <p className="text-xs text-gray-500 tracking-wider">AGENCY</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-10">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Accueil</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">À propos</Link>
              <Link to="/weekend" className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-500 transition-all hover:shadow-lg">
                  OUIKENAC
              </Link>
              <Link to="/city-tour" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">CityTour</Link>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
            </nav>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-900 p-2">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              <Link 
                to="/" 
                className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium border-b border-gray-100" 
                onClick={() => setMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/about" 
                className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium border-b border-gray-100" 
                onClick={() => setMenuOpen(false)}
              >
                A propos
              </Link>
              <Link 
                to="/weekend" 
                className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium border-b border-gray-100" 
                onClick={() => setMenuOpen(false)}
              >
                Ouikenac
              </Link>
              <Link 
                to="/city-tour" 
                className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium border-b border-gray-100" 
                onClick={() => setMenuOpen(false)}
              >
                CityTour
              </Link>
              <a href="#contact" className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium" onClick={() => setMenuOpen(false)}>Contactez-nous</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-96 mt-20 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center px-4">
              <div className="inline-block px-6 py-2 bg-yellow-400 rounded-full mb-6">
                <p className="text-gray-900 font-bold tracking-wider uppercase text-sm">Week-End au Congo</p>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-4">OUIKENAC</h2>
              <p className="text-xl text-white font-light">Découvrez les deux Congo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section id="apropos" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-200">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 text-center">
              Qu'est-ce que OUIKENAC ?
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Un seul peuple, une histoire partagée, des traditions partagées, des langues partagées. <strong className="text-gray-900">Week-End NA CONGO / Week-End AU CONGO</strong> a été pensé pour créer un pont entre les 2 capitales, les 2 pays, en permettant aux populations vivant sur chacune des rives de se mélanger, de se rapprocher le temps d'un week-end dans un mix de tourisme culturel, naturel et ludique.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong className="text-gray-900">OUIKENAC</strong> est un service dont le but est de contribuer au renforcement identitaire de la destination CONGO en proposant des offres ouvertes tous les week-ends dans un mix d'éco-tourisme, tourisme culturel, culinaire, etc.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Notre objectif : rendre uniques les week-ends des congolais, des expatriés et autres touristes au travers d'offres de découverte des plus beaux endroits de notre pays, surtout les plus insoupçonnés, de son histoire, de sa culture.
              </p>
            </div>
            <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl">
              <p className="text-xl font-bold text-gray-900 italic">
                Grâce à OUIKENAC, vos semaines ne seront plus jamais les mêmes ! ✨
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Country Selection & Packages */}
      <section id="packages" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12 text-center">
            Choisissez Votre Destination
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* République du Congo */}
            <div 
              onClick={() => setSelectedCountry('RC')}
              className={`group cursor-pointer bg-white rounded-2xl overflow-hidden border-2 transition-all hover:shadow-2xl hover:-translate-y-2 ${selectedCountry === 'RC' ? 'border-blue-600 shadow-xl' : 'border-gray-200'}`}
            >
              <div className="relative h-64">
                <img 
                  src="https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=800" 
                  alt="République du Congo" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-3xl font-black text-white mb-2">République du CONGO</h3>
                  <p className="text-white/90">Brazzaville</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  La République du CONGO compte 15 départements. Sa capitale est <strong>Brazzaville</strong> depuis le 25 novembre 1958. 
                  Sa monnaie est le Franc CFA.
                </p>
                <button 
                  onClick={() => setSelectedCountry('RC')}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  Voir les packages RC <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {/* République Démocratique du Congo */}
            <div 
              onClick={() => setSelectedCountry('RDC')}
              className={`group cursor-pointer bg-white rounded-2xl overflow-hidden border-2 transition-all hover:shadow-2xl hover:-translate-y-2 ${selectedCountry === 'RDC' ? 'border-green-600 shadow-xl' : 'border-gray-200'}`}
            >
              <div className="relative h-64">
                <img 
                  src="https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=800" 
                  alt="République Démocratique du Congo" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-3xl font-black text-white mb-2">République Démocratique du CONGO</h3>
                  <p className="text-white/90">Kinshasa</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  La RDC est le quatrième pays le plus peuplé d'Afrique (102 millions d'habitants). 
                  Découpée en 26 provinces. Monnaie : Franc Congolais.
                </p>
                <button 
                  onClick={() => setSelectedCountry('RDC')}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  Voir les packages RDC <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setSelectedCountry('RC')}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                selectedCountry === 'RC' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
              }`}
            >
              Packages RC
            </button>
            <button
              onClick={() => setSelectedCountry('RDC')}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                selectedCountry === 'RDC' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-600'
              }`}
            >
              Packages RDC
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <Loader className="animate-spin h-16 w-16 text-blue-600" />
                <div className="absolute inset-0 h-16 w-16 border-4 border-blue-200 rounded-full"></div>
              </div>
              <p className="text-gray-600 text-lg mt-6">Chargement des packages...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-8">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" size={24} />
                <div>
                  <h3 className="font-bold text-red-800 mb-1">Erreur</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
              <button 
                onClick={fetchPackages}
                className="mt-4 px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Packages Display */}
          {!loading && !error && (
            <div id="packages-list">
              <h3 className="text-3xl font-black text-gray-900 mb-8 text-center">
                Nos Packages OUIKENAC - {selectedCountry === 'RC' ? 'République du Congo' : 'République Démocratique du Congo'}
              </h3>
              
              {currentPackages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                  <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 text-lg">Aucun package disponible pour cette destination pour le moment.</p>
                  <button 
                    onClick={fetchPackages}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Réessayer
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentPackages.map((pkg) => (
                    <div key={pkg.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all hover:-translate-y-2">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={pkg.image ? `http://127.0.0.1:8000/storage/${pkg.image}` : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'} 
                          alt={pkg.title} 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${selectedCountry === 'RC' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                            {pkg.departure_country?.name || selectedCountry}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${pkg.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                            {pkg.active ? 'Disponible' : 'Indisponible'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-2xl font-black text-gray-900 mb-3">{pkg.title}</h4>
                        <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description || 'Découvrez ce package unique'}</p>
                        
                        {/* Informations du trajet */}
                        {pkg.departure_country && pkg.arrival_country && (
                          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                            <MapPin size={16} className="text-blue-600" />
                            <span>
                              {pkg.departure_country.name} → {pkg.arrival_country.name}
                            </span>
                          </div>
                        )}

                        {/* Nombre de personnes */}
                        {pkg.min_people && (
                          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                            <Users size={16} className="text-blue-600" />
                            <span>
                              {pkg.min_people} - {pkg.max_people || '+'} personnes
                            </span>
                          </div>
                        )}
                        
                        {/* Affichage des prix */}
                        {pkg.prices && pkg.prices.length > 0 && (
                          <div className="space-y-2 mb-4">
                            {pkg.prices.map((price, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
                                <span className="text-gray-700">
                                  {price.min_people} {price.max_people ? `- ${price.max_people}` : '+'} pers.
                                </span>
                                <span className="font-bold text-gray-900">{formatPrice(price.price)} {price.currency}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div>
                            {pkg.prices && pkg.prices[0] && (
                              <div>
                                <p className="text-sm text-gray-500">À partir de</p>
                                <p className="text-2xl font-black text-blue-600">
                                  {formatPrice(pkg.prices[0].price)} <span className="text-sm font-bold">{pkg.prices[0].currency}</span>
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleViewDetails(pkg)}
                              disabled={loadingDetails}
                              className="px-3 py-2 bg-gray-100 text-gray-700 font-bold rounded-full text-sm hover:bg-gray-200 transition-all flex items-center gap-1"
                              title="Voir les détails"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handlePackageSelect(pkg.id)}
                              disabled={!pkg.active}
                              className={`px-4 py-2 ${pkg.active ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-gray-300 cursor-not-allowed'} text-gray-900 font-bold rounded-full text-sm transition-all`}
                            >
                              {pkg.active ? 'Réserver' : 'Indisponible'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Reservation Form Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12 text-center">
            Réservez Votre Week-End
          </h2>

          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl mb-8 animate-pulse">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={24} />
                <div>
                  <h3 className="font-bold text-green-800 mb-1">Réservation envoyée avec succès !</h3>
                  <p className="text-green-700">Nous vous contacterons très bientôt pour confirmer votre réservation.</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row gap-12 bg-gray-50 p-8 rounded-2xl shadow-xl border border-gray-200">
            
            {/* Contact Info */}
            <div className="lg:w-1/3 space-y-8">
              <h3 className="text-2xl font-black text-gray-900">Contactez-nous</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone size={24} className="text-blue-600" />
                  <div>
                    <p className="text-gray-500 text-sm">Téléphone</p>
                    <p className="font-semibold text-gray-800">+242 06 871 13 78</p>
                    <p className="font-semibold text-gray-800">+242 05 594 94 64</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail size={24} className="text-blue-600" />
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="font-semibold text-gray-800">worldagencyetravel@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin size={24} className="text-blue-600" />
                  <div>
                    <p className="text-gray-500 text-sm">Adresse</p>
                    <p className="font-semibold text-gray-800">Brazzaville, CONGO</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors"><Facebook size={24} /></a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors"><Instagram size={24} /></a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors"><Twitter size={24} /></a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors"><Linkedin size={24} /></a>
              </div>
            </div>

            {/* Reservation Form */}
            <form onSubmit={handleSubmit} className="lg:w-2/3 space-y-6">
              <h3 className="text-2xl font-black text-gray-900">Formulaire de Réservation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                  <input 
                    type="text" 
                    name="full_name" 
                    id="full_name" 
                    required 
                    value={formData.full_name} 
                    onChange={handleInputChange} 
                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    required 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    id="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="+242 06 XXX XX XX"
                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label htmlFor="reservable_id" className="block text-sm font-medium text-gray-700 mb-1">Package *</label>
                  <select 
                    name="reservable_id" 
                    id="reservable_id" 
                    required 
                    value={formData.reservable_id} 
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Sélectionnez un package</option>
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.id} disabled={!pkg.active}>
                        {pkg.title} - {pkg.departure_country?.name} → {pkg.arrival_country?.name}
                        {pkg.prices && pkg.prices[0] && ` (${formatPrice(pkg.prices[0].price)} ${pkg.prices[0].currency})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 mb-1">Date de départ</label>
                  <input 
                    type="date" 
                    name="date_from" 
                    id="date_from" 
                    value={formData.date_from} 
                    onChange={handleInputChange} 
                    min={new Date().toISOString().split('T')[0]}
                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 mb-1">Date de retour</label>
                  <input 
                    type="date" 
                    name="date_to" 
                    id="date_to" 
                    value={formData.date_to} 
                    onChange={handleInputChange} 
                    min={formData.date_from || new Date().toISOString().split('T')[0]}
                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* <div>
                  <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">Nombre de Voyageurs *</label>
                  <input 
                    type="number" 
                    name="travelers" 
                    id="travelers" 
                    min="1" 
                    required 
                    value={formData.travelers} 
                    onChange={handleInputChange} 
                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div> */}
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                  <select 
                    name="currency" 
                    id="currency" 
                    value={formData.currency} 
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="CFA">CFA</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message / Demandes spécifiques</label>
                <textarea 
                  name="message" 
                  id="message" 
                  rows="4" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Ajoutez vos demandes spécifiques ici..."
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer la Réservation <Calendar size={20} />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-900 text-2xl md:text-3xl mb-4 font-light">
            Réservez votre <strong className="font-black">OUIKENAC</strong> maintenant
          </p>
          <p className="text-7xl md:text-8xl font-black text-gray-900 mb-4">20%</p>
          <p className="text-3xl md:text-4xl font-black text-gray-900 mb-6">DE RÉDUCTION</p>
          <p className="text-gray-800 text-lg mb-8">Pour les 100 premiers inscrits</p>
          <a href="#packages" className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 text-white font-bold text-lg rounded-full hover:bg-gray-800 transition-all hover:shadow-2xl hover:scale-105">
            Voir les packages <ArrowRight size={24} />
          </a>
        </div>
      </section>

      {/* Modal Détails Package */}
      {showModal && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header Modal */}
            <div className="relative h-64 overflow-hidden rounded-t-2xl">
              <img 
                src={selectedPackage.image ? `http://127.0.0.1:8000/storage/${selectedPackage.image}` : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'} 
                alt={selectedPackage.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all"
              >
                <X size={24} className="text-gray-900" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${selectedPackage.departure_country?.code === 'RC' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                    {selectedPackage.departure_country?.name || 'Départ'}
                  </span>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-400 text-gray-900">
                    {selectedPackage.arrival_country?.name || 'Arrivée'}
                  </span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${selectedPackage.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                    {selectedPackage.active ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
                <h2 className="text-4xl font-black text-white mb-2">{selectedPackage.title}</h2>
              </div>
            </div>

            {/* Content Modal */}
            <div className="p-8">
              {/* Description */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="text-blue-600" size={20} />
                  <h3 className="text-xl font-bold text-gray-900">Description</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{selectedPackage.description || 'Découvrez ce package unique qui vous permettra de vivre une expérience inoubliable au Congo.'}</p>
              </div>

              {/* Itinéraire */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="text-blue-600" size={20} />
                  <h3 className="text-xl font-bold text-gray-900">Itinéraire</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <p className="text-sm text-gray-500 mb-1">Départ</p>
                      <p className="font-bold text-gray-900">{selectedPackage.departure_country?.name}</p>
                      <p className="text-sm text-gray-600">{selectedPackage.departure_city_id ? `Ville ID: ${selectedPackage.departure_city_id}` : ''}</p>
                    </div>
                    <ArrowRight className="text-blue-600 mx-4" size={24} />
                    <div className="text-center flex-1">
                      <p className="text-sm text-gray-500 mb-1">Arrivée</p>
                      <p className="font-bold text-gray-900">{selectedPackage.arrival_country?.name}</p>
                      <p className="text-sm text-gray-600">{selectedPackage.arrival_city_id ? `Ville ID: ${selectedPackage.arrival_city_id}` : ''}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capacité */}
              {selectedPackage.min_people && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="text-blue-600" size={20} />
                    <h3 className="text-xl font-bold text-gray-900">Capacité</h3>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <p className="text-gray-900">
                      <span className="font-bold text-blue-600 text-2xl">{selectedPackage.min_people}</span> 
                      {selectedPackage.max_people && (
                        <> à <span className="font-bold text-blue-600 text-2xl">{selectedPackage.max_people}</span></>
                      )}
                      {!selectedPackage.max_people && '+'}
                      <span className="text-gray-700"> personnes</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Tarifs */}
              {selectedPackage.prices && selectedPackage.prices.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="text-green-600" size={20} />
                    <h3 className="text-xl font-bold text-gray-900">Tarifs</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedPackage.prices.map((price, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3">
                          <Users className="text-gray-600" size={20} />
                          <div>
                            <p className="font-bold text-gray-900">
                              {price.min_people} {price.max_people ? `- ${price.max_people}` : '+'} personnes
                            </p>
                            <p className="text-sm text-gray-500">Par personne</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-blue-600">
                            {formatPrice(price.price)}
                          </p>
                          <p className="text-sm font-bold text-gray-600">{price.currency}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Informations supplémentaires */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-8">
                <div className="flex items-start gap-3">
                  <Clock className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-2">Informations importantes</h4>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>• Réservation obligatoire 48h à l'avance</li>
                      <li>• Annulation gratuite jusqu'à 24h avant le départ</li>
                      <li>• Guides professionnels certifiés</li>
                      <li>• Transport inclus depuis/vers votre hôtel</li>
                      <li>• Assurance voyage recommandée</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-4">
                <button 
                  onClick={closeModal}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Fermer
                </button>
                <button 
                  onClick={() => {
                    handlePackageSelect(selectedPackage.id);
                    closeModal();
                  }}
                  disabled={!selectedPackage.active}
                  className={`flex-1 py-3 ${selectedPackage.active ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-gray-300 cursor-not-allowed'} text-gray-900 font-bold rounded-lg transition-all flex items-center justify-center gap-2`}
                >
                  {selectedPackage.active ? (
                    <>
                      Réserver ce package <ArrowRight size={20} />
                    </>
                  ) : (
                    'Package indisponible'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="text-blue-400" size={32} />
                <div>
                  <h3 className="text-xl font-black">e-TRAVEL WORLD</h3>
                  <p className="text-xs text-gray-400">AGENCY</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">Votre partenaire voyage de confiance depuis 2019. Excellence et innovation à votre service.</p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Navigation</h3>
              <div className="space-y-3">
                <Link to="/" className="block text-gray-400 hover:text-white transition-colors">Accueil</Link>
                <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">À propos</Link>
                <a href="#packages" className="block text-gray-400 hover:text-white transition-colors">Packages</a>
                <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Informations</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Politique de confidentialité</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Conditions générales</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">FAQ</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Contact</h3>
              <div className="space-y-4">
                <a href="tel:+24206871137" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Phone size={18} />
                  <span>(+242) 06 871 13 78</span>
                </a>
                <a href="tel:+24205594946" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Phone size={18} />
                  <span>(+242) 05 594 94 64</span>
                </a>
                <a href="mailto:worldagencyetravel@gmail.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Mail size={18} />
                  <span className="text-sm">worldagencyetravel@gmail.com</span>
                </a>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin size={18} />
                  <span>Brazzaville, CONGO</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                © 2025 e-TRAVEL WORLD AGENCY. Tous droits réservés.
              </p>
              <p className="text-gray-500 text-sm">
                Créé avec passion par <span className="font-bold text-white">ELBO</span>
              </p>
            </div>
          </div>
        </div>
      </footer>

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

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default OuikenacPage;