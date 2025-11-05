import React, { useState } from 'react';
import {
  Menu, X, Bell, Settings, LogOut, Search, Plus, Filter, Download, Eye, Edit, 
  Trash2, CheckCircle, XCircle, AlertTriangle, Clock, TrendingUp, Users, Building,
  BookOpen, BarChart3, Shield, Lock, ChevronDown, ChevronRight, Zap, Mail, Phone,
  MapPin, Globe, Star, Award, MoreVertical, ArrowUp, ArrowDown, Calendar, 
  FileText, Upload, Send, Inbox, MessageSquare, LayoutDashboard, Database,
  Activity, Sliders
} from 'lucide-react';

// Sidebar Léger
function AdminSidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, expanded, setExpanded }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { id: 'universities', icon: Building, label: 'Universités', badge: 12 },
    { id: 'validations', icon: CheckCircle, label: 'Validations', badge: 8 },
    { id: 'users', icon: Users, label: 'Utilisateurs', badge: null },
    { id: 'programs', icon: BookOpen, label: 'Programmes', badge: null },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', badge: null },
    { id: 'reports', icon: FileText, label: 'Rapports', badge: null },
    { id: 'settings', icon: Sliders, label: 'Paramètres', badge: null },
  ];

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-gray-900 text-white z-50 transition-all duration-300 ${
        expanded ? 'w-64' : 'w-20'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className={`flex items-center space-x-3 ${expanded ? '' : 'hidden'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-white text-sm">OrientationPro</h2>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
            </div>
            
            {!expanded && (
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
            )}

            <button 
              onClick={() => setExpanded(!expanded)}
              className="hidden lg:flex items-center justify-center w-8 h-8 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>

            <button className="lg:hidden text-gray-400" onClick={() => setIsMobileOpen(false)}>
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
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all group ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
                title={item.label}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {expanded && <span className="font-medium text-sm truncate">{item.label}</span>}
                </div>
                
                {item.badge && (
                  <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === item.id ? 'bg-white/20' : 'bg-red-600'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {!expanded && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="p-3 border-t border-gray-800 space-y-2">
            <button className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors ${!expanded ? 'justify-center' : ''}`}>
              <Settings className="w-5 h-5 flex-shrink-0" />
              {expanded && <span className="font-medium text-sm">Paramètres</span>}
            </button>
            
            <button className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors ${!expanded ? 'justify-center' : ''}`}>
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {expanded && <span className="font-medium text-sm">Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// Header
function AdminHeader({ setIsMobileOpen }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button className="lg:hidden text-gray-600" onClick={() => setIsMobileOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une université, utilisateur..."
              className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="hidden md:block text-right">
              <p className="font-semibold text-gray-800 text-sm">Admin Platform</p>
              <p className="text-xs text-gray-500">Gestionnaire Système</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Admin"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

// Dashboard Overview
function DashboardOverview() {
  const stats = [
    { label: 'Universités totales', value: '45', change: '+2', trend: 'up', icon: Building, color: 'blue' },
    { label: 'En attente de validation', value: '12', change: '+5', trend: 'up', icon: Clock, color: 'orange' },
    { label: 'Utilisateurs actifs', value: '8,234', change: '+324', trend: 'up', icon: Users, color: 'green' },
    { label: 'Candidatures totales', value: '45,321', change: '+12%', trend: 'up', icon: FileText, color: 'purple' },
  ];

  const pendingUniversities = [
    {
      id: 1,
      name: 'Institut Supérieur de Commerce Avancée',
      city: 'Pointe-Noire',
      type: 'private',
      submittedDate: '2025-09-28',
      documents: 8,
      status: 'pending',
      programs: 12,
      students: 450,
      verification: 65
    },
    {
      id: 2,
      name: 'Académie Polytechnique Congo',
      city: 'Brazzaville',
      type: 'private',
      submittedDate: '2025-09-25',
      documents: 6,
      status: 'incomplete',
      programs: 8,
      students: 280,
      verification: 40
    },
    {
      id: 3,
      name: 'Université Libre du Kasai',
      city: 'Dolisie',
      type: 'private',
      submittedDate: '2025-09-22',
      documents: 10,
      status: 'review',
      programs: 15,
      students: 620,
      verification: 85
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bienvenue, Admin</h1>
            <p className="text-indigo-200 mt-2">Plateforme OrientationPro - Gestion Système</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20">
              <Download className="w-5 h-5 mr-2 inline" />
              Rapports
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <ArrowUp className="w-4 h-4 inline" /> : <ArrowDown className="w-4 h-4 inline" />}
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Universities Pending Validation */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Universités en attente</h2>
            <p className="text-gray-600 text-sm mt-1">Validation requise</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Université</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Vérification</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Soumise</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingUniversities.map((uni) => (
                  <tr key={uni.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{uni.name}</p>
                        <p className="text-xs text-gray-500">{uni.city} • {uni.type}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        uni.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        uni.status === 'review' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {uni.status === 'pending' ? 'En attente' : uni.status === 'review' ? 'En révision' : 'Incomplet'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${uni.verification}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{uni.verification}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">{uni.submittedDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-200 text-center">
            <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
              Voir toutes les universités →
            </button>
          </div>
        </div>

        {/* Sidebar - Quick Stats */}
        <div className="space-y-6">
          {/* Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-indigo-600" />
              Activité récente
            </h3>
            <div className="space-y-4">
              {[
                { icon: Building, text: "Nouvelle université inscrite", time: "Il y a 2h" },
                { icon: CheckCircle, text: "Université validée", time: "Il y a 4h" },
                { icon: Users, text: "100 candidatures soumises", time: "Il y a 1j" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">État du système</h3>
            <div className="space-y-3">
              {[
                { label: 'API', status: 'online' },
                { label: 'Base de données', status: 'online' },
                { label: 'Storage', status: 'online' },
                { label: 'Email', status: 'warning' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'online' ? 'bg-green-500' :
                    item.status === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg font-semibold hover:shadow-md text-sm flex items-center justify-between">
                <span className="flex items-center">
                  <Send className="w-4 h-4 mr-2 text-indigo-600" />
                  Notifications
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg font-semibold hover:shadow-md text-sm flex items-center justify-between">
                <span className="flex items-center">
                  <Download className="w-4 h-4 mr-2 text-indigo-600" />
                  Rapports
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg font-semibold hover:shadow-md text-sm flex items-center justify-between">
                <span className="flex items-center">
                  <Settings className="w-4 h-4 mr-2 text-indigo-600" />
                  Configuration
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page vide pour autres sections
function PlaceholderPage() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
      <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Section en cours de développement</h2>
      <p className="text-gray-600">Cette section sera bientôt disponible</p>
    </div>
  );
}

// Composant Principal
export default function AdminPlatformDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        expanded={expanded}
        setExpanded={setExpanded}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader setIsMobileOpen={setIsMobileOpen} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab !== 'dashboard' && <PlaceholderPage />}
        </main>
      </div>
    </div>
  );
}