import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Lightbulb, Target, Heart, Users, Award, Check, Calendar, Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Composant Button réutilisable (pour garantir que les boutons ici utilisent les mêmes styles que sur Home.jsx)
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
    <div className="min-h-screen bg-white font-sans">
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
                <Button variant="warning" size="sm" className="font-extrabold shadow-md hover:shadow-lg">
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

      {/* Hero Section */}
      <section className="relative h-96 pt-24 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.2)), url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600)',
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
                src="agence2.jpg" 
                alt="e-TRAVEL WORLD Agency" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary rounded-xl p-6 shadow-xl">
                <Award className="text-white" size={48} />
              </div>
            </div>

            <div>
              <p className="text-primary font-semibold text-sm tracking-wider mb-4 uppercase">Qui sommes-nous</p>
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
                  <p className="text-4xl font-black text-primary mb-1">2019</p>
                  <p className="text-sm text-gray-600">Année de création</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-primary mb-1">60%</p>
                  <p className="text-sm text-gray-600">Dématérialisé</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-primary mb-1">100%</p>
                  <p className="text-sm text-gray-600">Congolais</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Vision */}
      <section className="py-24 px-4 bg-light-bg">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <p className="text-primary font-semibold text-sm tracking-wider mb-4 uppercase">Notre Vision</p>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Être Une Référence</h3>

              <p className="text-xl text-gray-700 leading-relaxed">
                Être une <span className="font-bold text-primary">référence de service client</span> tout en inscrivant le <span className="font-bold text-primary">numérique</span> dans les habitudes des <span className="font-bold text-primary">voyageurs congolais</span>.
              </p>
            </div>

            <div className="order-1 md:order-2 flex justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-[#1b5e8e] to-[#154c72] rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-500">
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
              <div className="w-64 h-64 bg-gradient-to-br from-warning to-secondary rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-500">
                <Target className="text-gray-900" size={120} />
              </div>
            </div>

            <div>
              <p className="text-primary font-semibold text-sm tracking-wider mb-4 uppercase">Notre Mission</p>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Notre Engagement</h3>

              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Faire de chaque voyage un <span className="font-bold text-primary">rêve chérissable & inoubliable</span> tout en participant activement à :
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="text-white" size={20} />
                  </div>
                  <p className="text-lg text-gray-700">La construction du blason touristique congolais</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
      <section className="py-24 px-4 bg-light-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-wider mb-4 uppercase">Ce qui nous guide</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Nos Valeurs</h2>
            <p className="text-xl text-gray-600">Portées par chacun de nos collaborateurs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all">
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

          <div className="bg-light-bg rounded-2xl p-8 md:p-16 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-primary font-semibold text-sm tracking-wider mb-4 uppercase">Patrimoine & Culture</p>
                
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  <strong className="text-gray-900 text-xl">OUIKENAC CITY TOUR</strong> ce sont des journées de visite guidée du patrimoine culturel et naturel des villes des CONGO (République du CONGO & République Démocratique du CONGO).
                </p>

                <p className="text-gray-700 leading-relaxed mb-8">
                  Plongez au cœur de l'histoire grâce à nos journées de visite guidées, se déroulant tous les <strong className="text-gray-900">1ers et derniers samedis</strong> de chaque mois.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="text-white" size={20} />
                    </div>
                    <span className="text-gray-700">Guides professionnels certifiés</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="text-white" size={20} />
                    </div>
                    <span className="text-gray-700">Sites UNESCO et monuments historiques</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="text-white" size={20} />
                    </div>
                    <span className="text-gray-700">Expérience immersive et authentique</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="text-white" size={20} />
                    </div>
                    <span className="text-gray-700">Découverte des richesses insoupçonnées</span>
                  </div>
                </div>

                <Button variant="warning" size="lg" className="inline-flex items-center gap-3">
                  <Calendar size={24} />
                  Voir le calendrier
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="tour1.jpg" 
                  alt="City tour" 
                  className="rounded-xl w-full h-64 object-cover shadow-lg hover:scale-105 transition-transform duration-500"
                />
                <img 
                  src="tour2.jpg" 
                  alt="Cultural site" 
                  className="rounded-xl w-full h-64 object-cover shadow-lg hover:scale-105 transition-transform duration-500 mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
            Prêt à Vivre l'Aventure ?
          </h3>
          <p className="text-xl text-white/80 mb-8">
            Rejoignez-nous pour découvrir les merveilles du Congo et bien plus encore
          </p>
          <Button variant="primary" size="lg" className="bg-white text-primary hover:bg-gray-100 hover:scale-105 inline-flex items-center gap-3">
            Contactez-nous maintenant <ArrowRight size={24} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-10">
            
            {/* Logo/Description */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="text-secondary" size={32} />
                <div>
                  <h3 className="text-xl font-black">e-TRAVEL WORLD</h3>
                  <p className="text-xs text-gray-400">AGENCY</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">Votre partenaire voyage de confiance, vous emmenant partout dans le monde depuis 2019.</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-all">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary transition-all">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary/90 transition-all">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-all">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            {/* Liens Rapides */}
            <div>
              <h3 className="text-lg font-bold mb-6">Navigation</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">À propos</Link></li>
                <li><Link to="/weekend" className="text-gray-400 hover:text-white transition-colors">OUIKENAC</Link></li>
                <li><Link to="/city-tour" className="text-gray-400 hover:text-white transition-colors">CityTour</Link></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-bold mb-6">Informations</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Politique de confidentialité</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Conditions générales</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">FAQ</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-6">Contact</h3>
              <div className="space-y-4">
                <a href="tel:+24206871137" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Phone size={18} className="text-secondary" />
                  <span>(+242) 06 871 13 78</span>
                </a>
                <a href="tel:+24205594946" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Phone size={18} className="text-secondary" />
                  <span>(+242) 05 594 94 64</span>
                </a>
                <a href="mailto:worldagencyetravel@gmail.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Mail size={18} className="text-secondary" />
                  <span className="text-sm">worldagencyetravel@gmail.com</span>
                </a>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin size={18} className="text-secondary" />
                  <span>Brazzaville, CONGO</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                © {new Date().getFullYear()} e-TRAVEL WORLD AGENCY. Tous droits réservés.
              </p>
              {/* <p className="text-gray-500 text-sm">
                Conçu avec la Charte Graphique GMSS.Agence.
              </p> */}
            </div>
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
        /* Pour hover:text-secondary */
        .hover\\:text-secondary:hover { color: var(--secondary); }
        
        /* FIX: Ombres personnalisées pour les boutons */
        .hover\\:shadow-primary-lg:hover {
            box-shadow: 0 10px 15px -3px rgba(27, 94, 142, 0.3), 0 4px 6px -2px rgba(27, 94, 142, 0.1);
        }
        .hover\\:shadow-secondary-lg:hover {
            box-shadow: 0 10px 15px -3px rgba(241, 143, 19, 0.3), 0 4px 6px -2px rgba(241, 143, 19, 0.1);
        }
        `}
      </style>
    </div>
  );
};

export default AboutPage;