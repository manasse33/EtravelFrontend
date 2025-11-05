import React, { useState } from 'react';
import { Menu, X, Globe, Calendar, MapPin, Clock, Users, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, ChevronRight, Gift, Coffee, Camera, Waves, Dumbbell, Film, Fish, Palette, ChevronLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const CityTourCalendar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: '', email: '', phone: '', event: '', participants: '', message: ''
  });

  const events = [
    {
      month: 'NOVEMBRE',
      year: '2024',
      tours: [
        {
          date: 'Samedi 08',
          title: 'Patrimoine Canonique',
          image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800',
          inclusions: [
            { icon: Coffee, text: 'Soirée mbongui-léfourina' },
            { icon: Camera, text: 'Narration historique sur André Grenard Matsaou (au Kinda Garden Lounge)' },
            { icon: Coffee, text: 'Boissons' },
            { icon: Gift, text: 'Lot à gagner - tirage au sort' }
          ],
          price: '15.000',
          groupPrice: '90.000',
          groupSize: 6,
          tag: 'Culture'
        },
        {
          date: 'Samedi 22',
          title: 'Patrimoine Culturel-Artisanal',
          image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800',
          inclusions: [
            { icon: MapPin, text: 'Visite guidée de la ville de Brazzaville' },
            { icon: Palette, text: 'Atelier pratique de la céramique' },
            { icon: Coffee, text: 'Rafraîchissement' },
            { icon: Coffee, text: 'Casse-croûte' },
            { icon: Gift, text: 'Lot à gagner - tirage au sort' }
          ],
          price: '17.500',
          groupPrice: '95.000',
          groupSize: 6,
          tag: 'Artisanat'
        }
      ]
    },
    {
      month: 'DÉCEMBRE',
      year: '2024',
      tours: [
        {
          date: 'Samedi 06',
          title: 'Majestueux Fleuve CONGO',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
          inclusions: [
            { icon: Waves, text: 'Visite guidée nautique de Brazzaville' },
            { icon: Coffee, text: 'Rafraîchissement' },
            { icon: Fish, text: 'Pêche sportive' },
            { icon: Coffee, text: 'Barbecue' },
            { icon: Gift, text: 'Lots à gagner' }
          ],
          price: '35.500',
          groupPrice: '203.000',
          groupSize: 6,
          tag: 'Nautique'
        },
        {
          date: 'Samedi 27',
          title: 'OUIKENAC Bien-être',
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
          inclusions: [
            { icon: Dumbbell, text: 'Séance step en plein air' },
            { icon: Coffee, text: 'Rafraîchissement' },
            { icon: Film, text: 'Projection film documentaire (au Kinda Garden Lounge)' },
            { icon: Gift, text: 'Lot à gagner - tirage au sort' }
          ],
          price: '15.000',
          groupPrice: '90.000',
          groupSize: 6,
          tag: 'Bien-être'
        }
      ]
    }
  ];

  const handleInputChange = (e) => {
    setBookingForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBooking = (event) => {
    setSelectedEvent(event);
    setBookingForm(prev => ({ ...prev, event: `${event.date} - ${event.title}` }));
    window.scrollTo({ top: document.getElementById('booking-form').offsetTop - 100, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.event || !bookingForm.participants) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    alert(`Réservation pour "${bookingForm.event}" soumise avec succès ! Nous vous contacterons bientôt.`);
    setBookingForm({ name: '', email: '', phone: '', event: '', participants: '', message: '' });
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-white">
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
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Accueil</a>
              <a href="#calendrier" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Calendrier</a>
              <a href="#booking-form" className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-500 transition-all hover:shadow-lg">
                Réserver
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
            </nav>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-900 p-2">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              <a href="#" className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium border-b border-gray-100" onClick={() => setMenuOpen(false)}>Accueil</a>
              <a href="#calendrier" className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium border-b border-gray-100" onClick={() => setMenuOpen(false)}>Calendrier</a>
              <a href="#booking-form" className="block text-yellow-600 hover:text-yellow-700 py-3 text-base font-bold border-b border-gray-100" onClick={() => setMenuOpen(false)}>Réserver</a>
              <a href="#" className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium" onClick={() => setMenuOpen(false)}>Contact</a>
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
                OUIKENAC CITY TOUR
              </h2>
              <p className="text-2xl sm:text-3xl text-white mb-6 font-light">
                Calendrier 2024-2025
              </p>
              <p className="text-white text-lg max-w-2xl mx-auto">
                Explorez le patrimoine culturel et naturel de Brazzaville avec nos visites guidées
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
                <p className="text-sm opacity-90">Tarif groupe</p>
                <p className="font-bold text-lg">Réduction de 6+ personnes</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Gift className="flex-shrink-0" size={32} />
              <div className="text-left">
                <p className="text-sm opacity-90">Bonus</p>
                <p className="font-bold text-lg">Lots à gagner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section id="calendrier" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {events.map((monthData, monthIndex) => (
            <div key={monthIndex} className="mb-20 last:mb-0">
              <div className="text-center mb-12">
                <div className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full mb-4">
                  <h2 className="text-3xl md:text-4xl font-black">{monthData.month}</h2>
                </div>
                <p className="text-gray-500 text-lg">{monthData.year}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {monthData.tours.map((tour, tourIndex) => (
                  <div
                    key={tourIndex}
                    className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-blue-600 hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4 px-4 py-2 bg-yellow-400 rounded-full text-gray-900 text-sm font-bold">
                        {tour.tag}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-lg font-bold mb-1">{tour.date}</p>
                        <h3 className="text-white text-2xl md:text-3xl font-black">{tour.title}</h3>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <ChevronRight className="text-blue-600" size={20} />
                          Ce qui est inclus
                        </h4>
                        <div className="space-y-3">
                          {tour.inclusions.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-gray-700">
                              <item.icon className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                              <span className="text-sm leading-relaxed">{item.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Tarif individuel</p>
                            <p className="text-2xl font-black text-gray-900">
                              {tour.price} <span className="text-sm font-normal">XAF</span>
                            </p>
                          </div>
                          <button
                            onClick={() => handleBooking(tour)}
                            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all hover:shadow-lg"
                          >
                            Réserver
                          </button>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-green-700 mb-1">Tarif groupe ({tour.groupSize} pers.)</p>
                              <p className="text-xl font-black text-green-700">
                                {tour.groupPrice} <span className="text-sm font-normal">XAF</span>
                              </p>
                            </div>
                            <button
                              onClick={() => handleBooking(tour)}
                              className="px-5 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all text-sm"
                            >
                              Réserver
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Réservez votre visite
            </h2>
            {selectedEvent && (
              <div className="inline-block px-6 py-3 bg-blue-50 border border-blue-200 rounded-full mb-4">
                <p className="text-blue-700 font-bold">
                  {selectedEvent.date} - {selectedEvent.title}
                </p>
              </div>
            )}
            <p className="text-xl text-gray-600">Remplissez le formulaire et nous vous contacterons rapidement</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border-2 border-gray-200">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  value={bookingForm.name}
                  onChange={handleInputChange}
                  placeholder="Nom complet *"
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-all"
                />
                <input
                  type="email"
                  name="email"
                  value={bookingForm.email}
                  onChange={handleInputChange}
                  placeholder="Adresse email *"
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-all"
                />
                <input
                  type="tel"
                  name="phone"
                  value={bookingForm.phone}
                  onChange={handleInputChange}
                  placeholder="Téléphone *"
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-all"
                />
                <select
                  name="participants"
                  value={bookingForm.participants}
                  onChange={handleInputChange}
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-600 focus:outline-none transition-all"
                >
                  <option value="">Nombre de participants *</option>
                  <option value="1">1 personne</option>
                  <option value="2">2 personnes</option>
                  <option value="3">3 personnes</option>
                  <option value="4">4 personnes</option>
                  <option value="5">5 personnes</option>
                  <option value="6+">6+ personnes (tarif groupe)</option>
                </select>
              </div>
              
              <input
                type="text"
                name="event"
                value={bookingForm.event}
                onChange={handleInputChange}
                placeholder="Sélectionnez une visite ci-dessus *"
                readOnly
                className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-all"
              />

              <textarea
                rows={4}
                name="message"
                value={bookingForm.message}
                onChange={handleInputChange}
                placeholder="Message ou demande spécifique..."
                className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-all resize-none"
              />

              <button
                onClick={handleSubmit}
                className="w-full py-5 bg-gray-900 text-white font-bold text-lg rounded-full hover:bg-blue-600 transition-all hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
              >
                Confirmer la réservation <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-white text-2xl md:text-3xl mb-4 font-light">
            Faites partie des premiers à réserver un <strong className="font-black">OUIKENAC</strong> et bénéficiez de
          </p>
          <p className="text-8xl md:text-9xl font-black text-white mb-2">20%</p>
          <p className="text-3xl md:text-4xl font-black text-white">DE RÉDUCTION</p>
          <p className="text-green-100 text-lg mt-4">Offre limitée aux 100 premiers clients</p>
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
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Accueil</a>
                <a href="#calendrier" className="block text-gray-400 hover:text-white transition-colors">Calendrier</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Destinations</a>
                <a href="#booking-form" className="block text-gray-400 hover:text-white transition-colors">Réserver</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">OUIKENAC</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">City Tour</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Patrimoine</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Tarifs</a>
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

export default CityTourCalendar;