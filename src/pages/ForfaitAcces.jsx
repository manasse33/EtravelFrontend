import React, { useState } from 'react';
import { Menu, X, Globe, Utensils, Home, Car, Ship, MapPin, Users, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Star, Check, ArrowRight, Info, Calendar, Clock } from 'lucide-react';

const ForfaitAcces = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const inclusions = [
    { icon: Utensils, title: 'Petit déjeuner', desc: 'Petit déjeuner continental inclus chaque matin' },
    { icon: Home, title: 'Hébergement', desc: 'Hôtel 3-4 étoiles, chambre double confort' },
    { icon: Car, title: 'Transport', desc: 'Transferts aéroport et déplacements inclus' },
    { icon: Ship, title: 'Traversée', desc: 'Traversée fluviale avec guide professionnel' },
    { icon: MapPin, title: 'Visite touristique', desc: 'Découverte des sites emblématiques' }
  ];

  const packages = [
    {
      departure: 'Brazzaville',
      transport: true,
      price: '450.000',
      currency: 'XAF',
      persons: 2,
      duration: '3 jours / 2 nuits',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'
    },
    {
      departure: 'Pointe-Noire',
      transport: true,
      price: '520.000',
      currency: 'XAF',
      persons: 2,
      duration: '3 jours / 2 nuits',
      highlight: true,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    },
    {
      departure: 'Kinshasa',
      transport: false,
      price: '650',
      currency: 'USD',
      persons: 2,
      duration: '3 jours / 2 nuits',
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800'
    }
  ];

  const handleReservation = (pkg) => {
    setSelectedPackage(pkg);
    alert(`Réservation initiée pour le départ de ${pkg.departure}. Prix: ${pkg.price} ${pkg.currency} pour ${pkg.persons} personnes.`);
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
              <a href="#forfaits" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Forfaits</a>
              <a href="#inclusions" className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-500 transition-all hover:shadow-lg">
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
              <a href="#forfaits" className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium border-b border-gray-100" onClick={() => setMenuOpen(false)}>Forfaits</a>
              <a href="#inclusions" className="block text-yellow-600 hover:text-yellow-700 py-3 text-base font-bold border-b border-gray-100" onClick={() => setMenuOpen(false)}>Réserver</a>
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
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl">
              <div className="inline-block px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full mb-6 text-sm tracking-wider">
                PACKAGE PREMIUM
              </div>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-4 leading-tight">
                Forfait Acces L
              </h2>
              <p className="text-xl sm:text-2xl text-white mb-8 font-light">
                Découverte authentique des deux Congo
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <Calendar size={24} />
                  <span className="font-semibold">3 jours / 2 nuits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={24} />
                  <span className="font-semibold">2 personnes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={24} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">Tout inclus</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Banner */}
      <section className="py-6 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 text-white text-center">
            <Info size={24} />
            <p className="text-lg font-semibold">
              Offre spéciale : Réduction de 15% pour les groupes de 4 personnes et plus
            </p>
          </div>
        </div>
      </section>

      {/* Inclusions Section */}
      <section id="inclusions" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Ce qui est inclus</h2>
            <p className="text-xl text-gray-600">Profitez d'une expérience complète et sans souci</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {inclusions.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all">
                  <item.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">{item.title}</h3>
                <p className="text-gray-600 text-center text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Featured Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative h-96 rounded-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200"
                alt="Destination"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-2xl font-black">Découverte culturelle</p>
                <p className="text-sm opacity-90">Patrimoine des deux Congo</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative h-44 rounded-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600"
                  alt="Culture"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="relative h-44 rounded-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600"
                  alt="Nature"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="forfaits" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Tarification</h2>
            <p className="text-xl text-gray-600">Choisissez votre point de départ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  pkg.highlight ? 'border-yellow-400 shadow-xl' : 'border-gray-200'
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-4 py-1 bg-yellow-400 text-gray-900 font-bold rounded-full text-sm">
                      POPULAIRE
                    </div>
                  </div>
                )}

                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.departure}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-2xl font-black mb-1">{pkg.departure}</h3>
                    {pkg.transport && (
                      <p className="text-white/90 text-sm">+ Transport inclus</p>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tarif pour {pkg.persons} personnes</p>
                      <p className="text-4xl font-black text-gray-900">
                        {pkg.price}
                        <span className="text-lg font-normal text-gray-600 ml-2">{pkg.currency}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Check className="text-green-600 flex-shrink-0" size={20} />
                      <span className="text-sm">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Check className="text-green-600 flex-shrink-0" size={20} />
                      <span className="text-sm">Toutes inclusions mentionnées</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Check className="text-green-600 flex-shrink-0" size={20} />
                      <span className="text-sm">Guide francophone</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Check className="text-green-600 flex-shrink-0" size={20} />
                      <span className="text-sm">Assurance voyage</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReservation(pkg)}
                    className={`w-full py-4 font-bold rounded-full transition-all hover:shadow-xl flex items-center justify-center gap-2 ${
                      pkg.highlight
                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                        : 'bg-gray-900 text-white hover:bg-blue-600'
                    }`}
                  >
                    Réserver maintenant
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Group Discount Banner */}
          <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="text-green-600" size={32} />
              <h3 className="text-2xl font-black text-gray-900">Tarif Groupe</h3>
            </div>
            <p className="text-gray-700 text-lg mb-4">
              Voyagez à plusieurs et économisez jusqu'à <strong className="text-green-600">15%</strong>
            </p>
            <p className="text-gray-600">
              Valable pour les groupes de 4 personnes et plus. Contactez-nous pour un devis personnalisé.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 border-2 border-gray-200">
            <h3 className="text-3xl font-black text-gray-900 mb-6 text-center">Informations importantes</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Check className="text-blue-600" size={20} />
                  À savoir
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Passeport valide requis</li>
                  <li>• Vaccinations à jour recommandées</li>
                  <li>• Confirmation 48h avant le départ</li>
                  <li>• Âge minimum : 18 ans</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="text-blue-600" size={20} />
                  Politique d'annulation
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Annulation gratuite jusqu'à 7 jours avant</li>
                  <li>• 50% de remboursement 3-7 jours avant</li>
                  <li>• Aucun remboursement moins de 3 jours avant</li>
                  <li>• Modification possible sous conditions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Prêt pour l'aventure ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Réservez maintenant et vivez une expérience inoubliable
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition-all hover:shadow-xl hover:scale-105">
              Réserver maintenant
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-blue-600 transition-all">
              Nous contacter
            </button>
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
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Accueil</a>
                <a href="#forfaits" className="block text-gray-400 hover:text-white transition-colors">Forfaits</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Destinations</a>
                <a href="#inclusions" className="block text-gray-400 hover:text-white transition-colors">Réserver</a>
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

export default ForfaitAcces;