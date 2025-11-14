import React, { useState, useEffect } from 'react';
import { Globe, Menu, X, ArrowRight, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Calendar, Loader, AlertCircle, CheckCircle, Eye, Users, Clock, DollarSign, Info, XCircle } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// ============= COMPOSANTS RÉUTILISABLES =============

const Notification = ({ show, message, type, onClose }) => {
  if (!show) return null;

  const configs = {
    success: {
      icon: <CheckCircle size={24} />,
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-800',
      iconColor: 'text-green-500',
      title: 'Succès'
    },
    error: {
      icon: <XCircle size={24} />,
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-800',
      iconColor: 'text-red-500',
      title: 'Erreur'
    },
    warning: {
      icon: <AlertCircle size={24} />,
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-500',
      title: 'Attention'
    }
  };

  const config = configs[type];

  return (
    <div className={`fixed top-20 right-4 z-50 max-w-md w-full ${config.bg} ${config.border} ${config.text} border-l-4 rounded-r-xl p-4 shadow-2xl animate-slide-in`}>
      <div className="flex items-start gap-3">
        <div className={config.iconColor}>{config.icon}</div>
        <div className="flex-1">
          <p className="font-semibold mb-1">{config.title}</p>
          <p className="text-sm">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

const LoadingOverlay = ({ message = 'Chargement...' }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
      <div className="flex flex-col items-center">
        <div className="relative">
          <Loader className="animate-spin h-16 w-16 text-primary" />
          <div className="absolute inset-0 h-16 w-16 border-4 border-primary/20 rounded-full"></div>
        </div>
        <p className="text-gray-700 font-semibold text-lg mt-6">{message}</p>
        <div className="w-full bg-gray-200 rounded-full h-1 mt-4 overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  </div>
);

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    green: 'bg-green text-white hover:bg-green/90',
    warning: 'bg-warning text-gray-900 hover:bg-warning/90'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`font-bold rounded-full transition-all hover:shadow-xl hover:scale-105 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const PackageCard = ({ pkg, selectedCountry, onSelect, onViewDetails, formatPrice, loadingDetails }) => (
  <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:shadow-2xl transition-all hover:-translate-y-2">
    <div className="relative h-48 overflow-hidden">
      <img 
        src={pkg.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'} 
        alt={pkg.title} 
        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute top-4 left-4">
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${selectedCountry === 'RC' ? 'bg-primary text-white' : 'bg-green text-white'}`}>
          {pkg.departure_country?.name || selectedCountry}
        </span>
      </div>
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${pkg.active ? 'bg-green text-white' : 'bg-gray-500 text-white'}`}>
          {pkg.active ? 'Disponible' : 'Indisponible'}
        </span>
      </div>
    </div>
    
    <div className="p-6">
      <h4 className="text-2xl font-black text-gray-900 mb-3">{pkg.title}</h4>
      <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description || 'Découvrez ce package unique'}</p>
      
      {pkg.departure_country && pkg.arrival_country && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <MapPin size={16} className="text-primary" />
          <span>
            {pkg.departure_country.name} → {pkg.arrival_country.name}
          </span>
        </div>
      )}

      {pkg.min_people && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <Users size={16} className="text-primary" />
          <span>
            {pkg.min_people} - {pkg.max_people || '+'} personnes
          </span>
        </div>
      )}
      
      {pkg.prices && pkg.prices.length > 0 && (
        <div className="space-y-2 mb-4">
          {pkg.prices.map((price, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm bg-light-bg p-3 rounded-lg">
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
              <p className="text-2xl font-black text-primary">
                {formatPrice(pkg.prices[0].price)} <span className="text-sm font-bold">{pkg.prices[0].currency}</span>
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onViewDetails(pkg)}
            disabled={loadingDetails}
            className="px-3 py-2 bg-gray-100 text-gray-700 font-bold rounded-full text-sm hover:bg-gray-200 transition-all flex items-center gap-1"
            title="Voir les détails"
          >
            <Eye size={16} />
          </button>
          <Button 
            onClick={() => onSelect(pkg.id)}
            disabled={!pkg.active}
            variant={pkg.active ? 'warning' : 'outline'}
            size="sm"
            className={`${!pkg.active && 'bg-gray-300 cursor-not-allowed hover:scale-100'}`}
          >
            {pkg.active ? 'Réserver' : 'Indisponible'}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// ============= COMPOSANT PRINCIPAL =============

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
    currency: 'CFA',
    message: ''
  });

  const api = axios.create({
    baseURL: 'https://etravelbackend-production.up.railway.app/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/ouikenac');
      console.log('Packages récupérés:', response.data);
      // console.log(departure_country?.code); // Removed this line: departure_country is not defined here
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

 const currentPackages = packages.filter(pkg => {
    const code = pkg.departure_country?.code;

    if (!code) return false; // Sécurité : ignorer si le code pays est manquant

    // Normaliser le code du pays en majuscules pour une comparaison cohérente
    const normalizedCode = code.toUpperCase(); 
    
    if (selectedCountry === 'RC') {
      return normalizedCode === 'RC'; // Le filtre est maintenant insensible à la casse pour 'RC', 'rc', 'Rc', etc.
    } else if (selectedCountry === 'RDC') {
      return normalizedCode === 'RDC'; // Simplifie également le filtre pour 'RDC'
    }
    
    return false;
  });
  

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reservable_id) {
      showNotification('Veuillez sélectionner un package avant de réserver.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const reservationData = {
        reservable_id: parseInt(formData.reservable_id),
        type: formData.type,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        currency: formData.currency,
        message: formData.message
      };

      console.log('Envoi de la réservation:', reservationData);
      
      const response = await api.post('/reservations', reservationData);
      
      console.log('Réservation créée:', response.data);
      
      setSubmitSuccess(true);
      showNotification('Réservation envoyée avec succès ! Nous vous contacterons très bientôt.', 'success');
      
      setFormData({
        reservable_id: '',
        type: 'ouikenac-package',
        full_name: '',
        email: '',
        phone: '',
        currency: 'CFA',
        message: ''
      });

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
          err.response?.data?.message || 'Une erreur est survenue lors de l\'envoi de la réservation.', 
          'error'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectPackage = (packageId) => {
    setFormData(prev => ({ ...prev, reservable_id: packageId }));
    const pkg = packages.find(p => p.id === packageId);
    showNotification(`Package "${pkg.title}" sélectionné pour la réservation.`, 'success');
    // Scroll to form
    const formElement = document.getElementById('reservation-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchPackageDetails = async (pkg) => {
    setLoadingDetails(true);
    try {
      const response = await api.get(`/ouikenac/${pkg.id}`);
      setSelectedPackage(response.data);
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
      <Notification 
        show={notification.show} 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ show: false, message: '', type: '' })} 
      />
      {submitting && <LoadingOverlay message="Envoi de votre réservation..." />}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <img src="logoetravel.jpg" alt="Logo e-Travel World" width={70}/>
              <div>
                <h1 className="text-2xl font-black text-gray-900">e-TRAVEL WORLD</h1>
                <p className="text-xs text-gray-500 tracking-wider">AGENCY</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-10">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Accueil</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">À propos</Link>
              <Link to="/weekend" className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full transition-all hover:bg-yellow-500 hover:shadow-lg">
                OUIKENAC
              </Link>
            </nav>
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="md:hidden text-gray-700 hover:text-blue-600"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed top-20 left-0 right-0 z-40 bg-white shadow-xl md:hidden transition-transform duration-300 ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <nav className="flex flex-col space-y-4 p-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium pb-2 border-b border-gray-100" onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium pb-2 border-b border-gray-100" onClick={() => setMenuOpen(false)}>À propos</Link>
          <Link to="/weekend" className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full text-center transition-all hover:bg-yellow-500 hover:shadow-lg" onClick={() => setMenuOpen(false)}>
            OUIKENAC
          </Link>
        </nav>
      </div>
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[600px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1510414842594-b258387532a7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Paysage du Congo"
            className="w-full h-full object-cover brightness-[.65]"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center p-8 max-w-4xl">
              <p className="text-yellow-400 text-xl font-bold mb-4">LE WEEK-END DE VOS RÊVES</p>
              <h2 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
                OUIKENAC <span className="text-yellow-400">by e-TRAVEL</span>
              </h2>
              <p className="text-xl text-gray-200 mb-8">
                Des packages touristiques uniques pour un week-end d'évasion entre la République du Congo (RC) et la République Démocratique du Congo (RDC).
              </p>
              <a href="#packages">
                <Button variant="warning" size="lg" className="flex items-center justify-center gap-2 mx-auto">
                  Découvrir les Packages <ArrowRight size={24} />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-black text-gray-900 mb-4">Qu'est-ce que OUIKENAC ?</h2>
              <p className="text-lg text-gray-600">Le concept qui réinvente vos week-ends.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522204523234-8729aa6e993e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Pont entre les capitales" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/40 flex items-end p-6">
                  <h3 className="text-3xl font-black text-white">Le pont entre les deux Congos</h3>
                </div>
              </div>
              <div>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Le concept **OUIKENAC** a été pensé pour créer un pont entre les 2 capitales, les 2 pays, en permettant aux populations vivant sur chacune des rives de se mélanger, de se rapprocher le temps d'un week-end dans un mix de tourisme culturel, naturel et ludique.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  <strong className="text-gray-900">OUIKENAC</strong> est un service dont le but est de contribuer au renforcement identitaire de la destination CONGO en proposant des offres ouvertes tous les week-ends dans un mix d'éco-tourisme, tourisme culturel, culinaire, etc.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Notre objectif : rendre uniques les week-ends des congolais, des expatriés et autres touristes au travers d'offres de découverte des plus beaux endroits de notre pays, surtout les plus insoupçonnés, de son histoire, de sa culture.
                </p>
                <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-warning rounded-r-xl">
                  <p className="text-xl font-bold text-gray-900 italic">
                    Grâce à OUIKENAC, vos semaines ne seront plus jamais les mêmes ! ✨
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Country Selection & Packages */}
        <section id="packages" className="py-20 px-4 bg-light-bg">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-4">Nos Packages Week-end</h2>
              <p className="text-lg text-gray-600">Choisissez votre destination et évadez-vous pour un week-end inoubliable.</p>
            </div>

            {/* Country Info Cards (for visibility) */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-t-4 border-primary">
                <div className="p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-3 flex items-center gap-2">
                    <Globe size={24} className="text-primary" /> République du Congo (RC)
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Le Congo, aussi appelé Congo-Brazzaville, est réputé pour sa forêt équatoriale et sa faune. C'est le berceau de l'écotourisme en Afrique centrale. Monnaie : Franc CFA.
                  </p>
                  <Button 
                    onClick={() => setSelectedCountry('RC')} 
                    variant="primary" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    Voir les packages RC <ArrowRight size={20} />
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-t-4 border-green">
                <div className="p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-3 flex items-center gap-2">
                    <Globe size={24} className="text-green" /> Rép. Démocratique du Congo (RDC)
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    La RDC est le quatrième pays le plus peuplé d'Afrique (102 millions d'habitants). Découpée en 26 provinces. Monnaie : Franc Congolais.
                  </p>
                  <Button 
                    onClick={() => setSelectedCountry('RDC')} 
                    variant="green" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    Voir les packages RDC <ArrowRight size={20} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center gap-4 mb-12">
              <button 
                onClick={() => setSelectedCountry('RC')} 
                className={`px-8 py-3 rounded-full font-bold transition-all ${
                  selectedCountry === 'RC' ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
                }`}
              >
                Packages RC
              </button>
              <button 
                onClick={() => setSelectedCountry('RDC')} 
                className={`px-8 py-3 rounded-full font-bold transition-all ${
                  selectedCountry === 'RDC' ? 'bg-green text-white shadow-lg' : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green'
                }`}
              >
                Packages RDC
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <Loader className="animate-spin h-16 w-16 text-primary" />
                  <div className="absolute inset-0 h-16 w-16 border-4 border-primary/20 rounded-full"></div>
                </div>
                <p className="text-gray-700 font-semibold text-lg mt-6">Chargement des packages...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-20 bg-red-100 rounded-2xl border border-red-300">
                <XCircle size={48} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-red-800">Erreur de chargement</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Packages Grid */}
            {!loading && !error && currentPackages.length === 0 && (
              <div className="text-center py-20 bg-yellow-100 rounded-2xl border border-yellow-300">
                <Info size={48} className="text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-yellow-800">Aucun package disponible</h3>
                <p className="text-yellow-700">Il n'y a actuellement aucun package OUIKENAC pour la zone {selectedCountry}.</p>
              </div>
            )}

            {!loading && !error && currentPackages.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPackages.map(pkg => (
                  <PackageCard 
                    key={pkg.id} 
                    pkg={pkg}
                    selectedCountry={selectedCountry}
                    onSelect={handleSelectPackage}
                    onViewDetails={fetchPackageDetails}
                    formatPrice={formatPrice}
                    loadingDetails={loadingDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Reservation Form */}
        <section id="reservation-form" className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-900 mb-4">Réservez Votre Package</h2>
              <p className="text-lg text-gray-600">
                Sélectionnez un package ci-dessus et remplissez ce formulaire pour valider votre réservation.
              </p>
            </div>
            
            {submitSuccess && (
              <div className="p-6 mb-8 bg-green-50 rounded-2xl border border-green-300">
                <div className="flex items-start gap-4">
                  <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-green-800 mb-1">Réservation envoyée !</h3>
                    <p className="text-green-700">Merci. Notre équipe vous contactera très bientôt pour confirmer votre réservation.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-12 bg-light-bg p-8 rounded-2xl shadow-xl border-2 border-primary/20">
              {/* Contact Info */}
              <div className="lg:w-1/3 space-y-8">
                <h3 className="text-2xl font-black text-gray-900">Contactez-nous</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Phone size={24} className="text-primary" />
                    <div>
                      <p className="text-gray-500 text-sm">Téléphone</p>
                      <p className="font-semibold text-gray-800">+242 06 871 13 78</p>
                      <p className="font-semibold text-gray-800">+242 05 594 94 64</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail size={24} className="text-primary" />
                    <div>
                      <p className="text-gray-500 text-sm">Email</p>
                      <p className="font-semibold text-gray-800">worldagencyetravel@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin size={24} className="text-primary" />
                    <div>
                      <p className="text-gray-500 text-sm">Adresse</p>
                      <p className="font-semibold text-gray-800">Brazzaville, CONGO</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all" aria-label="Facebook">
                    <Facebook size={18} className="text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all" aria-label="Instagram">
                    <Instagram size={18} className="text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all" aria-label="Twitter">
                    <Twitter size={18} className="text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-all" aria-label="LinkedIn">
                    <Linkedin size={18} className="text-white" />
                  </a>
                </div>
              </div>
              
              {/* Form */}
              <div className="lg:w-2/3">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-4">Informations Personnelles</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                      <input 
                        type="text" 
                        id="full_name" 
                        name="full_name" 
                        value={formData.full_name} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-primary focus:border-primary" 
                        placeholder="Votre nom et prénom"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-primary focus:border-primary" 
                        placeholder="votre.email@exemple.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-primary focus:border-primary" 
                      placeholder="+242 0x xxx xx xx"
                    />
                  </div>
                  <div className="p-4 bg-warning/20 border border-warning/50 rounded-xl">
                    <label htmlFor="reservable_id" className="block text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
                      <Info size={16} className="text-warning" /> Package Sélectionné (ID)
                    </label>
                    <input 
                      type="text" 
                      id="reservable_id" 
                      name="reservable_id" 
                      value={formData.reservable_id} 
                      readOnly 
                      required 
                      className="w-full p-3 border border-warning bg-white rounded-xl font-bold text-gray-900 cursor-default" 
                      placeholder="Sélectionnez un package ci-dessus"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message (optionnel)</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleInputChange} 
                      rows="4" 
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-primary focus:border-primary" 
                      placeholder="Ajoutez vos demandes spécifiques ici..."
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={submitting} 
                    variant="primary" 
                    size="lg" 
                    className="w-full flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100" 
                  >
                    {submitting ? (
                      <>
                        <Loader className="animate-spin" size={20} /> Envoi en cours...
                      </>
                    ) : (
                      <> 
                        Envoyer la Réservation <Calendar size={20} />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Promo Banner */}
        <section className="py-20 px-4 bg-green-ouik">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-white text-2xl md:text-3xl mb-4 font-light">
              Réservez votre <strong className="font-black">OUIKENAC</strong> maintenant
            </p>
            <p className="text-7xl md:text-8xl font-black text-white mb-4">20%</p>
            <p className="text-3xl md:text-4xl font-black text-white mb-6">DE RÉDUCTION</p>
            <p className="text-green-100 text-lg mb-8">Pour les 100 premiers inscrits</p>
            <a href="#packages" className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 text-white font-bold text-lg rounded-full hover:bg-gray-800 transition-all hover:shadow-2xl hover:scale-105">
              Voir les packages <ArrowRight size={24} />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img src="logoetravel.jpg" alt="Logo e-Travel World" width={40}/>
              <div>
                <h3 className="text-xl font-black">e-TRAVEL WORLD</h3>
                <p className="text-xs text-gray-400">AGENCY</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Votre agence de voyage pour des week-ends uniques entre le Congo et la RDC.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Navigation</h3>
            <div className="space-y-3">
              <a href="/" className="text-gray-400 hover:text-white transition-colors block">Accueil</a>
              <a href="/about" className="text-gray-400 hover:text-white transition-colors block">À propos</a>
              <a href="#packages" className="text-gray-400 hover:text-white transition-colors block">Packages</a>
              <a href="#reservation-form" className="text-gray-400 hover:text-white transition-colors block">Réservation</a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Contact</h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 text-gray-400">
                <Phone size={16} className="text-primary" /> +242 06 871 13 78
              </p>
              <p className="flex items-center gap-2 text-gray-400">
                <Mail size={16} className="text-primary" /> worldagencyetravel@gmail.com
              </p>
              <p className="flex items-start gap-2 text-gray-400">
                <MapPin size={16} className="text-primary mt-1" /> Brazzaville, CONGO
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Suivez-nous</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-all" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} e-TRAVEL WORLD. Tous droits réservés.
          </p>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedPackage && showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-zoom-in" onClick={e => e.stopPropagation()}>
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 z-10 text-gray-700"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>
            
            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <img 
                src={selectedPackage.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'} 
                alt={selectedPackage.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <h2 className="absolute bottom-0 left-0 p-6 text-4xl font-black text-white">{selectedPackage.title}</h2>
            </div>

            <div className="p-8 space-y-8">
              {/* Description */}
              <div className="border-b pb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="text-primary" size={20} />
                  <h3 className="text-xl font-bold text-gray-900">Détails du Package</h3>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedPackage.description}</p>
              </div>

              {/* Infos Clés */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 border-b pb-6">
                <div className="flex flex-col items-center p-3 bg-light-bg rounded-xl">
                  <Clock size={24} className="text-primary mb-1" />
                  <p className="text-sm text-gray-500">Durée</p>
                  <p className="font-bold text-gray-900">{selectedPackage.duration || 'N/A'}</p>
                </div>
                <div className="flex flex-col items-center p-3 bg-light-bg rounded-xl">
                  <Calendar size={24} className="text-primary mb-1" />
                  <p className="text-sm text-gray-500">Période</p>
                  <p className="font-bold text-gray-900">{selectedPackage.period || 'Week-end'}</p>
                </div>
                <div className="flex flex-col items-center p-3 bg-light-bg rounded-xl">
                  <Globe size={24} className="text-primary mb-1" />
                  <p className="text-sm text-gray-500">Départ</p>
                  <p className="font-bold text-gray-900">{selectedPackage.departure_country?.name}</p>
                </div>
                <div className="flex flex-col items-center p-3 bg-light-bg rounded-xl">
                  <MapPin size={24} className="text-primary mb-1" />
                  <p className="text-sm text-gray-500">Arrivée</p>
                  <p className="font-bold text-gray-900">{selectedPackage.arrival_country?.name}</p>
                </div>
              </div>

              {/* Capacité */}
              {selectedPackage.min_people && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="text-primary" size={20} />
                    <h3 className="text-xl font-bold text-gray-900">Capacité</h3>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-primary/30">
                    <p className="text-gray-900">
                      <span className="font-bold text-primary text-2xl">{selectedPackage.min_people}</span> 
                      {selectedPackage.max_people && (
                        <> à <span className="font-bold text-primary text-2xl">{selectedPackage.max_people}</span></>
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
                    <DollarSign className="text-green" size={20} />
                    <h3 className="text-xl font-bold text-gray-900">Tarifs</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedPackage.prices.map((price, idx) => (
                      <div key={idx} className="flex items-center justify-between text-lg p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-gray-700 font-medium">
                          {price.min_people} {price.max_people ? `- ${price.max_people}` : '+'} personne(s)
                        </span>
                        <span className="text-2xl font-black text-primary">
                          {formatPrice(price.price)} <span className="text-sm font-bold">{price.currency}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button 
                  onClick={closeModal} 
                  variant="outline"
                  className="bg-white"
                >
                  Fermer
                </Button>
                <Button 
                  onClick={() => { 
                    handleSelectPackage(selectedPackage.id); 
                    closeModal(); 
                  }}
                  variant="warning"
                >
                  Réserver ce Package
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tailwind CSS Variables (for local development/extension support) */}
      <style jsx global>{`
        :root {
          --primary: #2563eb; /* blue-600 */
          --secondary: #10b981; /* emerald-500 */
          --green: #10b981; /* emerald-500 */
          --warning: #facc15; /* yellow-400 */
          --light-bg: #f3f4f6; /* gray-100 */
        }
        
        .bg-green-ouik {
          background-color: var(--green);
        }

        .text-primary {
          color: var(--primary);
        }

        .bg-primary {
          background-color: var(--primary);
        }

        .border-primary {
          border-color: var(--primary);
        }

        .hover\\:bg-primary:hover {
          background-color: var(--primary);
        }

        .hover\\:text-primary:hover {
          color: var(--primary);
        }

        .focus\\:ring-primary:focus {
          --tw-ring-color: var(--primary);
        }

        .focus\\:border-primary:focus {
          border-color: var(--primary);
        }

        .text-secondary {
          color: var(--secondary);
        }

        .bg-secondary {
          background-color: var(--secondary);
        }

        .text-green {
          color: var(--green);
        }

        .bg-green {
          background-color: var(--green);
        }

        .hover\\:border-green:hover {
          border-color: var(--green);
        }

        .text-warning {
          color: var(--warning);
        }

        .bg-warning {
          background-color: var(--warning);
        }

        .border-warning {
          border-color: var(--warning);
        }

        .bg-light-bg {
          background-color: var(--light-bg);
        }

        .animate-progress {
          animation: progress-bar 1.5s infinite linear;
        }

        @keyframes progress-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }

        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .animate-zoom-in {
          animation: zoom-in 0.3s ease-out forwards;
        }

        @keyframes zoom-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

      `}</style>
    </div>
  );
};

export default OuikenacPage;