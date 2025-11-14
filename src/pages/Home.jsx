import React, { useState, useEffect } from 'react';
import { Menu, X, Plane, Ship, Hotel, MapPin, Shield, Calendar, Facebook, Instagram, Twitter, Linkedin, Phone, Mail, ChevronLeft, ChevronRight, ArrowRight, Globe, Star, Award, Users, Check, Loader, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// ============= COMPOSANTS RÉUTILISABLES =============

// Composant Notification
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
    <div className={`fixed top-20 right-4 z-50 max-w-md w-full ${config.bg} ${config.border} ${config.text} border-l-4 rounded-xl p-4 shadow-2xl animate-slide-in`}>
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

// Composant Loading
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

// Composant Button réutilisable
const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 hover:shadow-primary-lg',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 hover:shadow-secondary-lg',
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
      className={`font-bold rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Composant Card Service (Design plus épuré)
const ServiceCard = ({ icon: Icon, title, description }) => (
  <div className="group bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
    <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all duration-300">
      <Icon className="text-primary group-hover:text-white transition-colors" size={32} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 text-center mb-3">{title}</h3>
    <p className="text-gray-600 text-center text-sm">{description}</p>
  </div>
);

// Composant Destination Card (Design plus épuré/premium)
const DestinationCard = ({ destination, onSelect, formatPrice }) => (
  <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
    <div className="relative h-64 overflow-hidden">
      <img 
        src={destination.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'} 
        alt={destination.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      <div className={`absolute top-4 right-4 px-4 py-1 rounded-full text-sm font-bold shadow-md ${destination.active ? 'bg-green text-white' : 'bg-gray-500 text-white'}`}>
        {destination.active ? 'Disponible' : 'Indisponible'}
      </div>
    </div>

    <div className="p-7">
      <h3 className="text-2xl font-black text-gray-900 mb-3">{destination.title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
        {destination.description || 'Découvrez cette destination exceptionnelle'}
      </p>
      
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <MapPin size={16} className="text-primary" />
        <span className="font-medium">
          {destination.departure_country?.name || 'Départ'} → {destination.arrival_country?.name || 'Arrivée'}
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-100">
        <div>
          <p className="text-sm text-gray-500">À partir de</p>
          {destination.prices && destination.prices[0] && (
            <>
              <p className="text-3xl font-black text-primary">
                {formatPrice(destination.prices[0].price)} <span className="text-base font-normal text-gray-900">{destination.prices[0].currency}</span>
              </p>
              {destination.prices[0].min_people && (
                <p className="text-xs text-gray-500 mt-1">Min. {destination.prices[0].min_people} pers.</p>
              )}
            </>
          )}
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="text-warning fill-warning" size={20} />
          ))}
        </div>
      </div>

      <Button 
        onClick={() => onSelect(destination.id)}
        disabled={!destination.active}
        variant={destination.active ? 'primary' : 'outline'}
        className="w-full disabled:bg-gray-400 disabled:border-gray-400 disabled:text-white disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
      >
        {destination.active ? 'Réserver maintenant' : 'Indisponible'}
      </Button>
    </div>
  </div>
);

// ============= COMPOSANT PRINCIPAL =============

const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    reservable_id: '',
    type: 'destination-package',
    full_name: '',
    email: '',
    phone: '',
    date_from: '',
    date_to: '',
    travelers: '',
    currency: 'CFA',
    message: ''
  });

  // Configuration de l'API (AUCUNE MODIFICATION)
  const api = axios.create({
    baseURL: 'https://etravelbackend-production.up.railway.app/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const slides = [
    {
      image: 'pont.jpg',
      title: 'Explorez le Monde',
      subtitle: 'avec Confiance',
      description: 'Votre agence de voyage professionnelle depuis 2019'
    },
    {
      image: 'agence.jpg',
      title: 'Week-end au Congo',
      subtitle: 'Découvrez l\'Authenticité',
      description: 'Terre de richesses insoupçonnées'
    },
    {
      image: 'maya.jpg',
      title: 'Nature & Aventure',
      subtitle: 'Expériences Uniques',
      description: 'Des moments inoubliables vous attendent'
    },
    {
      image: 'Aude.jpg',
      title: 'Voyagez Sans Limites',
      subtitle: 'Partout dans le Monde',
      description: 'Plus de 50 destinations disponibles'
    }
  ];

  const services = [
    { icon: Plane, title: 'Voyage Aérien', desc: 'Billets d\'avion vers toutes destinations' },
    { icon: Ship, title: 'Voyage Fluvial', desc: 'Croisières et transports maritimes' },
    { icon: Hotel, title: "Réservation Hôtel", desc: 'Hébergements de qualité mondiale' },
    { icon: MapPin, title: 'OUIKENAC', desc: 'Découverte du patrimoine congolais' },
    { icon: Shield, title: 'Assurance Voyage', desc: 'Voyagez en toute sécurité' }
  ];

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Récupérer les packages au chargement avec l'API (AUCUNE MODIFICATION)
  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/destinations');
      const destinationsData = response.data;
      
      const destinations = Array.isArray(destinationsData) ? destinationsData : (destinationsData.data || []);
      
      setDestinations(destinations);
    } catch (err) {
      console.error('Erreur lors de la récupération des destinations:', err);
      showNotification('Impossible de charger les destinations. Veuillez réessayer plus tard.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  
  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePackageSelect = (destinationId) => {
    setFormData(prev => ({ 
      ...prev, 
      reservable_id: destinationId,
      type: 'destination-package'
    }));
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reservable_id) {
      showNotification('Veuillez sélectionner une destination avant de réserver.', 'warning');
      return;
    }

    if (!formData.full_name || !formData.email || !formData.travelers) {
      showNotification('Veuillez remplir tous les champs obligatoires.', 'warning');
      return;
    }

    if (parseInt(formData.travelers) < 1) {
      showNotification('Le nombre de voyageurs doit être au moins 1.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const reservationData = {
        reservable_id: parseInt(formData.reservable_id),
        type: formData.type,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        date_from: formData.date_from || null,
        date_to: formData.date_to || null,
        travelers: parseInt(formData.travelers),
        currency: formData.currency,
        message: formData.message
      };

      console.log('Envoi de la réservation:', reservationData);
      
      const response = await api.post('/reservations', reservationData);
      
      console.log('Réservation créée:', response.data);
      
      showNotification('Réservation envoyée avec succès ! Nous vous contacterons très bientôt.', 'success');
      
      setFormData({
        reservable_id: '',
        type: 'destination-package',
        full_name: '',
        email: '',
        phone: '',
        date_from: '',
        date_to: '',
        travelers: '',
        currency: 'CFA',
        message: ''
      });

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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: '', type: '' })}
      />

      {submitting && <LoadingOverlay message="Envoi de votre réservation..." />}

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg h-20' : 'bg-white/95 h-24'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
            <div className="flex items-center space-x-3">
                <img src="logoetravel.jpg" alt="e-TRAVEL WORLD AGENCY" width={55} className="w-14 h-14 object-contain"/>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">e-TRAVEL WORLD</h1>
                <p className="text-xs text-primary tracking-widest uppercase font-semibold">AGENCY</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors font-semibold text-base">Accueil</Link>
              <Link to="/about" className="text-gray-700 hover:text-primary transition-colors font-semibold text-base">À propos</Link>
              <Link to="/city-tour" className="text-gray-700 hover:text-primary transition-colors font-semibold text-base">City Tour</Link>
              <a href="#contact" className="text-gray-700 hover:text-primary transition-colors font-semibold text-base">Contact</a>
            </nav>
            
            <div className="hidden md:block">
              <Link to="/weekend">
                <Button variant="warning" size="sm" className="bg-warning text-gray-900 font-extrabold shadow-md hover:shadow-lg">
                  OUIKENAC
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-900"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-xl pt-4 pb-6 px-4 absolute w-full transition-all duration-300 border-t border-gray-100">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-primary py-3 text-base font-medium" onClick={() => setMenuOpen(false)}>Accueil</Link>
              <Link to="/about" className="text-gray-700 hover:text-primary py-3 text-base font-medium" onClick={() => setMenuOpen(false)}>À propos</Link>
              <Link to="/weekend" className="text-warning hover:text-warning/80 py-3 text-base font-extrabold" onClick={() => setMenuOpen(false)}>OUIKENAC</Link>
              <Link to="/city-tour" className="text-gray-700 hover:text-primary py-3 text-base font-medium" onClick={() => setMenuOpen(false)}>City Tour</Link>
              <a href="#contact" className="text-gray-700 hover:text-primary py-3 text-base font-medium" onClick={() => setMenuOpen(false)}>Contactez-nous</a>
            </nav>
          </div>
        )}
      </header>
      
      {/* Hero Slider */}
      <section id="home" className="relative h-screen pt-24">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.2)), url(${slide.image})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          >
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <p className="text-white text-base md:text-lg tracking-widest mb-4 uppercase font-medium">{slide.description}</p>
                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                  {slide.title} 
                </h2>
                <p className="text-2xl sm:text-3xl md:text-4xl text-white mb-10 font-light drop-shadow-md">
                  {slide.subtitle}
                </p>
                <Button 
                  onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })} 
                  variant="primary" 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl"
                >
                  Découvrir nos offres
                </Button>
              </div>
            </div>
          </div>
        ))}

        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full transition-all hover:scale-105 z-10 shadow-lg">
          <ChevronLeft className="text-gray-900" size={28} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full transition-all hover:scale-105 z-10 shadow-lg">
          <ChevronRight className="text-gray-900" size={28} />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentSlide(index)} 
              className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'}`} 
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Nos Services Professionnels</h2>
            <p className="text-xl text-gray-600 font-light">Un éventail complet pour des voyages sans souci</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {services.map((service, index) => (
              <ServiceCard 
                key={index} 
                icon={service.icon} 
                title={service.title} 
                description={service.desc} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats/About Section */}
      <section className="py-24 px-4 bg-light-bg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-primary text-lg font-bold mb-3 uppercase tracking-widest">À Propos de Nous</p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Plus qu'une Agence, un Partenaire de Voyage.
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Depuis 2019, notre mission est de transformer vos rêves d'évasion en réalité. 
                Nous combinons expertise locale et réseau mondial pour vous offrir les meilleures expériences. 
                Voyagez l'esprit léger, on s'occupe du reste.
              </p>
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-lg mb-10">
                <div className="text-center">
                  <p className="text-4xl font-black text-primary mb-1">500+</p>
                  <p className="text-sm text-gray-600">Clients satisfaits</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-primary mb-1">50+</p>
                  <p className="text-sm text-gray-600">Destinations</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-primary mb-1">4.9</p>
                  <p className="text-sm text-gray-600">Note moyenne</p>
                </div>
              </div>
              <Button variant="primary" size="lg" className="inline-flex items-center gap-2"> 
                En savoir plus <ArrowRight size={20} /> 
              </Button>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative p-4 bg-white rounded-3xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1542470940-bf7f62e84719?q=80&w=1600" 
                  alt="Équipe professionnelle" 
                  className="rounded-2xl w-full h-auto object-cover"
                />
                <div className="absolute -bottom-8 -left-8 bg-secondary p-5 rounded-full shadow-xl">
                  <Award className="text-white" size={40} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section id="destinations" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Destinations Populaires</h2>
            <p className="text-xl text-gray-600 font-light">Explorez nos meilleures offres de voyage</p>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <Loader className="animate-spin h-16 w-16 text-primary" />
                <div className="absolute inset-0 h-16 w-16 border-4 border-primary/20 rounded-full"></div>
              </div>
              <p className="text-gray-600 text-lg mt-6">Chargement des destinations...</p>
            </div>
          ) : destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {destinations.map((dest) => (
                <DestinationCard 
                  key={dest.id} 
                  destination={dest} 
                  onSelect={handlePackageSelect} 
                  formatPrice={formatPrice} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-3xl border border-gray-200">
              <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg">Aucune destination disponible pour le moment.</p>
              <Button onClick={fetchDestinations} variant="primary" className="mt-6" > 
                Réessayer 
              </Button>
            </div>
          )}
          <div className="text-center mt-16">
            <Button variant="outline" size="lg"> Voir toutes les destinations </Button>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="contact" className="py-24 px-4 bg-light-bg">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 lg:p-16 rounded-3xl shadow-2xl">
          <div className="text-center mb-10">
            <p className="text-primary text-lg font-bold mb-3 uppercase tracking-widest">Réservation Express</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Planifiez Votre Prochain Voyage</h2>
            <p className="text-lg text-gray-600 font-light">Remplissez le formulaire, nous vous recontacterons sous 24h.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formData.reservable_id && (
                <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-xl text-gray-900">
                    <p className="font-semibold text-sm">Destination sélectionnée: <span className="font-bold">{destinations.find(d => d.id === parseInt(formData.reservable_id))?.title || 'Non spécifié'}</span></p>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} placeholder="Nom Complet *" required className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email *" required className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Téléphone" className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
              <input type="date" name="date_from" value={formData.date_from} onChange={handleInputChange} placeholder="Date de départ" min={new Date().toISOString().split('T')[0]} className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
              <input type="date" name="date_to" value={formData.date_to} onChange={handleInputChange} placeholder="Date de retour" min={formData.date_from || new Date().toISOString().split('T')[0]} className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
              <input type="number" name="travelers" value={formData.travelers} onChange={handleInputChange} placeholder="Nombre de voyageurs *" required min="1" className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
              
              <select name="currency" value={formData.currency} onChange={handleInputChange} className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" >
                <option value="CFA">CFA</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <div className="hidden md:block"></div> {/* Spacer */}
            </div>
            
            <textarea rows={4} name="message" value={formData.message} onChange={handleInputChange} placeholder="Message ou demande spécifique..." className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none" />
            
            <Button 
              type="submit" 
              disabled={submitting} 
              variant="primary" 
              size="lg" 
              className="w-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3"
            >
              {submitting ? (
                <> 
                  <Loader className="animate-spin" size={20} /> Envoi en cours... 
                </>
              ) : (
                <> 
                  Réserver maintenant <ArrowRight size={24} /> 
                </>
              )}
            </Button>
          </form>
        </div>
      </section>

      {/* Promo Banner (OUIKENAC) */}
      <section className="py-20 px-4 bg-green-ouik">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-white text-xl md:text-3xl mb-4 font-light"> Faites partie des premiers à réserver un <strong className="font-black">OUIKENAC</strong> et bénéficiez de </p>
          <p className="text-8xl md:text-9xl font-black text-warning leading-none drop-shadow-xl">
            -20%
          </p>
          <p className="text-white text-3xl md:text-4xl font-extrabold mt-4 mb-10">sur le forfait</p>
          <Link to="/weekend">
            <Button variant="warning" size="lg" className="shadow-2xl">
              Découvrir OUIKENAC
            </Button>
          </Link>
        </div>
      </section>

      {/* City Tour/Why Us Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Avantages */}
            <div className="space-y-10">
              <div className="mb-4">
                <p className="text-primary text-lg font-bold mb-3 uppercase tracking-widest">Pourquoi Nous Choisir</p>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  Voyagez avec Confiance, Sérénité et Expertise.
                </h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Check className="text-green flex-shrink-0 mt-1" size={32} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Assistance 24/7</h3>
                    <p className="text-gray-600">Notre équipe est disponible à tout moment pour vous assister, peu importe votre destination.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Globe className="text-primary flex-shrink-0 mt-1" size={32} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Expertise Mondiale</h3>
                    <p className="text-gray-600">Des destinations testées et approuvées par nos experts pour des expériences inoubliables.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Users className="text-secondary flex-shrink-0 mt-1" size={32} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Offres Personnalisées</h3>
                    <p className="text-gray-600">Des voyages sur mesure qui correspondent parfaitement à vos envies et à votre budget.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* City Tour */}
            <div className="lg:mt-16 bg-light-bg p-8 rounded-3xl shadow-xl">
              <h2 className="text-4xl font-black text-gray-900 mb-4">City Tour</h2>
              <p className="text-lg text-gray-600 mb-6">
                Découvrez votre ville sous un nouvel angle. Nos City Tours vous emmènent 
                à travers le patrimoine, l'histoire et les lieux secrets.
              </p>
              <div className="mb-10">
                <Link to="/city-tour-calendar">
                  <Button variant="primary" size="md" className="inline-flex items-center gap-2">
                    Explorer les City Tours <ArrowRight size={20} />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img src="tour1.jpg" alt="City tour" className="rounded-xl w-full h-64 object-cover shadow-lg hover:scale-105 transition-transform duration-500" />
                <img src="tour2.jpg" alt="Cultural site" className="rounded-xl w-full h-64 object-cover shadow-lg hover:scale-105 transition-transform duration-500 mt-8" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-10">
            
            {/* Logo/Description */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img src="logoetravel.jpg" alt="e-TRAVEL WORLD AGENCY" width={55} className="w-14 h-14 object-contain"/>
                <div>
                  <h3 className="text-xl font-black">e-TRAVEL WORLD</h3>
                  <p className="text-xs text-gray-400">AGENCY</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">Votre partenaire voyage de confiance, vous emmenant partout dans le monde depuis 2019.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Facebook size={24} /></a>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Instagram size={24} /></a>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Twitter size={24} /></a>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Linkedin size={24} /></a>
              </div>
            </div>

            {/* Liens Rapides */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Liens Rapides</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">À propos de nous</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">Nos Services</Link></li>
                <li><a href="#destinations" className="text-gray-400 hover:text-white transition-colors">Destinations</a></li>
                <li><Link to="/city-tour" className="text-gray-400 hover:text-white transition-colors">City Tours</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Politique de Confidentialité</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Conditions Générales</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Aide</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Contactez-nous</h4>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <MapPin className="text-secondary flex-shrink-0" size={20} />
                  <p className="text-gray-400">15 Avenue de La Base, Batignolles 2-Moungali, Brazzaville, Congo</p>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="text-secondary flex-shrink-0" size={20} />
                  <p className="text-gray-400">+242 06 444 44 44</p>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="text-secondary flex-shrink-0" size={20} />
                  <p className="text-gray-400">contact@etravelworld.com</p>
                </li>
              </ul>
            </div>

          </div>

          <div className="text-center pt-8">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} e-TRAVEL WORLD AGENCY. Tous droits réservés.</p>
            {/* <p className="text-gray-600 text-xs mt-1">Conçu avec la Charte Graphique GMSS.Agence.</p> */}
          </div>
        </div>
      </footer>

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
          --green-ouik: #007335;
          --cyan: #40bcd5; 
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
        .text-warning { color: var(--warning); }
        .bg-warning { background-color: var(--warning); }
        .fill-warning { fill: var(--warning); }
        .bg-green-ouik { background-color: var(--green-ouik); }
        .bg-light-bg { background-color: var(--light-bg); }


        /* 3. FIX: Classes d'opacité et de survol manquantes (utiliser rgba pour la robustesse) */
        
        /* Opacité 10% */
        .bg-primary\\/10 { background-color: rgba(27, 94, 142, 0.1); } /* #1b5e8e + 10% */
        
        /* Survol (hover) - Opacité 90% */
        /* Pour hover:bg-primary/90 */
        .hover\\:bg-primary\\/90:hover { background-color: rgba(27, 94, 142, 0.9) !important; }
        /* Pour hover:bg-secondary/90 */
        .hover\\:bg-secondary\\/90:hover { background-color: rgba(241, 143, 19, 0.9) !important; }
        /* Pour hover:bg-green/90 */
        .hover\\:bg-green\\/90:hover { background-color: rgba(0, 115, 53, 0.9) !important; }
        /* Pour hover:bg-warning/90 */
        .hover\\:bg-warning\\/90:hover { background-color: rgba(247, 180, 6, 0.9) !important; }
        
        /* Survol (hover) - Couleur de base */
        /* Pour hover:bg-primary */
        .hover\\:bg-primary:hover { background-color: var(--primary); }
        /* Pour hover:text-primary */
        .hover\\:text-primary:hover { color: var(--primary); }

        /* FIX: Ombres personnalisées pour les boutons */
        .hover\\:shadow-primary-lg:hover {
            box-shadow: 0 10px 15px -3px rgba(27, 94, 142, 0.3), 0 4px 6px -2px rgba(27, 94, 142, 0.1);
        }
        .hover\\:shadow-secondary-lg:hover {
            box-shadow: 0 10px 15px -3px rgba(241, 143, 19, 0.3), 0 4px 6px -2px rgba(241, 143, 19, 0.1);
        }

        /* Animations */
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

        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }

        @keyframes progress {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        .animate-progress {
          animation: progress 2s infinite alternate;
        }
        `}
      </style>
    </div>
  );
};

export default HomePage;