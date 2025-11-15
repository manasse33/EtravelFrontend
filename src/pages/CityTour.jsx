import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Calendar, MapPin, Clock, Users, Award, Star, Facebook, Instagram, Twitter, Linkedin, Phone, Mail, ArrowRight, Building2, Landmark, Navigation, Loader, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Composant Button réutilisable (pour garantir la cohérence des styles)
const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 hover:shadow-primary-lg',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 hover:shadow-secondary-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    green: 'bg-green text-white hover:bg-green/90 hover:shadow-green-lg',
    warning: 'bg-warning text-gray-900 hover:bg-warning/90 hover:shadow-warning-lg'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`font-bold rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};


// Composant de notification moderne
const Notification = ({ show, message, type, onClose }) => {
  if (!show) return null;

  const icons = {
    success: <CheckCircle size={24} />,
    error: <XCircle size={24} />,
    warning: <AlertCircle size={24} />
  };

  // Les couleurs des notifications sont conservées pour leur sémantique standard (vert, rouge, jaune)
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
          {/* Couleur primaire du loader */}
          <Loader className="animate-spin h-16 w-16 text-primary" />
          {/* Couleur d'opacité de la couleur primaire */}
          <div className="absolute inset-0 h-16 w-16 border-4 border-primary/20 rounded-full"></div>
        </div>
        <p className="text-gray-700 font-semibold text-lg mt-6">{message}</p>
        <div className="w-full bg-gray-200 rounded-full h-1 mt-4 overflow-hidden">
          {/* Couleur primaire de la barre de progression */}
          <div className="h-full bg-primary rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  </div>
);

const CityTour = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // États pour les données du backend
  const [cityTourPackages, setCityTourPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    reservable_id: '',
    type: 'city-tour',
    full_name: '',
    email: '',
    phone: '',
    date_reservation: '',
    travelers: '',
    currency: 'CFA',
    message: ''
  });

  // Configuration de l'API
  const api = axios.create({
    baseURL: 'https://etravelbackend-production.up.railway.app/api',
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
      const response = await api.get('/city-tours');
      console.log('City tours récupérés:', response.data);
      const toursData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setCityTourPackages(toursData);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des city tours:', err);
      setError('Impossible de charger les city tours. Veuillez réessayer plus tard.');
      showNotification('Impossible de charger les city tours. Veuillez réessayer plus tard.', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePackageSelect = (packageId) => {
    setFormData(prev => ({ 
      ...prev, 
      reservable_id: packageId,
      type: 'city-tour'
    }));
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reservable_id) {
      showNotification('Veuillez sélectionner un city tour avant de réserver.', 'warning');
      return;
    }

    if (!formData.full_name || !formData.email || !formData.travelers) {
      showNotification('Veuillez remplir tous les champs obligatoires.', 'warning');
      return;
    }

    if (parseInt(formData.travelers) < 1) {
      showNotification('Le nombre de participants doit être au moins 1.', 'warning');
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
        travelers: parseInt(formData.travelers),
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
        type: 'city-tour',
        full_name: '',
        email: '',
        phone: '',
        date_reservation: '',
        travelers: '',
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
          err.response?.data?.message || 'Erreur lors de l\'envoi de la réservation. Veuillez réessayer.', 
          'error'
        );
      }
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi de la réservation. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const features = [
    {
      icon: Users,
      title: 'Guides Certifiés',
      description: 'Experts locaux passionnés par leur ville'
    },
    {
      icon: Clock,
      title: '1er & Dernier Samedi',
      description: 'Deux dates par mois pour votre confort'
    },
    {
      icon: Award,
      title: 'Sites UNESCO',
      description: 'Patrimoine culturel authentique'
    },
    {
      icon: Star,
      title: 'Expérience Premium',
      description: 'Immersion totale garantie'
    }
  ];

  const brazzavilleHighlights = [
    'Grand marché MPUMBU - Site historique depuis le XVIe siècle',
    'Belvédère - Port principal historique',
    'Pont du 15 Août - Monument emblématique',
    'Tour Nabemba - Symbole de la modernité',
    'Capitale de l\'AEF (1910-1958)',
    'Capitale de la France Libre (1940-1943)'
  ];

  const kinshasaHighlights = [
    'Ville Basse: Limete, Lingwala, Kinshasa, Barumbu',
    'Ville Haute: Mont Ngafula, Mbinza, Mont-Fleury',
    'Tour Échangeur Limété - Architecture moderne',
    'Contraste unique entre plaines et collines',
    'Développement urbain pré et post-indépendance',
    'Richesse des équipements urbains'
  ];

  // Filtrer les city tours par pays
  const brazzavilleTours = cityTourPackages.filter(pkg => pkg.country?.code === 'RC');
  const kinshasaTours = cityTourPackages.filter(pkg => pkg.country?.code === 'rdc' || pkg.country?.code === 'RDC');

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
      {/* Header */}
          <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <div className="flex items-center space-x-3">
                    <img src="logo.png" alt="" width={70}/>
                  {/* <div>
                    <h1 className="text-2xl font-black text-gray-900">e-TRAVEL WORLD</h1>
                    <p className="text-xs text-primary tracking-wider">AGENCY</p>
                  </div> */}
                </div>
    
                <nav className="hidden md:flex items-center space-x-10">
                  <Link to="/" className="text-gray-700 hover:text-primary transition-colors font-medium">Accueil</Link>
                  <Link to="/about" className="text-gray-700 hover:text-primary transition-colors font-medium">À propos</Link>
                  <Link to="/weekend">
                    <Button variant="warning" size="sm" className="font-extrabold shadow-md hover:shadow-lg">
                      OUIKENAC
                    </Button>
                  </Link>
                  <Link to="/city-tour" className="text-gray-700 hover:text-primary transition-colors font-medium">CityTour</Link>
                  <a href="#contact" className="text-gray-700 hover:text-primary transition-colors font-medium">Contact</a>
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
                    className="block text-gray-700 hover:text-primary py-3 text-base font-medium border-b border-gray-100" 
                    onClick={() => setMenuOpen(false)}
                  >
                    Accueil
                  </Link>
                  <Link 
                    to="/about" 
                    className="block text-gray-700 hover:text-primary py-3 text-base font-medium border-b border-gray-100" 
                    onClick={() => setMenuOpen(false)}
                  >
                    A propos
                  </Link>
                  <Link 
                    to="/weekend" 
                    className="block text-warning hover:text-warning/90 py-3 text-base font-extrabold border-b border-gray-100" 
                    onClick={() => setMenuOpen(false)}
                  >
                    OUIKENAC
                  </Link>
                  <Link 
                    to="/city-tour" 
                    className="block text-gray-700 hover:text-primary py-3 text-base font-medium border-b border-gray-100" 
                    onClick={() => setMenuOpen(false)}
                  >
                    CityTour
                  </Link>
                  <a href="#contact" className="block text-gray-700 hover:text-primary py-3 text-base font-medium" onClick={() => setMenuOpen(false)}>Contactez-nous</a>
                </nav>
              </div>
            )}
          </header>

      {/* Hero Section */}
      <section className="relative h-screen mt-20 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.2)), url(fleuve2.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center px-4 max-w-5xl">
              <div className="inline-block px-6 py-2 bg-warning rounded-full mb-6">
                <p className="text-gray-900 font-bold tracking-wider uppercase text-sm">Patrimoine & Culture</p>
              </div>
              <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-6 leading-tight">
                OUIKENAC
              </h2>
              <p className="text-3xl sm:text-4xl md:text-5xl text-white mb-8 font-light">
                City Tour
              </p>
              <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
                Découverte guidée du patrimoine culturel et naturel des villes des CONGO
              </p>
              <Button 
                onClick={() => document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth' })}
                variant="warning" 
                size="lg" 
                className="hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3"
              >
                <Calendar size={24} />
                Découvrir les tours
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/50 to-transparent h-32"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Utilisation de la couleur primaire */}
            <p className="text-primary font-semibold text-sm tracking-wider mb-4 uppercase">Pourquoi choisir OUIKENAC</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Une Expérience Unique</h2>
            <p className="text-xl text-gray-600">Tous les 1ers et derniers samedis de chaque mois</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-light-bg rounded-2xl p-8 border border-gray-200 hover:border-warning hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-warning rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all">
                  <feature.icon className="text-gray-900" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-center text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City Tours Section */}
      <section id="tours" className="py-24 px-4 bg-light-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Nos City Tours Disponibles</h2>
            <p className="text-xl text-gray-600">Choisissez votre ville de départ</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <Loader className="animate-spin h-16 w-16 text-primary" />
                <div className="absolute inset-0 h-16 w-16 border-4 border-primary/20 rounded-full"></div>
              </div>
              <p className="text-gray-600 text-lg mt-6">Chargement des city tours...</p>
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
                className="mt-4 px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Display City Tours */}
          {!loading && !error && cityTourPackages.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {cityTourPackages.map((tour) => (
                <div
                  key={tour.id}
                  className={`bg-white rounded-2xl overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                    // Utilisation des couleurs de la charte
                    tour.country?.code === 'RC' ? 'border-green' : 'border-primary'
                  }`}
                >
                  <div className="relative h-64">
                    <img 
                      src={tour.image ? `http://127.0.0.1:8000/storage/${tour.image}` : 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800'} 
                      alt={tour.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-4 py-2 text-sm font-bold rounded-full ${
                        // Utilisation des couleurs de la charte
                        tour.country?.code === 'RC' ? 'bg-green text-white' : 'bg-primary text-white'
                      }`}>
                        {tour.city?.name || (tour.country?.code === 'RC' ? 'Brazzaville' : 'Kinshasa')}
                      </span>
                      {tour.active && (
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-warning text-gray-900">
                          Disponible
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-3xl font-black">{tour.title}</h3>
                      {tour.scheduled_date && (
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="text-white" size={16} />
                          <p className="text-white text-sm">
                            {new Date(tour.scheduled_date).toLocaleDateString('fr-FR', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-700 mb-6 leading-relaxed">{tour.description || 'Découvrez cette magnifique ville avec nos guides experts.'}</p>

                    {/* Capacité */}
                    {tour.min_people && (
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                        {/* Utilisation de la couleur primaire */}
                        <Users size={16} className="text-primary" />
                        <span>
                          {tour.min_people} - {tour.max_people || '+'} personnes
                        </span>
                      </div>
                    )}

                    {/* Prix */}
                    {tour.prices && tour.prices.length > 0 && (
                      <div className="space-y-2 mb-6">
                        {tour.prices.map((price, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">
                              {price.min_people} {price.max_people ? `- ${price.max_people}` : '+'} pers.
                            </span>
                            <span className="text-xl font-black text-gray-900">
                              {formatPrice(price.price)} {price.currency}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <button 
                      onClick={() => handlePackageSelect(tour.id)}
                      disabled={!tour.active}
                      className={`w-full py-4 font-bold rounded-full transition-all hover:shadow-xl flex items-center justify-center gap-2 ${
                        tour.active 
                          ? tour.country?.code === 'RC' 
                            // Utilisation des couleurs de la charte
                            ? 'bg-green text-white hover:bg-green/90' 
                            : 'bg-primary text-white hover:bg-primary/90'
                          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      <Calendar size={20} />
                      {tour.active ? 'Réserver ce tour' : 'Indisponible'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && cityTourPackages.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg">Aucun city tour disponible pour le moment.</p>
              <button 
                onClick={fetchPackages}
                className="mt-4 px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Brazzaville Section */}
      <section id="brazzaville" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                {/* Utilisation de la couleur verte */}
                <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-green font-semibold text-sm tracking-wider uppercase">République du Congo</p>
                  <h3 className="text-4xl md:text-5xl font-black text-gray-900">Brazzaville</h3>
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                La future Brazzaville naît à l'emplacement des anciens villages tékés dont les principaux sont <strong className="text-gray-900">Mbama, Impila, Okila, Mfoa</strong>.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                Avant l'arrivée des européens, le site actuel de la capitale était un point stratégique où s'était installé depuis au moins le XVIe siècle, <strong className="text-gray-900">le grand marché MPUMBU</strong> avec un port principal (sous l'actuel belvédère) et trois ports secondaires.
              </p>

              <p className="text-gray-700 leading-relaxed mb-8">
                En 1881, la société de géographie et le comité français de l'Association Internationale Africaine donnent le nom de <strong className="text-gray-900">Brazzaville</strong> à cet hameau batéké. Elle a été successivement capitale de l'<strong className="text-gray-900">AEF (1910-1958)</strong>, de la <strong className="text-gray-900">France Libre (1940-1943)</strong> et de la <strong className="text-gray-900">République du CONGO</strong> (de 1958 à ce jour).
              </p>

              <div className="space-y-3 mb-8">
                {brazzavilleHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {/* Utilisation de la couleur verte */}
                    <div className="w-6 h-6 bg-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Landmark className="text-white" size={14} />
                    </div>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>

              {brazzavilleTours.length > 0 && (
                <Button 
                  onClick={() => handlePackageSelect(brazzavilleTours[0].id)}
                  variant="green"
                  size="lg"
                  className="inline-flex items-center gap-3"
                >
                  <Calendar size={20} />
                  Réserver Brazzaville Tour
                </Button>
              )}
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="TJ.webp" 
                  alt="Brazzaville architecture" 
                  className="rounded-2xl w-full h-72 object-cover shadow-lg hover:scale-105 transition-transform duration-500"
                />
                <img 
                  src="BPN.jpg" 
                  alt="Pont du 15 Août" 
                  className="rounded-2xl w-full h-72 object-cover shadow-lg hover:scale-105 transition-transform duration-500 mt-8"
                />
              </div>
              {/* Utilisation de la couleur verte */}
              <div className="absolute -bottom-6 -left-6 bg-green rounded-xl p-6 shadow-xl">
                <Building2 className="text-white" size={48} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kinshasa Section */}
      <section id="kinshasa" className="py-24 px-4 bg-light-bg">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="kin.webp" 
                  alt="Kinshasa cityscape" 
                  className="rounded-2xl w-full h-72 object-cover shadow-lg hover:scale-105 transition-transform duration-500"
                />
                <img 
                  src="tour2.jpg" 
                  alt="Tour Échangeur Limété" 
                  className="rounded-2xl w-full h-72 object-cover shadow-lg hover:scale-105 transition-transform duration-500 mt-8"
                />
              </div>
              {/* Utilisation de la couleur primaire */}
              <div className="absolute -bottom-6 -right-6 bg-primary rounded-xl p-6 shadow-xl">
                <Navigation className="text-white" size={48} />
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-6">
                {/* Utilisation de la couleur primaire */}
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-primary font-semibold text-sm tracking-wider uppercase">République Démocratique du Congo</p>
                  <h3 className="text-4xl md:text-5xl font-black text-gray-900">Kinshasa</h3>
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                L'actuelle ville de Kinshasa a été construite à partir de deux sites topographiques qui ont des forces attractives différentes, étant donné que l'urbanisation de la plaine est plus aisée que celle des collines.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                <strong className="text-gray-900">Ville Basse (Cité des plaines):</strong> Limete, Lingwala, Kinshasa, Barumbu, Kasa-Vubu, Ngiri-Ngiri, Lemba, Ndjili, Matete, Kalamu, Bandalungwa, Ngaba, Masina, Makala et Kinkole.
              </p>

              <p className="text-gray-700 leading-relaxed mb-8">
                <strong className="text-gray-900">Ville Haute (Cité des collines):</strong> Joli Parc, Djelo Mbinza, Mbinza UPN, Mbinza Météo, Mont-Fleury, Mbinza Télécom, Mont Ngafula. Le site bas a été urbanisé avant l'Indépendance en 1960, tandis que le site haut s'est développé après.
              </p>

              <div className="space-y-3 mb-8">
                {kinshasaHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {/* Utilisation de la couleur primaire */}
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Landmark className="text-white" size={14} />
                    </div>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>

              {kinshasaTours.length > 0 && (
                <Button 
                  onClick={() => handlePackageSelect(kinshasaTours[0].id)}
                  variant="primary"
                  size="lg"
                  className="inline-flex items-center gap-3"
                >
                  <Calendar size={20} />
                  Réserver Kinshasa Tour
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="contact" className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Réservez Votre City Tour</h2>
            <p className="text-xl text-gray-600">Remplissez le formulaire et nous vous contacterons rapidement</p>
          </div>

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

          <div className="bg-light-bg rounded-2xl p-8 md:p-12 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Nom complet *"
                  required
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none transition-all"
                />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Adresse email *"
                  required
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none transition-all"
                />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Téléphone"
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none transition-all"
                />
                <select 
                  name="reservable_id"
                  value={formData.reservable_id}
                  onChange={handleInputChange}
                  required
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-primary focus:outline-none transition-all"
                >
                  <option value="">Sélectionner un city tour *</option>
                  {cityTourPackages.map(pkg => (
                    <option key={pkg.id} value={pkg.id} disabled={!pkg.active}>
                      {pkg.title} - {pkg.city?.name || (pkg.country?.code === 'RC' ? 'Brazzaville' : 'Kinshasa')}
                      {pkg.prices && pkg.prices[0] && ` (${formatPrice(pkg.prices[0].price)} ${pkg.prices[0].currency})`}
                    </option>
                  ))}
                </select>
                <input 
                  type="date" 
                  name="date_reservation"
                  value={formData.date_reservation}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-primary focus:outline-none transition-all"
                />
                <input 
                  type="number"
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleInputChange}
                  placeholder="Nombre de participants *"
                  required
                  min="1"
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none transition-all"
                />
              </div>
              
              <select 
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-primary focus:outline-none transition-all"
              >
                <option value="CFA">CFA</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>

              <textarea 
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Message ou demande spécifique..." 
                className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none transition-all resize-none"
              />
              
              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-primary text-white font-bold text-lg rounded-full hover:bg-primary/90 transition-all hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Confirmer la réservation <ArrowRight size={24} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20 px-4 bg-gradient-to-r from-warning via-warning/90 to-secondary">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-900 text-2xl md:text-3xl mb-4 font-light">
            Réservez votre <strong className="font-black">OUIKENAC City Tour</strong> maintenant
          </p>
          <p className="text-7xl md:text-8xl font-black text-gray-900 mb-4">20%</p>
          <p className="text-3xl md:text-4xl font-black text-gray-900 mb-6">DE RÉDUCTION</p>
          <p className="text-gray-800 text-lg mb-8">Pour les 100 premiers inscrits</p>
          <Button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            variant="primary" 
            size="lg"
            className="hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3"
          >
            Je réserve maintenant <ArrowRight size={24} />
          </Button>
        </div>
      </section>

      {/* Schedule Info */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-light-bg rounded-2xl p-12 border-2 border-gray-200">
            {/* Utilisation de la couleur primaire */}
            <Calendar className="mx-auto text-primary mb-6" size={64} />
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Fréquence des Tours
            </h3>
            <p className="text-xl text-gray-700 mb-8">
              Tous les <strong className="text-primary">1ers et derniers samedis</strong> de chaque mois
            </p>
            {/* Utilisation de la couleur primaire avec opacité */}
            <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-xl text-left">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-gray-900">Remarque importante :</strong> Les dates exactes des tours peuvent varier selon les événements spéciaux et les jours fériés. Nous vous confirmerons la date exacte lors de votre réservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
             <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
               <div>
                 <div className="flex items-center space-x-3 mb-6">
                   {/* Utilisation de la couleur primaire */}
                   <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                     <img src="logo.png" alt="" width={70}/>
                   </div>
                   <div>
                     <h3 className="text-xl font-black">e-TRAVEL WORLD</h3>
                     <p className="text-xs text-secondary">AGENCY</p>
                   </div>
                 </div>
                 <p className="text-gray-400 text-sm">Votre agence de voyage pour des week-ends uniques entre le Congo et la RDC.</p>
               </div>
               <div>
                 <h3 className="text-lg font-bold mb-6">Navigation</h3>
                 <div className="space-y-3">
                   <a href="#" className="text-gray-400 hover:text-white transition-colors block">Accueil</a>
                   <a href="#about" className="text-gray-400 hover:text-white transition-colors block">À propos</a>
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
                     <Phone size={16} className="text-primary" /> +242 05 594 94 64
                   </p>
                   <p className="flex items-center gap-2 text-gray-400">
                     <Mail size={16} className="text-primary" /> worldagencyetravel@gmail.com
                   </p>
                   <p className="flex items-start gap-2 text-gray-400">
                     <MapPin size={16} className="text-primary mt-1" /> Brazzaville, 89 Rue Mouilla Ouenze,Kulunda 
                   </p>
                 </div>
               </div>
               <div>
                 <h3 className="text-lg font-bold mb-6">Suivez-nous</h3>
                 <div className="flex gap-4">
                   <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-all" aria-label="Facebook">
                     <Facebook size={18} />
                   </a>
                   <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary transition-all" aria-label="Instagram">
                     <Instagram size={18} />
                   </a>
                   <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary/90 transition-all" aria-label="Twitter">
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
      `}</style>
      
      {/* Tailwind Custom Colors (Charte graphique officielle E-TRAVEL WORLD AGENCY) - FIX ROBUSTE */}
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
          --light-bg: #f5f7f9;
        }

        /* 2. Classes utilitaires de base (text, bg, border) */
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
        .border-primary { border-color: var(--primary); }
        .focus\\:border-primary:focus { border-color: var(--primary); }
        
        .text-secondary { color: var(--secondary); }
        .bg-secondary { background-color: var(--secondary); }
        
        .text-green { color: var(--green); }
        .bg-green { background-color: var(--green); }
        .border-green { border-color: var(--green); }

        .text-warning { color: var(--warning); }
        .bg-warning { background-color: var(--warning); }
        .fill-warning { fill: var(--warning); }
        
        .bg-light-bg { background-color: var(--light-bg); }


        /* 3. FIX: Classes d'opacité et de survol manquantes (utiliser rgba pour la robustesse) */
        
        /* Opacité 10% / 20% / 30% */
        .bg-primary\\/10 { background-color: rgba(27, 94, 142, 0.1); }
        .border-primary\\/20 { border-color: rgba(27, 94, 142, 0.2); }
        .border-primary\\/30 { border-color: rgba(27, 94, 142, 0.3); }

        /* Survol (hover) - Opacité 90% */
        .hover\\:bg-primary\\/90:hover { background-color: rgba(27, 94, 142, 0.9) !important; }
        .hover\\:bg-secondary\\/90:hover { background-color: rgba(241, 143, 19, 0.9) !important; }
        .hover\\:bg-green\\/90:hover { background-color: rgba(0, 115, 53, 0.9) !important; }
        .hover\\:bg-warning\\/90:hover { background-color: rgba(247, 180, 6, 0.9) !important; }
        .hover\\:text-primary\\/90:hover { color: rgba(27, 94, 142, 0.9) !important; }

        /* Survol (hover) - Couleur de base */
        .hover\\:bg-primary:hover { background-color: var(--primary); }
        .hover\\:text-primary:hover { color: var(--primary); }
        .hover\\:bg-secondary:hover { background-color: var(--secondary); }
        .hover\\:text-secondary:hover { color: var(--secondary); }
        
        /* FIX: Ombres personnalisées pour les boutons */
        .hover\\:shadow-primary-lg:hover {
            box-shadow: 0 10px 15px -3px rgba(27, 94, 142, 0.3), 0 4px 6px -2px rgba(27, 94, 142, 0.1);
        }
        .hover\\:shadow-secondary-lg:hover {
            box-shadow: 0 10px 15px -3px rgba(241, 143, 19, 0.3), 0 4px 6px -2px rgba(241, 143, 19, 0.1);
        }
        .hover\\:shadow-green-lg:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 115, 53, 0.3), 0 4px 6px -2px rgba(0, 115, 53, 0.1);
        }
        .hover\\:shadow-warning-lg:hover {
            box-shadow: 0 10px 15px -3px rgba(247, 180, 6, 0.3), 0 4px 6px -2px rgba(247, 180, 6, 0.1);
        }
        `}
      </style>
    </div>
  );
};

export default CityTour;