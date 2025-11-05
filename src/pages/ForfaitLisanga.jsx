import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Utensils, Home, Car, Ship, Map, ArrowRight, DollarSign, Check } from 'lucide-react';

// --- REMARQUE : Dans un projet réel, ces composants (Header et Footer)
// devraient être exportés depuis des fichiers séparés pour être réutilisables.

const Header = ({ isScrolled, menuOpen, setMenuOpen }) => (
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
                    <a href="apropos.html" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">À propos de nous</a>
                    <a href="decouvertedescongo.html" className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-500 transition-all hover:shadow-lg">
                        Découverte des CONGO
                    </a>
                    <a href="contacteznous.html" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contactez nous</a>
                </nav>

                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-900 p-2">
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
        </div>

        {menuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
                <nav className="px-4 py-4 space-y-2">
                    <a href="apropos.html" className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium border-b border-gray-100" onClick={() => setMenuOpen(false)}>À propos de nous</a>
                    <a href="decouvertedescongo.html" className="block text-yellow-600 hover:text-yellow-700 py-3 text-base font-bold border-b border-gray-100" onClick={() => setMenuOpen(false)}>Découverte des CONGO</a>
                    <a href="contacteznous.html" className="block text-gray-700 hover:text-blue-600 py-3 text-base font-medium" onClick={() => setMenuOpen(false)}>Contactez nous</a>
                </nav>
            </div>
        )}
    </header>
);

const Footer = () => (
    <footer className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                <div>
                    <h3 className="text-lg font-bold mb-6">Liens rapides</h3>
                    <div className="space-y-3">
                        <a href="#" className="block text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={18} className="text-blue-400"/>accueil</a>
                        <a href="apropos.html" className="block text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={18} className="text-blue-400"/>à propos</a>
                        <a href="decouvertedescongo.html" className="block text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={18} className="text-blue-400"/>découverte des CONGO</a>
                        <a href="contacteznous.html" className="block text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={18} className="text-blue-400"/>contactez nous</a>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-6">Liens extra</h3>
                    <div className="space-y-3">
                        <a href="#" className="block text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={18} className="text-blue-400"/>posez questions</a>
                        <a href="#" className="block text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={18} className="text-blue-400"/>politique de confidentialité</a>
                        <a href="#" className="block text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={18} className="text-blue-400"/>ouikenac city tour</a>
                        <a href="#" className="block text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={18} className="text-blue-400"/>nos termes</a>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-6">info contacts</h3>
                    <div className="space-y-4">
                        <a href="tel:+24206871137" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                            <Phone size={18} className="text-blue-400" />
                            <span>+242 06 871 13 78</span>
                        </a>
                        <a href="tel:+24205594946" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                            <Phone size={18} className="text-blue-400" />
                            <span>+242 05 594 94 64</span>
                        </a>
                        <a href="mailto:worldagencyetravel@gmail.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                            <Mail size={18} className="text-blue-400" />
                            <span className="text-sm">worldagencyetravel@gmail.com</span>
                        </a>
                        <div className="flex items-center gap-3 text-gray-400">
                            <MapPin size={18} className="text-blue-400" />
                            <span>Brazzaville CONGO</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-6">suivez-nous</h3>
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
            </div>

            <div className="border-t border-gray-800 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        créé par <span className="font-bold text-white">ELBO</span> tout droit réservé
                    </p>
                </div>
            </div>
        </div>
    </footer>
);

// --- Composant principal du Forfait LISANGA ---

const ForfaitLisanga = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const tarification = [
        { depart: 'Brazzaville (+transport)', tarif: '166.300', device: 'XAF', link: '#' },
        { depart: 'Pointe noire (+transport)', tarif: '89.300', device: 'XAF', link: '#' },
        { depart: 'Kinshasa', tarif: '399', device: 'USD', link: '#' },
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            <Header isScrolled={isScrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            {/* Titre de la Page */}
            <div className="pt-24 pb-12 bg-gray-100 text-center shadow-inner">
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 uppercase">
                    Forfait <span className="text-blue-600">LISANGA</span>
                </h1>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Section Gauche: Inclusions & Photos */}
                    <div className="lg:col-span-2">
                        {/* Blocs d'Inclusions Visuels */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-16">
                            <div className="p-4 text-center bg-blue-50 rounded-lg border border-blue-200">
                                <Utensils className="text-blue-600 mx-auto mb-2" size={32} />
                                <p className="text-sm font-semibold text-gray-700">Petit déjeuner</p>
                            </div>
                            <div className="p-4 text-center bg-blue-50 rounded-lg border border-blue-200">
                                <Home className="text-blue-600 mx-auto mb-2" size={32} />
                                <p className="text-sm font-semibold text-gray-700">Hébergement</p>
                            </div>
                            <div className="p-4 text-center bg-blue-50 rounded-lg border border-blue-200">
                                <Car className="text-blue-600 mx-auto mb-2" size={32} />
                                <p className="text-sm font-semibold text-gray-700">Transport</p>
                            </div>
                            <div className="p-4 text-center bg-blue-50 rounded-lg border border-blue-200">
                                <Ship className="text-blue-600 mx-auto mb-2" size={32} />
                                <p className="text-sm font-semibold text-gray-700">Traversée</p>
                            </div>
                            <div className="p-4 text-center bg-blue-50 rounded-lg border border-blue-200">
                                <Map className="text-blue-600 mx-auto mb-2" size={32} />
                                <p className="text-sm font-semibold text-gray-700">Visite touristique</p>
                            </div>
                        </div>

                        {/* Liste Détaillée des Inclusions */}
                        <div className="bg-gray-50 p-8 rounded-xl shadow-lg border border-gray-200 mb-12">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 border-b pb-3">Inclusions Détaillées</h2>
                            <ul className="space-y-3 list-none p-0">
                                <li className="flex items-start gap-3 text-lg text-gray-700">
                                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                                    <span>2 nuits d'hébergement à la **villa KIMOYA**</span>
                                </li>
                                <li className="flex items-start gap-3 text-lg text-gray-700">
                                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                                    <span>Petit Déjeuner quotidien</span>
                                </li>
                                <li className="flex items-start gap-3 text-lg text-gray-700">
                                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                                    <span>Déjeuner</span>
                                </li>
                                <li className="flex items-start gap-3 text-lg text-gray-700">
                                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                                    <span>Exploration des gorges de dioso</span>
                                </li>
                                <li className="flex items-start gap-3 text-lg text-gray-700">
                                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                                    <span>Exploration de la piste des caravanes</span>
                                </li>
                                <li className="flex items-start gap-3 text-lg text-gray-700">
                                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                                    <span>Transport Privé</span>
                                </li>
                            </ul>
                        </div>

                        {/* Galerie Photos (utilisant des placeholders) */}
                        <h2 className="text-3xl font-black text-gray-900 mb-6">Aperçu</h2>
                        <div className="grid sm:grid-cols-1 gap-6">
                            {/* Un seul bloc image pour ce forfait, centré */}
                            <div className="overflow-hidden rounded-xl shadow-xl mx-auto w-full max-w-2xl">
                                {/* NOTE : Remplacez par votre vraie image */}
                                <img 
                                    src="images/images/cabane au bord de locean.jpg" 
                                    alt="Cabane au bord de l'océan" 
                                    className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section Droite: Tarification */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-blue-50 p-8 rounded-2xl shadow-2xl border-4 border-blue-600">
                            <h2 className="text-3xl font-black text-blue-600 mb-6 flex items-center gap-3">
                                <DollarSign size={32} /> TARIFICATION
                            </h2>

                            <p className="text-lg font-bold text-gray-700 mb-4">Base : <span className="text-gray-900 font-extrabold">2 personnes</span></p>

                            <div className="space-y-6">
                                {tarification.map((item, index) => (
                                    <div key={index} className="border-b border-gray-300 pb-4 last:border-b-0 last:pb-0">
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">{item.depart}</p>
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-3xl font-black text-gray-900">
                                                {item.tarif} <span className="text-lg font-normal text-blue-600">{item.device}</span>
                                            </p>
                                            <a 
                                                href={item.link}
                                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all hover:shadow-lg flex items-center gap-2"
                                            >
                                                Réserver <ArrowRight size={18} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ForfaitLisanga;