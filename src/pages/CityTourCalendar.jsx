import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Calendar, MapPin, Clock, Users, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, ArrowRight, Loader, AlertCircle, CheckCircle, Building2 } from 'lucide-react';

// Composant de notification moderne
const Notification = ({ show, message, type, onClose }) => {
  if (!show) return null;

  const icons = {
    success: <CheckCircle size={24} />,
    error: <AlertCircle size={24} />,
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
            {type === 'success' ? 'Succès' : type === 'error' ? 'Erreur' : 'Information'}
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

const CityTourCalendar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cityTours, setCityTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  // Récupérer les city tours au chargement
  useEffect(() => {
    fetchCityTours();
  }, []);

  const fetchCityTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://127.0.0.1:8000/api/city-tours');
      if (!response.ok) throw new Error('Erreur de chargement');
      const data = await response.json();
      console.log('City tours récupérés:', data);
      const toursData = Array.isArray(data) ? data : (data.data || []);
      setCityTours(toursData);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des city tours:', err);
      setError('Impossible de charger le calendrier. Veuillez réessayer plus tard.');
      showNotification('Impossible de charger le calendrier. Veuillez réessayer plus tard.', 'error');
      setLoading(false);
    }
  };

  // Grouper les tours par mois
  const groupByMonth = (tours) => {
    const grouped = {};
    tours.forEach(tour => {
      if (tour.scheduled_date) {
        const date = new Date(tour.scheduled_date);
        const monthYear = `${date.toLocaleString('fr-FR', { month: 'long' })} ${date.getFullYear()}`;
        if (!grouped[monthYear]) {
          grouped[monthYear] = [];
        }
        grouped[monthYear].push(tour);
      }
    });
    
    // Trier par date dans chaque mois
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
    });
    
    return grouped;
  };

  const toursByMonth = groupByMonth(cityTours);

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
      date: date.getDate(),
      month: date.toLocaleDateString('fr-FR', { month: 'short' }),
      fullDate: date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
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
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Accueil</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">À propos</a>
              <a href="/weekend" className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-500 transition-all hover:shadow-lg">
                OUIKENAC
              </a>
              <a href="/city-tour" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">CityTour</a>
              <a href="#calendrier" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Calendrier</a>
            </nav>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-900 p-2">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              <a 
                href="/" 
                className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium border-b border-gray-100" 
                onClick={() => setMenuOpen(false)}
              >
                Accueil
              </a>
              <a 
                href="/about" 
                className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium border-b border-gray-100" 
                onClick={() => setMenuOpen(false)}
              >
                À propos
              </a>
              <a 
                href="/weekend" 
                className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium border-b border-gray-100" 
                onClick={() => setMenuOpen(false)}
              >
                Ouikenac
              </a>
              <a 
                href="/city-tour" 
                className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium border-b border-gray-100" 
                onClick={() => setMenuOpen(false)}
              >
                CityTour
              </a>
              <a href="#calendrier" className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium" onClick={() => setMenuOpen(false)}>Calendrier</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-96 mt-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1600)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl">
              <p className="text-yellow-400 text-sm md:text-base tracking-widest mb-4 uppercase font-bold">Découverte Culturelle</p>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-4 leading-tight">
                CALENDRIER
              </h2>
              <p className="text-2xl sm:text-3xl text-white mb-6 font-light">
                OUIKENAC City Tour
              </p>
              <p className="text-white text-lg max-w-2xl mx-auto">
                Consultez les dates de nos prochaines visites guidées du patrimoine congolais
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-8 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white">
            <div className="flex items-center justify-center gap-3">
              <Calendar className="flex-shrink-0" size={32} />
              <div className="text-left">
                <p className="text-sm opacity-90">Fréquence</p>
                <p className="font-bold text-lg">1er et dernier samedi</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Users className="flex-shrink-0" size={32} />
              <div className="text-left">
                <p className="text-sm opacity-90">Visites guidées</p>
                <p className="font-bold text-lg">Guides certifiés</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MapPin className="flex-shrink-0" size={32} />
              <div className="text-left">
                <p className="text-sm opacity-90">Patrimoine</p>
                <p className="font-bold text-lg">Sites authentiques</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section id="calendrier" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Prochaines Visites</h2>
            <p className="text-xl text-gray-600">Découvrez notre programme de city tours</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <Loader className="animate-spin h-16 w-16 text-blue-600" />
                <div className="absolute inset-0 h-16 w-16 border-4 border-blue-200 rounded-full"></div>
              </div>
              <p className="text-gray-600 text-lg mt-6">Chargement du calendrier...</p>
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
                onClick={fetchCityTours}
                className="mt-4 px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Calendar Display */}
          {!loading && !error && Object.keys(toursByMonth).length > 0 && (
            <div className="space-y-16">
              {Object.entries(toursByMonth).map(([monthYear, tours], index) => (
                <div key={index} className="mb-12">
                  {/* Month Header */}
                  <div className="text-center mb-12">
                    <div className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full mb-2">
                      <h3 className="text-3xl md:text-4xl font-black uppercase">{monthYear}</h3>
                    </div>
                  </div>

                  {/* Tours Timeline */}
                  <div className="space-y-8">
                    {tours.map((tour, tourIndex) => {
                      const dateInfo = formatDate(tour.scheduled_date);
                      return (
                        <div
                          key={tour.id}
                          className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-blue-600 hover:shadow-2xl transition-all duration-500"
                        >
                          <div className="flex flex-col md:flex-row">
                            {/* Date Badge */}
                            <div className="md:w-48 bg-gradient-to-br from-blue-600 to-blue-700 p-8 flex flex-col items-center justify-center text-white">
                              <p className="text-sm uppercase tracking-wider mb-2">{dateInfo.day}</p>
                              <p className="text-6xl font-black mb-2">{dateInfo.date}</p>
                              <p className="text-xl uppercase tracking-wide">{dateInfo.month}</p>
                              <div className="mt-4 px-4 py-2 bg-white/20 rounded-full">
                                <Clock className="inline mr-2" size={16} />
                                <span className="text-sm font-bold">À venir</span>
                              </div>
                            </div>

                            {/* Tour Image */}
                            <div className="md:w-80 relative overflow-hidden">
                              <img 
                                src={tour.image ? `http://127.0.0.1:8000/storage/${tour.image}` : 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800'} 
                                alt={tour.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                              <div className="absolute bottom-4 left-4 right-4">
                                {tour.active && (
                                  <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                    Disponible
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Tour Details */}
                            <div className="flex-1 p-8">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="text-3xl font-black text-gray-900 mb-2">{tour.title}</h4>
                                  <div className="flex items-center gap-4 text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <MapPin size={18} className="text-blue-600" />
                                      <span className="text-sm font-medium">{tour.city?.name || 'Ville'}</span>
                                    </div>
                                    {tour.min_people && (
                                      <div className="flex items-center gap-2">
                                        <Users size={18} className="text-blue-600" />
                                        <span className="text-sm font-medium">{tour.min_people}-{tour.max_people || '+'} pers.</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <Building2 className="text-blue-600" size={32} />
                              </div>

                              <p className="text-gray-700 leading-relaxed mb-6">
                                {tour.description || 'Découvrez le patrimoine culturel et architectural de cette magnifique ville à travers une visite guidée passionnante avec nos guides experts.'}
                              </p>

                              {/* Program/Details Section */}
                              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl">
                                <h5 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                  <Calendar size={18} />
                                  Programme de la visite
                                </h5>
                                <ul className="space-y-2 text-sm text-blue-800">
                                  <li>• Visite guidée du patrimoine historique</li>
                                  <li>• Découverte des sites emblématiques</li>
                                  <li>• Narration culturelle par nos experts</li>
                                  <li>• Moments de détente et rafraîchissements</li>
                                </ul>
                              </div>

                              <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                  <p className="font-semibold">Date complète : {dateInfo.fullDate}</p>
                                </div>
                                <a 
                                  href="/city-tour"
                                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all hover:shadow-lg inline-flex items-center gap-2"
                                >
                                  Plus d'infos <ArrowRight size={18} />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Tours State */}
          {!loading && !error && cityTours.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-200">
              <Calendar className="mx-auto text-gray-400 mb-6" size={64} />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune visite programmée</h3>
              <p className="text-gray-600 mb-6">
                Le calendrier des prochaines visites sera bientôt disponible.
              </p>
              <a 
                href="/city-tour"
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all"
              >
                Découvrir nos City Tours <ArrowRight size={20} />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
            Rejoignez-nous pour une aventure culturelle unique !
          </h3>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Explorez le patrimoine authentique du Congo avec nos guides experts. Chaque visite est une plongée dans l'histoire et la culture congolaise.
          </p>
          <a 
            href="/city-tour"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-green-700 font-bold text-lg rounded-full hover:bg-gray-100 transition-all hover:shadow-2xl hover:scale-105"
          >
            Réserver maintenant <ArrowRight size={24} />
          </a>
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
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">OUIKENAC</h3>
              <div className="space-y-3">
                <a href="#calendrier" className="block text-gray-400 hover:text-white transition-colors">Calendrier</a>
                <a href="/city-tour" className="block text-gray-400 hover:text-white transition-colors">Patrimoine</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">FAQ</a>
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

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CityTourCalendar;