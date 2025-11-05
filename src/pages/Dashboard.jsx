// import React, { useState } from 'react';
// import { 
//   LayoutDashboard, Users, FileText, School, TrendingUp, Settings, LogOut, Search,
//   Bell, Plus, Filter, Download, MoreVertical, Eye, Edit, Trash2, CheckCircle,
//   Clock, XCircle, Calendar, Mail, Phone, MapPin, Award, BarChart3, PieChart,
//   DollarSign, UserCheck, AlertTriangle, ArrowUp, ArrowDown, Menu, X, ChevronDown,
//   Building, Book, Target, MessageSquare, Star, FileSpreadsheet, Upload, Send
// } from 'lucide-react';

// import Programme from "./programme";

// import Statistique from "./statistique";
// import Gestion from "./gestion";


// // Composant Sidebar Admin
// export function AdminSidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) {
//   const menuItems = [
//     { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Tableau de bord' },
//     { id: 'candidatures', icon: <FileText className="w-5 h-5" />, label: 'Candidatures', badge: 45 },
//     { id: 'etudiants', icon: <Users className="w-5 h-5" />, label: 'Étudiants inscrits' },
//     { id: 'programmes', icon: <Book className="w-5 h-5" />, label: 'Programmes' },
//     { id: 'admissions', icon: <School className="w-5 h-5" />, label: 'Processus d\'admission' },
//     { id: 'statistiques', icon: <BarChart3 className="w-5 h-5" />, label: 'Statistiques & Rapports' },
//     { id: 'messages', icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', badge: 12 },
//   ];

//   return (
//     <>
//       {/* Overlay mobile */}
//       {isMobileOpen && (
//         <div 
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white z-50 transform transition-transform duration-300 lg:transform-none ${
//         isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//       }`}>
//         <div className="flex flex-col h-full">
//           {/* Logo université */}
//           <div className="p-6 border-b border-indigo-700">
//             <div className="flex items-center justify-between">
//               <div className="space-y-1">
//                 <div className="flex items-center space-x-3">
//                   <div className="bg-white text-indigo-900 p-2 rounded-lg">
//                     <Building className="w-6 h-6" />
//                   </div>
//                   <div>
//                     <h2 className="font-bold text-lg">Université M-N</h2>
//                     <p className="text-xs text-indigo-200">Administration</p>
//                   </div>
//                 </div>
//               </div>
//               <button 
//                 className="lg:hidden text-white"
//                 onClick={() => setIsMobileOpen(false)}
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//           </div>

//           {/* Menu */}
//           <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//             {menuItems.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => {
//                   setActiveTab(item.id);
//                   setIsMobileOpen(false);
//                 }}
//                 className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
//                   activeTab === item.id
//                     ? 'bg-white text-indigo-900 shadow-lg'
//                     : 'text-indigo-100 hover:bg-indigo-700/50'
//                 }`}
//               >
//                 <div className="flex items-center space-x-3">
//                   {item.icon}
//                   <span className="font-medium">{item.label}</span>
//                 </div>
//                 {item.badge && (
//                   <span className={`text-xs px-2 py-1 rounded-full font-bold ${
//                     activeTab === item.id 
//                       ? 'bg-indigo-900 text-white' 
//                       : 'bg-red-500 text-white'
//                   }`}>
//                     {item.badge}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </nav>

//           {/* User section */}
//           <div className="p-4 border-t border-indigo-700 space-y-2">
//             <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-indigo-100 hover:bg-indigo-700/50 transition-colors">
//               <Settings className="w-5 h-5" />
//               <span className="font-medium">Paramètres</span>
//             </button>
//             <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 transition-colors">
//               <LogOut className="w-5 h-5" />
//               <span className="font-medium">Déconnexion</span>
//             </button>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }

// // Composant Header Admin
// export function AdminHeader({ setIsMobileOpen }) {
//   return (
//     <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
//       <div className="flex items-center justify-between px-6 py-4">
//         <div className="flex items-center space-x-4">
//           <button 
//             className="lg:hidden text-gray-600"
//             onClick={() => setIsMobileOpen(true)}
//           >
//             <Menu className="w-6 h-6" />
//           </button>
          
//           <div className="relative hidden md:block">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Rechercher un étudiant, candidature..."
//               className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//         </div>

//         <div className="flex items-center space-x-4">
//           <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
//             <Bell className="w-6 h-6" />
//             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//           </button>
          
//           <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
//             <img
//               src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
//               alt="Admin"
//               className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
//             />
//             <div className="hidden md:block">
//               <p className="font-semibold text-gray-800">Dr. Jean Mobembo</p>
//               <p className="text-sm text-gray-500">Directeur des Admissions</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// // Dashboard Overview Admin
// export function AdminDashboardOverview() {
//   const stats = [
//     { 
//       label: 'Candidatures en attente', 
//       value: '45', 
//       change: '+12%',
//       trend: 'up',
//       icon: <Clock className="w-6 h-6" />,
//       color: 'from-orange-500 to-red-500',
//       bgColor: 'bg-orange-50',
//       textColor: 'text-orange-600'
//     },
//     { 
//       label: 'Candidatures approuvées', 
//       value: '128', 
//       change: '+8%',
//       trend: 'up',
//       icon: <CheckCircle className="w-6 h-6" />,
//       color: 'from-emerald-500 to-teal-500',
//       bgColor: 'bg-emerald-50',
//       textColor: 'text-emerald-600'
//     },
//     { 
//       label: 'Étudiants inscrits', 
//       value: '2,847', 
//       change: '+5%',
//       trend: 'up',
//       icon: <Users className="w-6 h-6" />,
//       color: 'from-blue-500 to-cyan-500',
//       bgColor: 'bg-blue-50',
//       textColor: 'text-blue-600'
//     },
//     { 
//       label: 'Taux d\'acceptation', 
//       value: '68%', 
//       change: '-3%',
//       trend: 'down',
//       icon: <TrendingUp className="w-6 h-6" />,
//       color: 'from-purple-500 to-indigo-500',
//       bgColor: 'bg-purple-50',
//       textColor: 'text-purple-600'
//     },
//   ];

//   const recentApplications = [
//     {
//       id: 'APP-2025-1247',
//       name: 'Marie Kongo',
//       program: 'Licence Informatique',
//       date: '28 Sept 2025',
//       status: 'pending',
//       score: 16.5,
//       photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
//     },
//     {
//       id: 'APP-2025-1246',
//       name: 'Jean Makala',
//       program: 'Master Droit des Affaires',
//       date: '28 Sept 2025',
//       status: 'pending',
//       score: 15.8,
//       photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
//     },
//     {
//       id: 'APP-2025-1245',
//       name: 'Sophie Mbala',
//       program: 'Licence Économie',
//       date: '27 Sept 2025',
//       status: 'approved',
//       score: 17.2,
//       photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
//     },
//     {
//       id: 'APP-2025-1244',
//       name: 'David Nkounkou',
//       program: 'Licence Architecture',
//       date: '27 Sept 2025',
//       status: 'pending',
//       score: 14.9,
//       photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
//     },
//     {
//       id: 'APP-2025-1243',
//       name: 'Grace Ondongo',
//       program: 'Licence Médecine',
//       date: '26 Sept 2025',
//       status: 'review',
//       score: 16.8,
//       photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face'
//     },
//   ];

//   const programStats = [
//     { name: 'Informatique', applications: 234, accepted: 156, rate: 67 },
//     { name: 'Droit', applications: 198, accepted: 142, rate: 72 },
//     { name: 'Médecine', applications: 156, accepted: 89, rate: 57 },
//     { name: 'Architecture', applications: 123, accepted: 78, rate: 63 },
//     { name: 'Économie', applications: 187, accepted: 134, rate: 72 },
//   ];

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: { text: 'En attente', class: 'bg-orange-100 text-orange-700' },
//       approved: { text: 'Approuvée', class: 'bg-green-100 text-green-700' },
//       rejected: { text: 'Rejetée', class: 'bg-red-100 text-red-700' },
//       review: { text: 'En révision', class: 'bg-blue-100 text-blue-700' },
//     };
//     return badges[status];
//   };

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 text-white">
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
//           <div className="space-y-2">
//             <h1 className="text-3xl font-bold">Tableau de bord - Admissions</h1>
//             <p className="text-indigo-200 text-lg">Université Marien-Ngouabi • Année académique 2025-2026</p>
//           </div>
//           <div className="mt-4 md:mt-0 flex space-x-3">
//             <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center">
//               <Download className="w-5 h-5 mr-2" />
//               Exporter
//             </button>
//             <button className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center">
//               <Plus className="w-5 h-5 mr-2" />
//               Nouvelle admission
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
//             <div className="p-6 space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.textColor}`}>
//                   {stat.icon}
//                 </div>
//                 <div className={`flex items-center text-sm font-semibold ${
//                   stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
//                 }`}>
//                   {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
//                   <span className="ml-1">{stat.change}</span>
//                 </div>
//               </div>
//               <div>
//                 <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
//                 <p className="text-gray-600 font-medium mt-1">{stat.label}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Recent Applications */}
//         <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800">Candidatures récentes</h2>
//                 <p className="text-gray-600 mt-1">Nécessitent votre attention</p>
//               </div>
//               <div className="flex space-x-2">
//                 <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                   <Filter className="w-5 h-5" />
//                 </button>
//                 <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                   <MoreVertical className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Candidat</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Programme</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Score</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {recentApplications.map((app, index) => {
//                   const statusBadge = getStatusBadge(app.status);
//                   return (
//                     <tr key={index} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-3">
//                           <img 
//                             src={app.photo} 
//                             alt={app.name}
//                             className="w-10 h-10 rounded-full object-cover"
//                           />
//                           <div>
//                             <p className="font-semibold text-gray-800">{app.name}</p>
//                             <p className="text-sm text-gray-500">{app.id}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="font-medium text-gray-800">{app.program}</p>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="text-sm text-gray-600">{app.date}</p>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
//                           <span className="font-semibold text-gray-800">{app.score}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.class}`}>
//                           {statusBadge.text}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex space-x-2">
//                           <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
//                             <CheckCircle className="w-4 h-4" />
//                           </button>
//                           <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
//                             <XCircle className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <div className="p-6 border-t border-gray-200">
//             <button className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center mx-auto">
//               Voir toutes les candidatures
//               <ArrowDown className="w-4 h-4 ml-2" />
//             </button>
//           </div>
//         </div>

//         {/* Sidebar - Program Stats */}
//         <div className="space-y-6">
//           {/* Program Performance */}
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//               <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
//               Performance par programme
//             </h3>
//             <div className="space-y-4">
//               {programStats.map((prog, index) => (
//                 <div key={index} className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium text-gray-800">{prog.name}</span>
//                     <span className="text-sm font-semibold text-indigo-600">{prog.rate}%</span>
//                   </div>
//                   <div className="flex items-center space-x-2 text-xs text-gray-600">
//                     <span>{prog.applications} candidatures</span>
//                     <span>•</span>
//                     <span>{prog.accepted} acceptées</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div 
//                       className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
//                       style={{ width: `${prog.rate}%` }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
//             <h3 className="text-lg font-bold text-gray-800 mb-4">Actions rapides</h3>
//             <div className="space-y-3">
//               <button className="w-full bg-white text-gray-800 px-4 py-3 rounded-xl font-semibold hover:shadow-md transition-all flex items-center justify-between group">
//                 <span className="flex items-center">
//                   <Send className="w-5 h-5 mr-3 text-indigo-600" />
//                   Envoyer notifications
//                 </span>
//                 <ArrowDown className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button className="w-full bg-white text-gray-800 px-4 py-3 rounded-xl font-semibold hover:shadow-md transition-all flex items-center justify-between group">
//                 <span className="flex items-center">
//                   <FileSpreadsheet className="w-5 h-5 mr-3 text-indigo-600" />
//                   Générer rapport
//                 </span>
//                 <ArrowDown className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button className="w-full bg-white text-gray-800 px-4 py-3 rounded-xl font-semibold hover:shadow-md transition-all flex items-center justify-between group">
//                 <span className="flex items-center">
//                   <Upload className="w-5 h-5 mr-3 text-indigo-600" />
//                   Importer données
//                 </span>
//                 <ArrowDown className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
//               </button>
//             </div>
//           </div>

//           {/* Alerts */}
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//               <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
//               Alertes
//             </h3>
//             <div className="space-y-3">
//               <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
//                 <p className="font-semibold text-gray-800 text-sm">Date limite approche</p>
//                 <p className="text-xs text-gray-600 mt-1">45 candidatures à traiter avant le 5 Oct</p>
//               </div>
//               <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
//                 <p className="font-semibold text-gray-800 text-sm">Capacité programme</p>
//                 <p className="text-xs text-gray-600 mt-1">Informatique à 85% de capacité</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Composant Principal Dashboard Admin
// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <AdminSidebar 
//         activeTab={activeTab} 
//         setActiveTab={setActiveTab}
//         isMobileOpen={isMobileOpen}
//         setIsMobileOpen={setIsMobileOpen}
//       />
      
//       <div className="flex-1 flex flex-col min-w-0">
//         <AdminHeader setIsMobileOpen={setIsMobileOpen} />
        
//         <main className="flex-1 p-6 overflow-y-auto">
//           {activeTab === 'dashboard' && <AdminDashboardOverview />}
//            {activeTab === "programmes" && <Programme />}
//              {activeTab === "statistiques" && <Statistique />}
//               {activeTab === "admissions" && <Gestion />}
//           {/* {activeTab !== 'dashboard' && (
//             <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//               <div className="max-w-md mx-auto space-y-4">
//                 <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
//                   <School className="w-10 h-10 text-indigo-600" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-800">Section en construction</h2>
//                 <p className="text-gray-600">
//                   Cette section sera bientôt disponible. Pour l'instant, explorez le tableau de bord principal.
//                 </p>
//                 <button 
//                   onClick={() => setActiveTab('dashboard')}
//                   className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center"
//                 >
//                   <LayoutDashboard className="w-5 h-5 mr-2" />
//                   Retour au tableau de bord
//                 </button>
//               </div>
//             </div>
//           )} */}
//         </main>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, FileText, School, TrendingUp, Settings, LogOut, Search,
  Bell, Plus, Filter, Download, MoreVertical, Eye, Edit, Trash2, CheckCircle,
  Clock, XCircle, Calendar, Mail, Phone, MapPin, Award, BarChart3, PieChart,
  DollarSign, UserCheck, AlertTriangle, ArrowUp, ArrowDown, Menu, X, ChevronDown,
  Building, Book, Target, MessageSquare, Star, FileSpreadsheet, Upload, Send,
  Home, Zap, TrendingDown
} from 'lucide-react';

import Programme from "./programme";

import Statistique from "./statistique";
import Gestion from "./gestion";

// Composant Sidebar Léger
function LightSidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) {
  const [expanded, setExpanded] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { id: 'candidatures', icon: FileText, label: 'Candidatures', badge: 45 },
    { id: 'etudiants', icon: Users, label: 'Étudiants', badge: null },
    { id: 'programmes', icon: Book, label: 'Programmes', badge: null },
    { id: 'admissions', icon: School, label: 'Admission', badge: null },
    { id: 'statistiques', icon: BarChart3, label: 'Statistiques', badge: null },
    { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 12 },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
        expanded ? 'w-64' : 'w-20'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="flex flex-col h-full">
          {/* Logo Compacte */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className={`flex items-center space-x-3 ${expanded ? '' : 'hidden'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-sm">Admin</h2>
                <p className="text-xs text-gray-500">UMNG</p>
              </div>
            </div>
            
            {!expanded && (
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
            )}

            {/* Bouton toggle pour desktop */}
            <button 
              onClick={() => setExpanded(!expanded)}
              className="hidden lg:flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {expanded ? <ChevronDown className="w-4 h-4 rotate-90" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Bouton fermeture pour mobile */}
            <button 
              className="lg:hidden text-gray-600"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 relative group ${
                  activeTab === item.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={item.label}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {expanded && (
                    <span className="font-medium text-sm truncate">{item.label}</span>
                  )}
                </div>
                
                {/* Badge */}
                {item.badge && (
                  <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-bold ml-2 ${
                    activeTab === item.id 
                      ? 'bg-indigo-700 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {/* Tooltip */}
                {!expanded && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {item.label}
                    {item.badge && <span className="ml-2 text-red-300">({item.badge})</span>}
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-3 border-t border-gray-200 space-y-2">
            <button className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors ${!expanded ? 'justify-center' : ''}`}
              title="Paramètres">
              <Settings className="w-5 h-5 flex-shrink-0" />
              {expanded && <span className="font-medium text-sm">Paramètres</span>}
            </button>
            
            <button className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${!expanded ? 'justify-center' : ''}`}
              title="Déconnexion">
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {expanded && <span className="font-medium text-sm">Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// Composant Header
function AdminHeader({ setIsMobileOpen }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button 
            className="lg:hidden text-gray-600"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="hidden md:block text-right">
              <p className="font-semibold text-gray-800 text-sm">Dr. Jean Mobembo</p>
              <p className="text-xs text-gray-500">Directeur</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Admin"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

// Dashboard Overview
function AdminDashboardOverview() {
  const stats = [
    { 
      label: 'Candidatures en attente', 
      value: '45', 
      change: '+12%',
      trend: 'up',
      icon: Clock,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    { 
      label: 'Candidatures approuvées', 
      value: '128', 
      change: '+8%',
      trend: 'up',
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    { 
      label: 'Étudiants inscrits', 
      value: '2,847', 
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Taux d\'acceptation', 
      value: '68%', 
      change: '-3%',
      trend: 'down',
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
  ];

  const recentApplications = [
    {
      id: 'APP-2025-1247',
      name: 'Marie Kongo',
      program: 'Licence Informatique',
      date: '28 Sept 2025',
      status: 'pending',
      score: 16.5,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    {
      id: 'APP-2025-1246',
      name: 'Jean Makala',
      program: 'Master Droit',
      date: '28 Sept 2025',
      status: 'pending',
      score: 15.8,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    {
      id: 'APP-2025-1245',
      name: 'Sophie Mbala',
      program: 'Licence Économie',
      date: '27 Sept 2025',
      status: 'approved',
      score: 17.2,
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    },
    {
      id: 'APP-2025-1244',
      name: 'David Nkounkou',
      program: 'Licence Architecture',
      date: '27 Sept 2025',
      status: 'pending',
      score: 14.9,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
    },
  ];

  const programStats = [
    { name: 'Informatique', applications: 234, accepted: 156, rate: 67 },
    { name: 'Droit', applications: 198, accepted: 142, rate: 72 },
    { name: 'Médecine', applications: 156, accepted: 89, rate: 57 },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'En attente', class: 'bg-orange-100 text-orange-700' },
      approved: { text: 'Approuvée', class: 'bg-green-100 text-green-700' },
      rejected: { text: 'Rejetée', class: 'bg-red-100 text-red-700' },
      review: { text: 'En révision', class: 'bg-blue-100 text-blue-700' },
    };
    return badges[status];
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-indigo-200">Université Marien-Ngouabi • 2025-2026</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Exporter
            </button>
            <button className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Nouveau
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div className={`flex items-center text-sm font-semibold ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Candidatures récentes</h2>
              <p className="text-gray-600 text-sm mt-1">À traiter en priorité</p>
            </div>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Candidat</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Programme</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentApplications.map((app) => {
                  const statusBadge = getStatusBadge(app.status);
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={app.photo} 
                            alt={app.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{app.name}</p>
                            <p className="text-xs text-gray-500">{app.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{app.program}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-600">{app.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{app.score}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-200 text-center">
            <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center justify-center mx-auto">
              Voir toutes les candidatures
              <ChevronDown className="w-4 h-4 ml-2 rotate-180" />
            </button>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Program Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Performance</h3>
            <div className="space-y-4">
              {programStats.map((prog, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{prog.name}</span>
                    <span className="text-xs font-bold text-indigo-600">{prog.rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${prog.rate}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {prog.applications} candidatures • {prog.accepted} acceptées
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg font-semibold hover:shadow-md transition-all text-sm flex items-center justify-between">
                <span className="flex items-center">
                  <Send className="w-4 h-4 mr-3 text-indigo-600" />
                  Notifications
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg font-semibold hover:shadow-md transition-all text-sm flex items-center justify-between">
                <span className="flex items-center">
                  <FileSpreadsheet className="w-4 h-4 mr-3 text-indigo-600" />
                  Rapport
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg font-semibold hover:shadow-md transition-all text-sm flex items-center justify-between">
                <span className="flex items-center">
                  <Upload className="w-4 h-4 mr-3 text-indigo-600" />
                  Importer
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Alertes
            </h3>
            <div className="space-y-3">
              <div className="border-l-4 border-orange-500 bg-orange-50 p-3 rounded-r">
                <p className="font-semibold text-gray-900 text-xs">45 candidatures à traiter</p>
                <p className="text-xs text-gray-600 mt-1">Avant le 5 Oct</p>
              </div>
              <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded-r">
                <p className="font-semibold text-gray-900 text-xs">Informatique à 85%</p>
                <p className="text-xs text-gray-600 mt-1">Capacité atteinte</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant Principal
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <LightSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader setIsMobileOpen={setIsMobileOpen} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && <AdminDashboardOverview />}
            {activeTab === "programmes" && <Programme />}
//              {activeTab === "statistiques" && <Statistique />}
//               {activeTab === "admissions" && <Gestion />}
          {/* {activeTab !== 'dashboard' && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                  <School className="w-10 h-10 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Bientôt disponible</h2>
                <p className="text-gray-600">Cette section est en cours de développement</p>
              </div>
            </div>
          )} */}
        </main>
      </div>
    </div>
  );
}