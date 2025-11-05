import React, { useState, useEffect } from 'react';
import { Menu, X, Plane, Ship, Hotel, MapPin, Shield, Calendar, Facebook, Instagram, Twitter, Linkedin, Phone, Mail, ChevronLeft, ChevronRight, ArrowRight, Globe, Star, Award, Users, Check, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // États pour les données du backend
  const [destinations, setDestinations] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    package_id: '',
    full_name: '',
    email: '',
    phone: '',
    date_reservation: '',
    travelers: '',
    message: ''
  });

  // Configuration de l'API
  const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600',
      title: 'Explorez le Monde',
      subtitle: 'avec Confiance',
      description: 'Votre agence de voyage professionnelle depuis 2019'
    },
    {
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600',
      title: 'Week-end au Congo',
      subtitle: 'Découvrez l\'Authenticité',
      description: 'Terre de richesses insoupçonnées'
    },
    {
      image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1600',
      title: 'Nature & Aventure',
      subtitle: 'Expériences Uniques',
      description: 'Des moments inoubliables vous attendent'
    },
    {
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600',
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

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Récupérer les packages au chargement
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/packages');
      const packagesData = response.data.data || response.data;
      
      // Filtrer les packages de type "destination"
      const destinationPackages = packagesData.filter(pkg => pkg.package_type === 'destination');
      
      setDestinations(destinationPackages);
      setAllPackages(packagesData);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des packages:', err);
      setError('Impossible de charger les destinations. Veuillez réessayer plus tard.');
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

  const handlePackageSelect = (packageId) => {
    setFormData(prev => ({ ...prev, package_id: packageId }));
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.package_id) {
      alert('Veuillez sélectionner un package avant de réserver.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const reservationData = {
        package_id: parseInt(formData.package_id),
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        date_reservation: formData.date_reservation,
        travelers: parseInt(formData.travelers),
        message: formData.message
      };

      console.log('Envoi de la réservation:', reservationData);
      
      await api.post('/reservations', reservationData);
      
      setSubmitSuccess(true);
      
      // Réinitialiser le formulaire
      setFormData({
        package_id: '',
        full_name: '',
        email: '',
        phone: '',
        date_reservation: '',
        travelers: '',
        message: ''
      });

      // Masquer le message de succès après 5 secondes
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

    } catch (err) {
      console.error('Erreur lors de la réservation:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi de la réservation. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95'}`}>
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

      {/* Hero Slider */}
      <section className="relative h-screen mt-20">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <p className="text-white text-sm md:text-base tracking-widest mb-4 uppercase">{slide.description}</p>
                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-tight">
                  {slide.title}
                </h2>
                <p className="text-2xl sm:text-3xl md:text-4xl text-white mb-10 font-light">
                  {slide.subtitle}
                </p>
                <button 
                  onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-4 bg-white text-gray-900 font-bold text-lg rounded-full hover:bg-gray-100 transition-all hover:shadow-2xl hover:scale-105"
                >
                  Découvrir nos offres
                </button>
              </div>
            </div>
          </div>
        ))}

        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full transition-all hover:scale-110 z-10 shadow-lg">
          <ChevronLeft className="text-gray-900" size={28} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full transition-all hover:scale-110 z-10 shadow-lg">
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
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Nos Services</h2>
            <p className="text-xl text-gray-600">Des solutions complètes pour tous vos voyages</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all">
                  <service.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">{service.title}</h3>
                <p className="text-gray-600 text-center text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="apropos" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800" 
                alt="About" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-yellow-400 rounded-xl p-6 shadow-xl">
                <Award className="text-gray-900" size={48} />
              </div>
            </div>

            <div>
              <p className="text-blue-600 font-semibold text-sm tracking-wider mb-4 uppercase">Qui sommes-nous</p>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Votre Partenaire Voyage de Confiance</h3>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong className="text-gray-900">e-TRAVEL WORLD AGENCY</strong> est un établissement de voyage créé en 2019 à Pointe Noire en République du CONGO. Notre siège social se trouve à Brazzaville.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Dématérialisée à <strong className="text-gray-900">60%</strong>, notre agence est accessible à tous grâce aux nouvelles technologies. Nous réinventons l'expérience du voyage avec professionnalisme et innovation.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8 py-6 border-t border-b border-gray-200">
                <div className="text-center">
                  <p className="text-4xl font-black text-gray-900 mb-1">500+</p>
                  <p className="text-sm text-gray-600">Clients satisfaits</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-gray-900 mb-1">50+</p>
                  <p className="text-sm text-gray-600">Destinations</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-gray-900 mb-1">4.9</p>
                  <p className="text-sm text-gray-600">Note moyenne</p>
                </div>
              </div>

              <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all hover:shadow-xl hover:scale-105 inline-flex items-center gap-2">
                En savoir plus <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section id="destinations" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Destinations Populaires</h2>
            <p className="text-xl text-gray-600">Explorez nos meilleures offres de voyage</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-gray-600 text-lg">Chargement des destinations...</p>
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

          {/* Destinations Display */}
          {!loading && !error && destinations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {destinations.map((dest) => (
                <div
                  key={dest.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={dest.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'} 
                      alt={dest.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 px-4 py-1 bg-white rounded-full text-gray-900 text-sm font-bold">
                      Destination
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-black text-gray-900 mb-3">{dest.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-2">{dest.description}</p>
                    
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                      <div>
                        <p className="text-sm text-gray-500">À partir de</p>
                        {dest.prices && dest.prices[0] && (
                          <p className="text-2xl font-black text-gray-900">
                            {formatPrice(dest.prices[0].price)} <span className="text-sm font-normal">{dest.prices[0].currency}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => handlePackageSelect(dest.id)}
                      className="w-full py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-blue-600 transition-all"
                    >
                      Réserver maintenant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && destinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Aucune destination disponible pour le moment.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <button className="px-10 py-4 bg-white border-2 border-gray-900 text-gray-900 font-bold rounded-full hover:bg-gray-900 hover:text-white transition-all hover:shadow-xl">
              Voir toutes les destinations
            </button>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="contact" className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Réservez Votre Voyage</h2>
            <p className="text-xl text-gray-600">Remplissez le formulaire et nous vous contacterons rapidement</p>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={24} />
                <div>
                  <h3 className="font-bold text-green-800 mb-1">Réservation envoyée avec succès !</h3>
                  <p className="text-green-700">Nous vous contacterons très bientôt pour confirmer votre réservation.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-8">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" size={24} />
                <div>
                  <h3 className="font-bold text-red-800 mb-1">Erreur</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-200">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Nom complet *"
                  required
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-all"
                />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Adresse email *"
                  required
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-all"
                />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Téléphone"
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-all"
                />
                <select 
                  name="package_id"
                  value={formData.package_id}
                  onChange={handleInputChange}
                  required
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-600 focus:outline-none transition-all"
                >
                  <option value="">Sélectionner une destination *</option>
                  {allPackages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title} {pkg.country ? `- ${pkg.country}` : ''}
                    </option>
                  ))}
                </select>
                <input 
                  type="date" 
                  name="date_reservation"
                  value={formData.date_reservation}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-600 focus:outline-none transition-all"
                />
                <input 
                  type="number"
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleInputChange}
                  placeholder="Nombre de voyageurs *"
                  required
                  min="1"
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-all"
                />
              </div>
              <textarea 
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Message ou demande spécifique..." 
                className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-all resize-none"
              />
              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-5 bg-gray-900 text-white font-bold text-lg rounded-full hover:bg-blue-600 transition-all hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Réserver maintenant <ArrowRight size={24} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20 px-4 bg-green-600">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-white text-2xl md:text-3xl mb-4 font-light">
            Faites partie des premiers à réserver un <strong className="font-black">OUIKENAC</strong> et bénéficiez de
          </p>
          <p className="text-8xl md:text-9xl font-black text-white mb-2">20%</p>
          <p className="text-3xl md:text-4xl font-black text-white">DE RÉDUCTION</p>
          <p className="text-green-100 text-lg mt-4">Offre limitée aux 100 premiers clients</p>
        </div>
      </section>

      {/* City Tour */}
      <section id="ouikenac" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">OUIKENAC CITY TOUR</h2>
            <p className="text-xl text-gray-600">Découverte culturelle authentique du Congo</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-16 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-blue-600 font-semibold text-sm tracking-wider mb-4 uppercase">Patrimoine & Culture</p>
                
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  <strong className="text-gray-900 text-xl">OUIKENAC CITY TOUR</strong> ce sont des journées de visite guidée du patrimoine culturel et naturel des villes des CONGO (République du CONGO & République Démocratique du CONGO).
                </p>

                <p className="text-gray-700 leading-relaxed mb-8">
                  Se déroulant tous les <strong className="text-gray-900">1ers et derniers samedis</strong> de chaque mois, plongez au cœur de l'histoire grâce à nos journées de visite guidées.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="text-white" size={20} />
                    </div>
                    <span className="text-gray-700">Guides professionnels certifiés</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="text-white" size={20} />
                    </div>
                    <span className="text-gray-700">Sites UNESCO et monuments historiques</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="text-white" size={20} />
                    </div>
                    <span className="text-gray-700">Expérience immersive et authentique</span>
                  </div>
                </div>

              <Link 
                to='/city-tour-calendar' 
                className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-500 transition-all hover:shadow-xl hover:scale-105 inline-flex items-center gap-3"
              >
                <Calendar size={24} />
                Voir le calendrier
              </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400" 
                  alt="City tour" 
                  className="rounded-xl w-full h-64 object-cover shadow-lg hover:scale-105 transition-transform duration-500"
                />
                <img 
                  src="https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400" 
                  alt="Cultural site" 
                  className="rounded-xl w-full h-64 object-cover shadow-lg hover:scale-105 transition-transform duration-500 mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <a href="/" className="block text-gray-400 hover:text-white transition-colors">Accueil</a>
                <a href="/about" className="block text-gray-400 hover:text-white transition-colors">À propos</a>
                <a href="/city-tour" className="block text-gray-400 hover:text-white transition-colors">City Tours</a>
                <a href="/weekend" className="block text-gray-400 hover:text-white transition-colors">OUIKENAC</a>
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
                © 2024 e-TRAVEL WORLD AGENCY. Tous droits réservés.
              </p>
              <p className="text-gray-500 text-sm">
                Créé avec passion par <span className="font-bold text-white">ELBO</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;