import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Calendar,ChevronLeft,ChevronRight, MapPin, Clock, Users, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, ArrowRight, Loader, AlertCircle, CheckCircle, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // <--- AJOUT POUR LA COMMUNICATION API

// Base URL de l'API (Assumée)
const API_BASE = 'https://etravelbackend-production.up.railway.app/api'; 


// ============= COMPOSANTS RÉUTILISABLES (Harmonisés) =============

// Composant Button réutilisable
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
    error: <AlertCircle size={24} />,
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


// ============= COMPOSANT CALENDRIER DU CITY TOUR (MISE À JOUR) =============

const CityTourCalendar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // État pour les événements récupérés de la DB
  const [tourEvents, setTourEvents] = useState([]);

  // Fonction de notification réutilisable
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
  };
    
  // NOUVELLE LOGIQUE: Fonction pour récupérer les événements depuis l'API
  const fetchTourEvents = async () => {
    setLoading(true);
    try {
        // Appel à l'endpoint de l'API Laravel
        const response = await axios.get(`${API_BASE}/city-tours`);
        
        // Adaptation des données de la DB au format attendu par le calendrier: { date, title, country }
        // ATTENTION : Les champs 'tour_date' et 'country_code' sont des ASSUMPTIONS de votre schéma de DB. 
        // Si les noms des champs sont différents (ex: 'date_debut', 'city'), ajustez-les ici.
       // Lignes 110-118 (CORRIGÉES)
const formattedEvents = response.data.map(event => {
    // 1. Définir la date à partir de 'scheduled_date'
    const rawDate = event.scheduled_date;

    // 2. Définir le titre du tour
    const cityName = event.city ? event.city.name : 'Ville inconnue';
    const tourTitle = event.title && event.title.trim() !== '' ? event.title : `Tour à ${cityName}`;

    // 3. Définir le code pays
    const countryCode = event.country ? event.country.code : 'N/A';
    
    return {
        // Utiliser le champ 'scheduled_date'
        date: rawDate ? new Date(rawDate).toISOString().split('T')[0] : null, 
        // Utiliser le titre ou un titre générique basé sur la ville
        title: tourTitle,
        // Utiliser event.country.code pour obtenir 'RC', 'RDC', etc.
        country: countryCode, 
    };
}).filter(event => event.date); // S'assurer que chaque événement a une date valide // S'assurer que chaque événement a une date valide

        setTourEvents(formattedEvents);
        showNotification(`Succès : ${formattedEvents.length} tours chargés depuis la BD.`, 'success');
    } catch (error) {
        console.error("Erreur lors du chargement des événements du City Tour:", error);
        const errorMessage = error.response ? `Erreur ${error.response.status} : Impossible de connecter à l'API.` : 'Erreur réseau : Vérifiez votre connexion.';
        showNotification(errorMessage, 'error');
        setTourEvents([]);
    } finally {
        setLoading(false);
    }
  };


  useEffect(() => {
    // 1. Charger les événements de la DB au montage du composant
    fetchTourEvents(); 

    // 2. Gestion du scroll pour le header
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gestion du calendrier
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Ajuster le premier jour pour que la semaine commence le Lundi (1)
    const startDayIndex = (firstDay === 0) ? 6 : firstDay - 1; 

    const days = [];
    // Ajouter les jours précédents du mois précédent pour aligner la grille
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startDayIndex; i > 0; i--) {
        days.push({ day: prevMonthDays - i + 1, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthDays - i + 1) });
    }

    // Ajouter les jours du mois actuel
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }

    // Remplir le reste de la grille avec les jours du mois suivant
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let i = 1; i <= remainingDays && days.length < 42; i++) {
        days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }
    
    return days;
  };

  const handleDayClick = (dayObject) => {
    setSelectedDate(dayObject.date);
    showNotification(`Vous avez sélectionné le ${dayObject.date.toLocaleDateString('fr-FR')}.`, 'success');
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Fonction pour vérifier si une date a un événement
  const getEventForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return tourEvents.find(event => event.date === dateString);
  };

  // Composant pour afficher un événement spécifique
  const TourItem = ({ event }) => {
    const isRC = event.country === 'RC';
    const bgColor = isRC ? 'bg-green' : 'bg-primary';
    const textColor = isRC ? 'text-green' : 'text-primary';
    const countryName = isRC ? 'Brazzaville (RC)' : 'Kinshasa (RDC)';
    const logoIcon = isRC ? <Building2 size={20} /> : <MapPin size={20} />;

    return (
      <div className={`p-4 rounded-xl shadow-lg border border-gray-200 transition-all hover:shadow-xl hover:border-primary/50`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`px-3 py-1 text-xs font-bold rounded-full text-white ${bgColor}`}>
            {countryName}
          </div>
          <span className={`text-sm font-semibold ${textColor}`}>
            {event.date ? new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Date à venir'}
          </span>
        </div>
        <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          {logoIcon}
          {event.title}
        </h4>
        <p className="text-gray-600 text-sm mb-4">
          Découvrez une immersion culturelle inoubliable.
        </p>
        <Link to="/city-tour">
            <button 
                className={`w-full py-2 font-bold rounded-full text-white transition-all hover:shadow-lg flex items-center justify-center gap-2 ${bgColor} hover:opacity-90`}
            >
                Réserver ce tour <ArrowRight size={18} />
            </button>
        </Link>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-light-bg">
      {/* Notification */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: '', type: '' })}
      />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
                <img src="logo.png" alt="" width={100}/>
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

      {/* Hero / Title Section */}
      <section className="pt-32 pb-16 px-4 bg-white shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
            {/* Utilisation de la couleur primaire */}
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
                Calendrier des Tours
            </h2>
            <p className="text-xl text-gray-600">
                Consultez les dates de nos prochains <strong className="text-primary font-bold">OUIKENAC City Tours</strong>.
            </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Calendar View */}
            <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={goToPreviousMonth} className="p-3 rounded-full hover:bg-light-bg transition-colors">
                        <ChevronLeft size={24} className="text-gray-700" />
                    </button>
                    <h3 className="text-2xl font-bold capitalize text-primary">
                        {monthName}
                    </h3>
                    <button onClick={goToNextMonth} className="p-3 rounded-full hover:bg-light-bg transition-colors">
                        <ChevronRight size={24} className="text-gray-700" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                    {dayNames.map(day => (
                        // Utilisation de la couleur primaire
                        <div key={day} className="text-sm font-semibold text-primary pb-3 border-b-2 border-primary/20">
                            {day}
                        </div>
                    ))}
                </div>

                {loading ? (
                     <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <Loader className="animate-spin h-12 w-12 text-primary" />
                            <div className="absolute inset-0 h-12 w-12 border-4 border-primary/20 rounded-full"></div>
                        </div>
                        <p className="text-gray-600 text-lg mt-4">Chargement du calendrier...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-7 gap-1 mt-4">
                        {days.map((dayObj, index) => {
                            const isToday = dayObj.isCurrentMonth && dayObj.date.toDateString() === new Date().toDateString();
                            const isSelected = selectedDate && dayObj.date.toDateString() === selectedDate.toDateString();
                            const hasEvent = dayObj.isCurrentMonth && getEventForDate(dayObj.date);
                            const eventCountry = hasEvent ? hasEvent.country : null;
                            const isRC = eventCountry === 'RC';
                            const isRDC = eventCountry === 'RDC';

                            return (
                                <div 
                                    key={index}
                                    className={`p-1 flex justify-center items-center h-16 transition-all duration-200 
                                        ${dayObj.isCurrentMonth ? 'text-gray-900 cursor-pointer hover:bg-primary/10 rounded-lg' : 'text-gray-400'}
                                        ${isSelected ? 'bg-primary text-white rounded-lg' : ''}
                                    `}
                                    onClick={() => dayObj.isCurrentMonth && handleDayClick(dayObj)}
                                >
                                    <div className={`flex flex-col items-center justify-center w-full h-full rounded-lg ${isToday && !isSelected ? 'border-2 border-primary' : ''}`}>
                                        <span className={`text-lg font-semibold ${isSelected ? 'text-white' : (isToday ? 'text-primary' : 'text-gray-900')}`}>
                                            {dayObj.day}
                                        </span>
                                        {hasEvent && (
                                            <div className="flex gap-1 mt-1">
                                                <div 
                                                    className={`w-2 h-2 rounded-full ${isRC ? 'bg-green' : 'bg-primary'} ${isSelected ? 'bg-white' : ''}`}
                                                    title={isRC ? 'Tour Brazzaville' : 'Tour Kinshasa'}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Event List / Legend */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                    <h4 className="text-xl font-black text-gray-900 mb-6 border-b pb-3">Légende</h4>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0"></div>
                            <span className="text-gray-700 font-medium">Kinshasa (RDC) Tour</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-4 h-4 rounded-full bg-green flex-shrink-0"></div>
                            <span className="text-gray-700 font-medium">Brazzaville (RC) Tour</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-4 h-4 rounded-full border-2 border-primary flex-shrink-0"></div>
                            <span className="text-gray-700 font-medium">Aujourd'hui</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xl font-black text-gray-900 mb-4 border-b pb-3">Événements en cours</h4>
                    {tourEvents.length > 0 ? (
                        tourEvents
                            .filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)))
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((event, index) => (
                                <TourItem key={index} event={event} />
                            ))
                    ) : (
                        <div className="p-6 bg-white rounded-xl text-center border border-gray-200">
                            <Calendar className="mx-auto text-gray-400 mb-3" size={32} />
                            <p className="text-gray-600">Aucun tour planifié pour le moment.</p>
                        </div>
                    )}
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

      {/* Styles d'animations existants */}
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
      
      {/* ************************************************
         * BLOC DE STYLE CONFIRMÉ COMME FONCTIONNEL
         * (Ajout de la classe manquante '.border-primary\/50' pour la robustesse)
         ************************************************
      */}
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
        
        /* Opacité 10% / 20% / 30% / 50% */
        .bg-primary\\/10 { background-color: rgba(27, 94, 142, 0.1); }
        .border-primary\\/20 { border-color: rgba(27, 94, 142, 0.2); }
        .border-primary\\/30 { border-color: rgba(27, 94, 142, 0.3); }
        /* CLASSE MANQUANTE AJOUTÉE */
        .border-primary\\/50 { border-color: rgba(27, 94, 142, 0.5); } 


        /* Survol (hover) - Opacité 90% (avec !important conservé) */
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

export default CityTourCalendar;