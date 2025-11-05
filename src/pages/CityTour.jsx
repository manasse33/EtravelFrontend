import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Calendar, MapPin, Clock, Users, Award, Star, Facebook, Instagram, Twitter, Linkedin, Phone, Mail, ArrowRight, Building2, Landmark, Navigation, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const CityTour = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // États pour les données du backend
  const [cityTourPackages, setCityTourPackages] = useState([]);
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
      
      // Filtrer les packages de type "city_tour"
      const cityTours = packagesData.filter(pkg => pkg.package_type === 'city_tour');
      
      setCityTourPackages(cityTours);
      setAllPackages(packagesData);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des packages:', err);
      setError('Impossible de charger les city tours. Veuillez réessayer plus tard.');
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
    setFormData(prev => ({ ...prev, package_id: packageId }));
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.package_id) {
      alert('Veuillez sélectionner un city tour avant de réserver.');
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
  const brazzavilleTours = cityTourPackages.filter(pkg => pkg.country === 'RC');
  const kinshasaTours = cityTourPackages.filter(pkg => pkg.country === 'RDC');

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
        Accueil
      </Link>
              <a href="#contact" className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium" onClick={() => setMenuOpen(false)}>Contactez-nous</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-screen mt-20 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1600)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center px-4 max-w-5xl">
              <div className="inline-block px-6 py-2 bg-yellow-400 rounded-full mb-6">
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
              <button 
                onClick={() => document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-12 py-5 bg-yellow-400 text-gray-900 font-bold text-lg rounded-full hover:bg-yellow-500 transition-all hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3"
              >
                <Calendar size={24} />
                Découvrir les tours
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/50 to-transparent h-32"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm tracking-wider mb-4 uppercase">Pourquoi choisir OUIKENAC</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Une Expérience Unique</h2>
            <p className="text-xl text-gray-600">Tous les 1ers et derniers samedis de chaque mois</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-yellow-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all">
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
      <section id="tours" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Nos City Tours Disponibles</h2>
            <p className="text-xl text-gray-600">Choisissez votre ville de départ</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-gray-600 text-lg">Chargement des city tours...</p>
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

          {/* Display City Tours */}
          {!loading && !error && cityTourPackages.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {cityTourPackages.map((tour) => (
                <div
                  key={tour.id}
                  className={`bg-white rounded-2xl overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                    tour.country === 'RC' ? 'border-green-600' : 'border-blue-600'
                  }`}
                >
                  <div className="relative h-64">
                    <img 
                      src={tour.image || 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800'} 
                      alt={tour.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-2 text-sm font-bold rounded-full ${
                        tour.country === 'RC' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {tour.country === 'RC' ? 'Brazzaville' : 'Kinshasa'}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-3xl font-black">{tour.title}</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-700 mb-6 leading-relaxed">{tour.description}</p>

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
                      className={`w-full py-4 font-bold rounded-full transition-all hover:shadow-xl flex items-center justify-center gap-2 ${
                        tour.country === 'RC' 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Calendar size={20} />
                      Réserver ce tour
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && cityTourPackages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Aucun city tour disponible pour le moment.</p>
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
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-green-600 font-semibold text-sm tracking-wider uppercase">République du Congo</p>
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
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Landmark className="text-white" size={14} />
                    </div>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>

              {brazzavilleTours.length > 0 && (
                <button 
                  onClick={() => handlePackageSelect(brazzavilleTours[0].id)}
                  className="px-8 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all hover:shadow-xl hover:scale-105 inline-flex items-center gap-3"
                >
                  <Calendar size={20} />
                  Réserver Brazzaville Tour
                </button>
              )}
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-5238050093457448845a9e53?w=600" 
                  alt="Brazzaville architecture" 
                  className="rounded-2xl w-full h-72 object-cover shadow-lg hover:scale-105 transition-transform duration-500"
                />
                <img 
                  src="https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600" 
                  alt="Pont du 15 Août" 
                  className="rounded-2xl w-full h-72 object-cover shadow-lg hover:scale-105 transition-transform duration-500 mt-8"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-green-600 rounded-xl p-6 shadow-xl">
                <Building2 className="text-white" size={48} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kinshasa Section */}
      <section id="kinshasa" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600" 
                  alt="Kinshasa cityscape" 
                  className="rounded-2xl w-full h-72 object-cover shadow-lg hover:scale-105 transition-transform duration-500"
                />
                <img 
                  src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600" 
                  alt="Tour Échangeur Limété" 
                  className="rounded-2xl w-full h-72 object-cover shadow-lg hover:scale-105 transition-transform duration-500 mt-8"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-blue-600 rounded-xl p-6 shadow-xl">
                <Navigation className="text-white" size={48} />
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase">République Démocratique du Congo</p>
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
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Landmark className="text-white" size={14} />
                    </div>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>

              {kinshasaTours.length > 0 && (
                <button 
                  onClick={() => handlePackageSelect(kinshasaTours[0].id)}
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all hover:shadow-xl hover:scale-105 inline-flex items-center gap-3"
                >
                  <Calendar size={20} />
                  Réserver Kinshasa Tour
                </button>
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
                  <option value="">Sélectionner un city tour *</option>
                  {cityTourPackages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title} - {pkg.country === 'RC' ? 'Brazzaville' : 'Kinshasa'}
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
                  placeholder="Nombre de participants *"
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
                    Confirmer la réservation <ArrowRight size={24} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-900 text-2xl md:text-3xl mb-4 font-light">
            Réservez votre <strong className="font-black">OUIKENAC City Tour</strong> maintenant
          </p>
          <p className="text-7xl md:text-8xl font-black text-gray-900 mb-4">20%</p>
          <p className="text-3xl md:text-4xl font-black text-gray-900 mb-6">DE RÉDUCTION</p>
          <p className="text-gray-800 text-lg mb-8">Pour les 100 premiers inscrits</p>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 bg-gray-900 text-white font-bold text-lg rounded-full hover:bg-gray-800 transition-all hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3"
          >
            Je réserve maintenant <ArrowRight size={24} />
          </button>
        </div>
      </section>

      {/* Schedule Info */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-50 rounded-2xl p-12 border-2 border-gray-200">
            <Calendar className="mx-auto text-blue-600 mb-6" size={64} />
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Fréquence des Tours
            </h3>
            <p className="text-xl text-gray-700 mb-8">
              Tous les <strong className="text-blue-600">1ers et derniers samedis</strong> de chaque mois
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl text-left">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-gray-900">Remarque importante :</strong> Les dates exactes des tours peuvent varier selon les événements spéciaux et les jours fériés. Nous vous confirmerons la date exacte lors de votre réservation.
              </p>
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

export default CityTour;