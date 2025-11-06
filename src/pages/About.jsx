import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Lightbulb, Target, Heart, Users, Award, Check, Calendar, Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const AboutPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const values = [
    { icon: Users, title: 'Solution', description: 'Nous apportons des solutions adaptées à chaque besoin' },
    { icon: Target, title: 'Orientation', description: 'Guidés par vos objectifs et vos rêves de voyage' },
    { icon: Heart, title: 'Le Client d\'abord', description: 'Votre satisfaction est notre priorité absolue' },
    { icon: Globe, title: 'Diversité Culturelle', description: 'Célébration de la richesse des cultures' }
  ];

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
              <p className="text-white text-sm tracking-widest mb-4 uppercase">Découvrez notre histoire</p>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-4">À Propos de Nous</h2>
              <p className="text-xl text-white font-light">Votre partenaire voyage depuis 2019</p>
            </div>
          </div>
        </div>
      </section>

      {/* Qui Sommes-Nous */}
      <section id="apropos" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800" 
                alt="e-TRAVEL WORLD Agency" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 rounded-xl p-6 shadow-xl">
                <Award className="text-white" size={48} />
              </div>
            </div>

            <div>
              <p className="text-blue-600 font-semibold text-sm tracking-wider mb-4 uppercase">Qui sommes-nous</p>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Notre Histoire</h3>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong className="text-gray-900">e-TRAVEL WORLD AGENCY</strong> est un établissement de voyage créé en 2019 à Pointe Noire en République du CONGO. Notre siège social se trouve à Brazzaville.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                L'agence se dématérialise à <strong className="text-gray-900">60%</strong>, ce qui la rend accessible à tous au travers des nouvelles technologies. Elle se compose d'une équipe essentiellement jeune, essentiellement congolaise, dynamique, professionnelle, dévouée, apte à répondre à chacune de vos préoccupations, vos moindres envies, désirs et besoins.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Nos différents services vous aident à économiser, gagner de l'argent, que vous décidiez d'acheter ou de vendre.
              </p>

              <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-gray-200">
                <div className="text-center">
                  <p className="text-4xl font-black text-blue-600 mb-1">2019</p>
                  <p className="text-sm text-gray-600">Année de création</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-blue-600 mb-1">60%</p>
                  <p className="text-sm text-gray-600">Dématérialisé</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-blue-600 mb-1">100%</p>
                  <p className="text-sm text-gray-600">Congolais</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Vision */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <p className="text-blue-600 font-semibold text-sm tracking-wider mb-4 uppercase">Notre Vision</p>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Être Une Référence</h3>

              <p className="text-xl text-gray-700 leading-relaxed">
                Être une <span className="font-bold text-blue-600">référence de service client</span> tout en inscrivant le <span className="font-bold text-blue-600">numérique</span> dans les habitudes des <span className="font-bold text-blue-600">voyageurs congolais</span>.
              </p>
            </div>

            <div className="order-1 md:order-2 flex justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-500">
                <Lightbulb className="text-white" size={120} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-500">
                <Target className="text-gray-900" size={120} />
              </div>
            </div>

            <div>
              <p className="text-blue-600 font-semibold text-sm tracking-wider mb-4 uppercase">Notre Mission</p>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Notre Engagement</h3>

              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Faire de chaque voyage un <span className="font-bold text-blue-600">rêve chérissable & inoubliable</span> tout en participant activement à :
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="text-white" size={20} />
                  </div>
                  <p className="text-lg text-gray-700">La construction du blason touristique congolais</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="text-white" size={20} />
                  </div>
                  <p className="text-lg text-gray-700">L'inclusion numérique au CONGO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm tracking-wider mb-4 uppercase">Ce qui nous guide</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Nos Valeurs</h2>
            <p className="text-xl text-gray-600">Portées par chacun de nos collaborateurs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all">
                  <value.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">{value.title}</h3>
                <p className="text-gray-600 text-center text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUIKENAC City Tour */}
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
                  Plongez au cœur de l'histoire grâce à nos journées de visite guidées, se déroulant tous les <strong className="text-gray-900">1ers et derniers samedis</strong> de chaque mois.
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="text-white" size={20} />
                    </div>
                    <span className="text-gray-700">Découverte des richesses insoupçonnées</span>
                  </div>
                </div>

                <button className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-500 transition-all hover:shadow-xl hover:scale-105 inline-flex items-center gap-3">
                  <Calendar size={24} />
                  Voir le calendrier
                </button>
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

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
            Prêt à Vivre l'Aventure ?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez-nous pour découvrir les merveilles du Congo et bien plus encore
          </p>
          <button className="px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-full hover:bg-gray-100 transition-all hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3">
            Contactez-nous maintenant <ArrowRight size={24} />
          </button>
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
         <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Accueil</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">À propos</a>
              <a href="/weekend" className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-500 transition-all hover:shadow-lg">
                <a href="/city-tour" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">CityTour</a>
                OUIKENAC
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
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
    </div>
  );
};

export default AboutPage;