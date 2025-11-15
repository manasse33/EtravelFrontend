import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Package, MapPin, Building2, Globe, Calendar, Users, 
  TrendingUp, DollarSign, AlertCircle, CheckCircle, 
  XCircle, Clock, Plus, Edit2, Trash2, Eye, Search,
  Filter, Download, RefreshCw, ChevronDown, Menu, X, Upload, Image as ImageIcon
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // États pour les données
  const [stats, setStats] = useState({
    totalReservations: 0,
    pendingReservations: 0,
    approvedReservations: 0,
    totalRevenue: 0,
    cityTours: 0,
    destinationPackages: 0,
    ouikenacPackages: 0,
    countries: 0
  });
  
  const [reservations, setReservations] = useState([]);
  const [cityTours, setCityTours] = useState([]);
  const [destinationPackages, setDestinationPackages] = useState([]);
  const [ouikenacPackages, setOuikenacPackages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  
  // États pour les modales
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // États pour les formulaires
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const API_BASE = 'https://etravelbackend-production.up.railway.app/api';

  // Chargement des données
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadReservations(),
        loadCityTours(),
        loadDestinationPackages(),
        loadOuikenacPackages(),
        loadCountries(),
        loadCities()
      ]);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadReservations = async () => {
    try {
      const res = await fetch(`${API_BASE}/reservations`);
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setReservations(data);
      updateStatsFromReservations(data);
    } catch (err) {
      console.error('Erreur réservations:', err);
      setReservations([]);
    }
  };

  const loadCityTours = async () => {
    try {
      const res = await fetch(`${API_BASE}/city-tours`);
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setCityTours(data);
      setStats(prev => ({ ...prev, cityTours: data.length }));
    } catch (err) {
      console.error('Erreur city tours:', err);
      setCityTours([]);
    }
  };

  const loadDestinationPackages = async () => {
    try {
      const res = await fetch(`${API_BASE}/destination-packages`);
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setDestinationPackages(data);
      setStats(prev => ({ ...prev, destinationPackages: data.length }));
    } catch (err) {
      console.error('Erreur destination packages:', err);
      setDestinationPackages([]);
    }
  };

  const loadOuikenacPackages = async () => {
    try {
      const res = await fetch(`${API_BASE}/ouikenac-packages`);
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setOuikenacPackages(data);
      setStats(prev => ({ ...prev, ouikenacPackages: data.length }));
    } catch (err) {
      console.error('Erreur ouikenac packages:', err);
      setOuikenacPackages([]);
    }
  };

  const loadCountries = async () => {
    try {
      const res = await fetch(`${API_BASE}/countries`);
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setCountries(data);
      setStats(prev => ({ ...prev, countries: data.length }));
    } catch (err) {
      console.error('Erreur pays:', err);
      setCountries([]);
    }
  };

  const loadCities = async () => {
    try {
      const res = await fetch(`${API_BASE}/cities`);
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setCities(data);
    } catch (err) {
      console.error('Erreur villes:', err);
      setCities([]);
    }
  };

  const updateStatsFromReservations = (data) => {
    const pending = data.filter(r => r.status === 'pending').length;
    const approved = data.filter(r => r.status === 'approved').length;
    
    setStats(prev => ({
      ...prev,
      totalReservations: data.length,
      pendingReservations: pending,
      approvedReservations: approved
    }));
  };

  // Gestion des réservations
  const updateReservationStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/reservations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (!res.ok) throw new Error('Erreur de mise à jour');
      
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status } : r)
      );
      
      alert('Statut mis à jour avec succès');
      loadReservations();
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Gestion CRUD générique
  const handleDelete = async (endpoint, id, refreshFunc) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    
    try {
      const res = await fetch(`${API_BASE}${endpoint}/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Erreur de suppression');
      
      alert('Élément supprimé avec succès');
      refreshFunc();
    } catch (err) {
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setFormData(item || {});
    setImagePreview(item?.image || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
    setFormData({});
    setImagePreview(null);
  };

  // Données pour les graphiques
  const monthlyReservations = [
    { month: 'Jan', count: 12 },
    { month: 'Fév', count: 19 },
    { month: 'Mar', count: 15 },
    { month: 'Avr', count: 25 },
    { month: 'Mai', count: 22 },
    { month: 'Juin', count: 30 }
  ];

  const packageDistribution = [
    { name: 'City Tours', value: cityTours.length, color: '#1b5e8e' },
    { name: 'Destination', value: destinationPackages.length, color: '#f18f13' },
    { name: 'Ouikenac', value: ouikenacPackages.length, color: '#007335' }
  ];

  // Filtrage des réservations
  const filteredReservations = reservations.filter(r => {
    const matchesSearch = r.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-light-bg">
      <style jsx>{`
        .animate-progress {
          animation: progress-bar 1.5s infinite linear;
        }

        @keyframes progress-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }

        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .animate-zoom-in {
          animation: zoom-in 0.3s ease-out forwards;
        }

        @keyframes zoom-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <style jsx global>
        {`
        /* Charte graphique officielle E-TRAVEL WORLD AGENCY */
        :root { 
          --primary: #1b5e8e;
          --secondary: #f18f13;
          --green: #007335;
          --warning: #f7b406;
          --light-bg: #f5f7f9;
        }

        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
        .border-primary { border-color: var(--primary); }
        .focus\\:border-primary:focus { border-color: var(--primary); }
        .focus\\:ring-primary:focus { --tw-ring-color: var(--primary); }
        
        .text-secondary { color: var(--secondary); }
        .bg-secondary { background-color: var(--secondary); }
        
        .text-green { color: var(--green); }
        .bg-green { background-color: var(--green); }
        .border-green { border-color: var(--green); }

        .text-warning { color: var(--warning); }
        .bg-warning { background-color: var(--warning); }
        .border-warning { border-color: var(--warning); }
        .fill-warning { fill: var(--warning); }
        
        .bg-light-bg { background-color: var(--light-bg); }

        .bg-primary\\/10 { background-color: rgba(27, 94, 142, 0.1); }
        .bg-primary\\/5 { background-color: rgba(27, 94, 142, 0.05); }
        .border-primary\\/20 { border-color: rgba(27, 94, 142, 0.2); }
        .border-primary\\/30 { border-color: rgba(27, 94, 142, 0.3); }

        .bg-secondary\\/10 { background-color: rgba(241, 143, 19, 0.1); }
        .bg-secondary\\/20 { background-color: rgba(241, 143, 19, 0.2); }
        .border-secondary\\/20 { border-color: rgba(241, 143, 19, 0.2); }

        .bg-green\\/10 { background-color: rgba(0, 115, 53, 0.1); }
        .bg-green\\/20 { background-color: rgba(0, 115, 53, 0.2); }
        .border-green\\/30 { border-color: rgba(0, 115, 53, 0.3); }

        .bg-warning\\/20 { background-color: rgba(247, 180, 6, 0.2); }
        .border-warning\\/50 { border-color: rgba(247, 180, 6, 0.5); }

        .hover\\:bg-primary\\/90:hover { background-color: rgba(27, 94, 142, 0.9) !important; }
        .hover\\:bg-secondary\\/90:hover { background-color: rgba(241, 143, 19, 0.9) !important; }
        .hover\\:bg-green\\/90:hover { background-color: rgba(0, 115, 53, 0.9) !important; }
        .hover\\:bg-warning\\/90:hover { background-color: rgba(247, 180, 6, 0.9) !important; }
        .hover\\:text-primary\\/90:hover { color: rgba(27, 94, 142, 0.9) !important; }
        
        .hover\\:bg-primary:hover { background-color: var(--primary); }
        .hover\\:text-primary:hover { color: var(--primary); }
        .hover\\:bg-secondary:hover { background-color: var(--secondary); }
        .hover\\:text-secondary:hover { color: var(--secondary); }
        
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

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 lg:px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl lg:text-2xl font-bold text-primary">
              Dashboard Admin
            </h1>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <button 
              onClick={loadAllData}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-white border border-primary/20 text-primary rounded-lg hover:bg-primary/10 transition-colors"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-primary font-semibold">
              A
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                      lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 
                      w-64 bg-white border-r transition-transform duration-300 mt-[73px] lg:mt-0`}
        >
          <nav className="p-4 space-y-2">
            <NavItem 
              icon={<TrendingUp />} 
              label="Dashboard" 
              active={activeTab === 'dashboard'}
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            />
            <NavItem 
              icon={<Calendar />} 
              label="Réservations" 
              active={activeTab === 'reservations'}
              onClick={() => { setActiveTab('reservations'); setSidebarOpen(false); }}
              badge={stats.pendingReservations}
            />
            <NavItem 
              icon={<MapPin />} 
              label="City Tours" 
              active={activeTab === 'city-tours'}
              onClick={() => { setActiveTab('city-tours'); setSidebarOpen(false); }}
            />
            <NavItem 
              icon={<Package />} 
              label="Destination Packages" 
              active={activeTab === 'destination-packages'}
              onClick={() => { setActiveTab('destination-packages'); setSidebarOpen(false); }}
            />
            <NavItem 
              icon={<Globe />} 
              label="Ouikenac Packages" 
              active={activeTab === 'ouikenac-packages'}
              onClick={() => { setActiveTab('ouikenac-packages'); setSidebarOpen(false); }}
            />
            <NavItem 
              icon={<Building2 />} 
              label="Configuration" 
              active={activeTab === 'configuration'}
              onClick={() => { setActiveTab('configuration'); setSidebarOpen(false); }}
            />
          </nav>
        </aside>

        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20 mt-[73px]"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 min-h-screen">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {activeTab === 'dashboard' && <DashboardView stats={stats} monthlyReservations={monthlyReservations} packageDistribution={packageDistribution} />}
          {activeTab === 'reservations' && <ReservationsView reservations={filteredReservations} onUpdateStatus={updateReservationStatus} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />}
          {activeTab === 'city-tours' && <CityToursView tours={cityTours} onEdit={(item) => openModal('city-tour', item)} onDelete={(id) => handleDelete('/city-tours', id, loadCityTours)} onAdd={() => openModal('city-tour')} countries={countries} cities={cities} />}
          {activeTab === 'destination-packages' && <DestinationPackagesView packages={destinationPackages} onEdit={(item) => openModal('destination', item)} onDelete={(id) => handleDelete('/destination-packages', id, loadDestinationPackages)} onAdd={() => openModal('destination')} countries={countries} />}
          {activeTab === 'ouikenac-packages' && <OuikenacPackagesView packages={ouikenacPackages} onEdit={(item) => openModal('ouikenac', item)} onDelete={(id) => handleDelete('/ouikenac-packages', id, loadOuikenacPackages)} onAdd={() => openModal('ouikenac')} countries={countries} cities={cities} />}
          {activeTab === 'configuration' && <ConfigurationView countries={countries} cities={cities} onEditCountry={(item) => openModal('country', item)} onDeleteCountry={(id) => handleDelete('/countries', id, loadCountries)} onAddCountry={() => openModal('country')} onEditCity={(item) => openModal('city', item)} onDeleteCity={(id) => handleDelete('/cities', id, loadCities)} onAddCity={() => openModal('city')} />}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal 
          type={modalType} 
          item={selectedItem} 
          formData={formData}
          setFormData={setFormData}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          onClose={closeModal}
          onSave={() => {
            closeModal();
            loadAllData();
          }}
          countries={countries}
          cities={cities}
          API_BASE={API_BASE}
        />
      )}
    </div>
  );
};

// Composant NavItem
const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${active 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-700 hover:bg-primary/10 hover:text-primary'}`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium text-sm lg:text-base">{label}</span>
    </div>
    {badge > 0 && (
      <span className="px-2 py-1 text-xs rounded-full bg-warning text-white font-semibold">
        {badge}
      </span>
    )}
  </button>
);

// Vue Dashboard
const DashboardView = ({ stats, monthlyReservations, packageDistribution }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <StatCard 
        icon={<Calendar />} 
        title="Total Réservations" 
        value={stats.totalReservations}
        color="#1b5e8e"
        trend="+12%"
      />
      <StatCard 
        icon={<Clock />} 
        title="En Attente" 
        value={stats.pendingReservations}
        color="#f7b406"
      />
      <StatCard 
        icon={<CheckCircle />} 
        title="Approuvées" 
        value={stats.approvedReservations}
        color="#007335"
        trend="+8%"
      />
      <StatCard 
        icon={<DollarSign />} 
        title="Packages Total" 
        value={stats.cityTours + stats.destinationPackages + stats.ouikenacPackages}
        color="#f18f13"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <ChartCard title="Réservations Mensuelles">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyReservations}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#1b5e8e" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Distribution des Packages">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={packageDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {packageDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <QuickStat icon={<MapPin />} label="City Tours" value={stats.cityTours} color="#1b5e8e" />
      <QuickStat icon={<Package />} label="Destination Packages" value={stats.destinationPackages} color="#f18f13" />
      <QuickStat icon={<Globe />} label="Ouikenac Packages" value={stats.ouikenacPackages} color="#007335" />
    </div>
  </div>
);

// Vue Réservations
const ReservationsView = ({ reservations, onUpdateStatus, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => (
  <div className="space-y-4 lg:space-y-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h2 className="text-xl lg:text-2xl font-bold text-primary">Réservations</h2>
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-secondary hover:bg-secondary/90 hover:shadow-secondary-lg transition-all duration-200 font-medium">
        <Download size={16} />
        <span className="text-sm">Exporter</span>
      </button>
    </div>

    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60" size={20} />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary text-gray-700"
      >
        <option value="all">Tous les statuts</option>
        <option value="pending">En attente</option>
        <option value="approved">Approuvé</option>
        <option value="rejected">Rejeté</option>
        <option value="cancelled">Annulé</option>
      </select>
    </div>

    <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voyageurs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservations.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{r.full_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{r.created_at}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {r.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(r.id, 'approved')}
                          className="p-1 text-green hover:bg-green/10 rounded transition-colors"
                          title="Approuver"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => onUpdateStatus(r.id, 'rejected')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Rejeter"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button className="p-1 text-primary hover:bg-primary/10 rounded transition-colors" title="Voir">
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="lg:hidden space-y-4">
      {reservations.map(r => (
        <div key={r.id} className="bg-white rounded-lg shadow p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{r.full_name}</p>
              <p className="text-sm text-gray-600">{r.email}</p>
            </div>
            <StatusBadge status={r.status} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Type:</span> {r.reservable_type || 'N/A'}
            </div>
            <div>
              <span className="text-gray-500">Voyageurs:</span> {r.travelers || 1}
            </div>
          </div>
          {r.status === 'pending' && (
            <div className="flex gap-2 pt-2 border-t">
              <button
                onClick={() => onUpdateStatus(r.id, 'approved')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green/10 text-green rounded-lg hover:bg-green/20 transition-colors font-medium"
              >
                <CheckCircle size={16} />
                Approuver
              </button>
              <button
                onClick={() => onUpdateStatus(r.id, 'rejected')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                <XCircle size={16} />
                Rejeter
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Vue City Tours
const CityToursView = ({ tours, onEdit, onDelete, onAdd, countries, cities }) => (
  <DataTableView
    title="City Tours"
    data={tours}
    onAdd={onAdd}
    onEdit={onEdit}
    onDelete={onDelete}
    renderMobileCard={(tour) => (
      <div className="bg-white rounded-lg shadow p-4 space-y-3">
        {tour.image && (
          <img src={tour.image} alt={tour.title} className="w-full h-32 object-cover rounded-lg" />
        )}
        <h3 className="font-semibold">{tour.title}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-500">Ville:</span> {tour.city?.name || 'N/A'}</div>
          <div><span className="text-gray-500">Date:</span> {tour.scheduled_date}</div>
          <div><span className="text-gray-500">Min:</span> {tour.min_people}</div>
          <div><span className="text-gray-500">Max:</span> {tour.max_people}</div>
        </div>
        <div className="flex gap-2 pt-2 border-t">
          <button
            onClick={() => onEdit(tour)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium"
          >
            <Edit2 size={16} />
            Modifier
          </button>
          <button
            onClick={() => onDelete(tour.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </div>
    )}
    columns={[
      { key: 'title', label: 'Titre' },
      { key: 'city.name', label: 'Ville', render: (tour) => tour.city?.name || 'N/A' },
      { key: 'scheduled_date', label: 'Date' },
      { key: 'min_people', label: 'Min' },
      { key: 'max_people', label: 'Max' },
      { key: 'active', label: 'Actif', render: (tour) => (
        <span className={`px-2 py-1 rounded-full text-xs ${tour.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {tour.active ? '✓' : '✗'}
        </span>
      )}
    ]}
  />
);

// Vue Destination Packages
const DestinationPackagesView = ({ packages, onEdit, onDelete, onAdd, countries }) => (
  <DataTableView
    title="Destination Packages"
    data={packages}
    onAdd={onAdd}
    onEdit={onEdit}
    onDelete={onDelete}
    renderMobileCard={(pkg) => (
      <div className="bg-white rounded-lg shadow p-4 space-y-3">
        {pkg.image && (
          <img src={pkg.image} alt={pkg.title} className="w-full h-32 object-cover rounded-lg" />
        )}
        <h3 className="font-semibold">{pkg.title}</h3>
        <p className="text-sm text-gray-600">{pkg.description?.substring(0, 100)}...</p>
        <div className="text-sm">
          <span className="text-gray-500">Départ:</span> {pkg.departureCountry?.name || pkg.departure_country?.name || 'N/A'}
        </div>
        {pkg.prices && pkg.prices[0] && (
          <div className="text-sm font-semibold text-secondary">
            {pkg.prices[0].price} {pkg.prices[0].currency}
          </div>
        )}
        <div className="flex gap-2 pt-2 border-t">
          <button
            onClick={() => onEdit(pkg)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors font-medium"
          >
            <Edit2 size={16} />
            Modifier
          </button>
          <button
            onClick={() => onDelete(pkg.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </div>
    )}
    columns={[
      { key: 'title', label: 'Titre' },
      { key: 'departure_country.name', label: 'Pays de départ', render: (pkg) => pkg.departureCountry?.name || pkg.departure_country?.name || 'N/A' },
      { key: 'description', label: 'Description', render: (pkg) => pkg.description?.substring(0, 50) + '...' || 'N/A' },
      { key: 'price', label: 'Prix', render: (pkg) => pkg.prices?.[0] ? `${pkg.prices[0].price} ${pkg.prices[0].currency}` : 'N/A' }
    ]}
  />
);

// Vue Ouikenac Packages
const OuikenacPackagesView = ({ packages, onEdit, onDelete, onAdd, countries, cities }) => (
  <DataTableView
    title="Ouikenac Packages"
    data={packages}
    onAdd={onAdd}
    onEdit={onEdit}
    onDelete={onDelete}
    renderMobileCard={(pkg) => (
      <div className="bg-white rounded-lg shadow p-4 space-y-3">
        {pkg.image && (
          <img src={pkg.image} alt={pkg.title} className="w-full h-32 object-cover rounded-lg" />
        )}
        <h3 className="font-semibold">{pkg.title}</h3>
        <p className="text-sm text-gray-600">{pkg.description?.substring(0, 100)}...</p>
        {pkg.prices && pkg.prices.length > 0 && (
          <div className="text-sm">
            <span className="text-gray-500">Grilles tarifaires:</span> {pkg.prices.length}
          </div>
        )}
        {pkg.inclusions && pkg.inclusions.length > 0 && (
          <div className="text-sm">
            <span className="text-gray-500">Inclusions:</span> {pkg.inclusions.length}
          </div>
        )}
        <div className="flex gap-2 pt-2 border-t">
          <button
            onClick={() => onEdit(pkg)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green/10 text-green rounded-lg hover:bg-green/20 transition-colors font-medium"
          >
            <Edit2 size={16} />
            Modifier
          </button>
          <button
            onClick={() => onDelete(pkg.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </div>
    )}
    columns={[
      { key: 'title', label: 'Titre' },
      { key: 'description', label: 'Description', render: (pkg) => pkg.description?.substring(0, 60) + '...' || 'N/A' },
      { key: 'prices', label: 'Grilles', render: (pkg) => pkg.prices?.length || 0 },
      { key: 'inclusions', label: 'Inclusions', render: (pkg) => pkg.inclusions?.length || 0 }
    ]}
  />
);

// Vue Configuration (Pays et Villes)
const ConfigurationView = ({ countries, cities, onEditCountry, onDeleteCountry, onAddCountry, onEditCity, onDeleteCity, onAddCity }) => {
  const [configTab, setConfigTab] = useState('countries');

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl lg:text-2xl font-bold text-primary">Configuration</h2>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg shadow p-2 flex gap-2">
        <button
          onClick={() => setConfigTab('countries')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
                      ${configTab === 'countries' 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-gray-700 hover:bg-primary/10 hover:text-primary'}`}
        >
          <Globe size={20} />
          <span>Pays</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-white/20 font-semibold">
            {countries.length}
          </span>
        </button>
        <button
          onClick={() => setConfigTab('cities')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
                      ${configTab === 'cities' 
                        ? 'bg-secondary text-white shadow-md' 
                        : 'text-gray-700 hover:bg-secondary/10 hover:text-secondary'}`}
        >
          <Building2 size={20} />
          <span>Villes</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-white/20 font-semibold">
            {cities.length}
          </span>
        </button>
      </div>

      {/* Contenu selon l'onglet actif */}
      {configTab === 'countries' && (
        <CountriesView 
          countries={countries} 
          onEdit={onEditCountry} 
          onDelete={onDeleteCountry} 
          onAdd={onAddCountry} 
        />
      )}

      {configTab === 'cities' && (
        <CitiesView 
          cities={cities} 
          countries={countries}
          onEdit={onEditCity} 
          onDelete={onDeleteCity} 
          onAdd={onAddCity} 
        />
      )}
    </div>
  );
};

// Vue Countries
const CountriesView = ({ countries, onEdit, onDelete, onAdd }) => (
  <div className="space-y-4">
    <div className="flex justify-end">
      <button 
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 hover:shadow-primary-lg transition-all duration-200 font-medium"
      >
        <Plus size={16} />
        <span className="text-sm">Ajouter un pays</span>
      </button>
    </div>

    {/* Table Desktop */}
    <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Villes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {countries.map(country => (
              <tr key={country.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-primary">{country.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{country.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                    {country.cities?.length || 0} ville(s)
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(country)}
                      className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"
                      title="Modifier"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(country.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {countries.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          Aucun pays disponible
        </div>
      )}
    </div>

    {/* Cards Mobile */}
    <div className="lg:hidden space-y-4">
      {countries.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Aucun pays disponible
        </div>
      ) : (
        countries.map(country => (
          <div key={country.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{country.name}</h3>
                <p className="text-sm text-gray-600">Code: <span className="text-primary font-medium">{country.code}</span></p>
                <span className="inline-block mt-2 px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                  {country.cities?.length || 0} ville(s)
                </span>
              </div>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <button
                onClick={() => onEdit(country)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium"
              >
                <Edit2 size={16} />
                Modifier
              </button>
              <button
                onClick={() => onDelete(country.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// Vue Cities
const CitiesView = ({ cities, countries, onEdit, onDelete, onAdd }) => (
  <div className="space-y-4">
    <div className="flex justify-end">
      <button 
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-secondary hover:bg-secondary/90 hover:shadow-secondary-lg transition-all duration-200 font-medium"
      >
        <Plus size={16} />
        <span className="text-sm">Ajouter une ville</span>
      </button>
    </div>

    {/* Table Desktop */}
    <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pays</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cities.map(city => (
              <tr key={city.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{city.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {city.country?.name || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(city)}
                      className="p-1 text-secondary hover:bg-secondary/10 rounded transition-colors"
                      title="Modifier"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(city.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {cities.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          Aucune ville disponible
        </div>
      )}
    </div>

    {/* Cards Mobile */}
    <div className="lg:hidden space-y-4">
      {cities.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Aucune ville disponible
        </div>
      ) : (
        cities.map(city => (
          <div key={city.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{city.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Pays: <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {city.country?.name || 'N/A'}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <button
                onClick={() => onEdit(city)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors font-medium"
              >
                <Edit2 size={16} />
                Modifier
              </button>
              <button
                onClick={() => onDelete(city.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// Composant générique pour les tables de données
const DataTableView = ({ title, data, onAdd, onEdit, onDelete, columns, renderMobileCard }) => (
  <div className="space-y-4 lg:space-y-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h2 className="text-xl lg:text-2xl font-bold text-primary">{title}</h2>
      <button 
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 hover:shadow-primary-lg transition-all duration-200 font-medium"
      >
        <Plus size={16} />
        <span className="text-sm">Ajouter</span>
      </button>
    </div>

    <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                {columns.map((col, idx) => (
                  <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm">
                    {col.render ? col.render(item) : getNestedValue(item, col.key)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"
                      title="Modifier"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          Aucune donnée disponible
        </div>
      )}
    </div>

    <div className="lg:hidden space-y-4">
      {data.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Aucune donnée disponible
        </div>
      ) : (
        data.map(item => (
          <div key={item.id}>
            {renderMobileCard(item)}
          </div>
        ))
      )}
    </div>
  </div>
);

// Composant StatCard
const StatCard = ({ icon, title, value, color, trend }) => (
  <div className="bg-white rounded-lg shadow p-4 lg:p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs lg:text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl lg:text-3xl font-bold" style={{ color }}>{value}</p>
        {trend && (
          <p className="text-xs lg:text-sm text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp size={14} />
            {trend}
          </p>
        )}
      </div>
      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center" 
           style={{ backgroundColor: color + '20', color }}>
        {icon}
      </div>
    </div>
  </div>
);

// Composant ChartCard
const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-4 lg:p-6">
    <h3 className="text-base lg:text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

// Composant QuickStat
const QuickStat = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-4 lg:p-6 flex items-center gap-4">
    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center flex-shrink-0" 
         style={{ backgroundColor: color + '20', color }}>
      {icon}
    </div>
    <div>
      <p className="text-xs lg:text-sm text-gray-600">{label}</p>
      <p className="text-xl lg:text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  </div>
);

// Composant StatusBadge
const StatusBadge = ({ status }) => {
  const styles = {
    pending: { bg: '#fef3c7', text: '#92400e', label: 'En attente' },
    approved: { bg: '#d1fae5', text: '#065f46', label: 'Approuvé' },
    rejected: { bg: '#fee2e2', text: '#991b1b', label: 'Rejeté' },
    cancelled: { bg: '#e5e7eb', text: '#374151', label: 'Annulé' }
  };

  const style = styles[status] || styles.pending;

  return (
    <span 
      className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
};

// Composant Modal
const Modal = ({ type, item, formData, setFormData, imagePreview, setImagePreview, onClose, onSave, countries, cities, API_BASE }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [grids, setGrids] = useState(item?.prices || [{}]);
  const [inclusions, setInclusions] = useState(item?.inclusions || []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = getEndpoint(type);
      const method = item ? 'PUT' : 'POST';
      const url = item ? `${API_BASE}${endpoint}/${item.id}` : `${API_BASE}${endpoint}`;

      let body;
      let headers = {};

      if (type === 'city-tour' || type === 'destination' || type === 'ouikenac') {
        const formDataToSend = new FormData();

        if (type === 'city-tour') {
          formDataToSend.append('nom', formData.title || '');
          formDataToSend.append('country_id', formData.country_id || '');
          formDataToSend.append('city_id', formData.city_id || '');
          formDataToSend.append('date', formData.scheduled_date || '');
          formDataToSend.append('places_min', formData.min_people || '');
          formDataToSend.append('places_max', formData.max_people || '');
          formDataToSend.append('description', formData.description || '');
          formDataToSend.append('programme', formData.programme || '');
          formDataToSend.append('price', formData.price || '');
          formDataToSend.append('currency', formData.currency || 'CFA');
          
          if (formData.imageFile) {
            formDataToSend.append('image', formData.imageFile);
          }
        } else if (type === 'destination') {
          formDataToSend.append('title', formData.title || '');
          formDataToSend.append('description', formData.description || '');
          formDataToSend.append('departure_country_id', formData.departure_country_id || '');
          formDataToSend.append('price', formData.price || '');
          formDataToSend.append('currency', formData.currency || 'CFA');
          
          if (formData.imageFile) {
            formDataToSend.append('image', formData.imageFile);
          }
        } else if (type === 'ouikenac') {
          formDataToSend.append('title', formData.title || '');
          formDataToSend.append('description', formData.description || '');
          
          if (grids.length > 0) {
            formDataToSend.append('grids', JSON.stringify(grids));
          }
          
          if (inclusions.length > 0) {
            formDataToSend.append('inclusions', JSON.stringify(inclusions.map(i => i.name || i)));
          }
          
          if (formData.imageFile) {
            formDataToSend.append('image', formData.imageFile);
          }
        }

        body = formDataToSend;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(formData);
      }

      const res = await fetch(url, {
        method,
        headers,
        body
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || errorData.error || 'Erreur lors de la sauvegarde');
      }

      alert(item ? 'Modifié avec succès' : 'Créé avec succès');
      onSave();
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEndpoint = (type) => {
    const endpoints = {
      'city-tour': '/city-tours',
      'destination': '/destination-packages',
      'ouikenac': '/ouikenac-packages',
      'country': '/countries',
      'city': '/cities'
    };
    return endpoints[type] || '';
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addGrid = () => {
    setGrids([...grids, {}]);
  };

  const removeGrid = (index) => {
    setGrids(grids.filter((_, i) => i !== index));
  };

  const updateGrid = (index, field, value) => {
    const newGrids = [...grids];
    newGrids[index] = { ...newGrids[index], [field]: value };
    setGrids(newGrids);
  };

  const addInclusion = () => {
    setInclusions([...inclusions, '']);
  };

  const removeInclusion = (index) => {
    setInclusions(inclusions.filter((_, i) => i !== index));
  };

  const updateInclusion = (index, value) => {
    const newInclusions = [...inclusions];
    newInclusions[index] = value;
    setInclusions(newInclusions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div className="sticky top-0 bg-white border-b border-primary/20 px-4 lg:px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-lg lg:text-xl font-bold text-primary">
            {item ? 'Modifier' : 'Ajouter'} {getModalTitle(type)}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {(type === 'city-tour' || type === 'destination' || type === 'ouikenac') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-lg cursor-pointer hover:bg-secondary/20 transition-colors font-medium">
                  <Upload size={20} />
                  <span className="text-sm">Choisir une image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border-2 border-secondary/20" />
                )}
              </div>
            </div>
          )}

         {/* FORMULAIRE PAYS */}
            {type === 'country' && (
              <>
                {/* Champ 1 : Nom du pays (Nom) */}
                <FormField 
                  label="Nom du pays" 
                  value={formData.name || ''} 
                  onChange={(e) => handleChange('name', e.target.value)} 
                  required 
                  placeholder="Ex: France" 
                />
                {/* Champ 2 : Code du pays (Code) */}
                <FormField 
                  label="Code pays" 
                  value={formData.code || ''} 
                  onChange={(e) => handleChange('code', e.target.value)} 
                  required 
                  placeholder="Ex: FR" 
                />
              </>
            )}

            {/* FORMULAIRE VILLE */}
{type === 'city' && (
  <>
    {/* Champ 1 : Nom de la ville */}
    <FormField 
      label="Nom de la ville" 
      value={formData.name || ''} 
      onChange={(e) => handleChange('name', e.target.value)} 
      required 
      placeholder="Ex: Paris" 
    />
    {/* Champ 2 : Sélection du pays d'appartenance */}
    <FormSelect 
      label="Pays d'appartenance" 
      value={formData.country_id || ''} 
      onChange={(e) => handleChange('country_id', e.target.value)} 
      options={countries.map(c => ({ value: c.id, label: c.name }))} 
      required 
    />
  </>
)}

          {type === 'city-tour' && (
            <>
              <FormField
                label="Titre du tour"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormSelect
                  label="Pays"
                  value={formData.country_id || ''}
                  onChange={(e) => handleChange('country_id', e.target.value)}
                  options={countries.map(c => ({ value: c.id, label: c.name }))}
                  required
                />
                <FormSelect
                  label="Ville"
                  value={formData.city_id || ''}
                  onChange={(e) => handleChange('city_id', e.target.value)}
                  options={cities.filter(c => !formData.country_id || c.country_id === parseInt(formData.country_id)).map(c => ({ value: c.id, label: c.name }))}
                  required
                />
              </div>
              <FormField
                label="Date"
                type="date"
                value={formData.scheduled_date || ''}
                onChange={(e) => handleChange('scheduled_date', e.target.value)}
                required
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  label="Minimum de personnes"
                  type="number"
                  value={formData.min_people || ''}
                  onChange={(e) => handleChange('min_people', e.target.value)}
                  required
                  min="1"
                />
                <FormField
                  label="Maximum de personnes"
                  type="number"
                  value={formData.max_people || ''}
                  onChange={(e) => handleChange('max_people', e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  label="Prix"
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => handleChange('price', e.target.value)}
                  required
                  min="0"
                />
                <FormSelect
                  label="Devise"
                  value={formData.currency || 'CFA'}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  options={[
                    { value: 'CFA', label: 'CFA' },
                    { value: 'USD', label: 'USD' },
                    { value: 'EUR', label: 'EUR' }
                  ]}
                  required
                />
              </div>
              <FormTextarea
                label="Description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
              <FormTextarea
                label="Programme"
                value={formData.programme || ''}
                onChange={(e) => handleChange('programme', e.target.value)}
                rows={3}
              />
            </>
          )}

          {type === 'destination' && (
            <>
              <FormField
                label="Titre du package"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
              <FormSelect
                label="Pays de départ"
                value={formData.departure_country_id || ''}
                onChange={(e) => handleChange('departure_country_id', e.target.value)}
                options={countries.map(c => ({ value: c.id, label: c.name }))}
                required
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  label="Prix"
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => handleChange('price', e.target.value)}
                  required
                  min="0"
                />
                <FormSelect
                  label="Devise"
                  value={formData.currency || 'CFA'}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  options={[
                    { value: 'CFA', label: 'CFA' },
                    { value: 'USD', label: 'USD' },
                    { value: 'EUR', label: 'EUR' }
                  ]}
                  required
                />
              </div>
              <FormTextarea
                label="Description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
              />
            </>
          )}

          {type === 'ouikenac' && (
            <>
              <FormField
                label="Titre du package"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
              <FormTextarea
                label="Description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
              />

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-primary">Grilles tarifaires</h4>
                  <button
                    type="button"
                    onClick={addGrid}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 hover:shadow-primary-lg transition-all duration-200"
                  >
                    <Plus size={16} />
                    Ajouter une grille
                  </button>
                </div>
                <div className="space-y-4">
                  {grids.map((grid, index) => (
                    <div key={index} className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">Grille {index + 1}</span>
                        {grids.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGrid(index)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <FormSelect
                          label="Pays de départ"
                          value={grid.departure_country_id || ''}
                          onChange={(e) => updateGrid(index, 'departure_country_id', e.target.value)}
                          options={countries.map(c => ({ value: c.id, label: c.name }))}
                          required
                        />
                        <FormSelect
                          label="Ville de départ"
                          value={grid.departure_city_id || ''}
                          onChange={(e) => updateGrid(index, 'departure_city_id', e.target.value)}
                          options={cities.filter(c => !grid.departure_country_id || c.country_id === parseInt(grid.departure_country_id)).map(c => ({ value: c.id, label: c.name }))}
                          required
                        />
                        <FormSelect
                          label="Pays d'arrivée"
                          value={grid.arrival_country_id || ''}
                          onChange={(e) => updateGrid(index, 'arrival_country_id', e.target.value)}
                          options={countries.map(c => ({ value: c.id, label: c.name }))}
                        />
                        <FormSelect
                          label="Ville d'arrivée"
                          value={grid.arrival_city_id || ''}
                          onChange={(e) => updateGrid(index, 'arrival_city_id', e.target.value)}
                          options={cities.filter(c => !grid.arrival_country_id || c.country_id === parseInt(grid.arrival_country_id)).map(c => ({ value: c.id, label: c.name }))}
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        <FormField
                          label="Min personnes"
                          type="number"
                          value={grid.min_people || ''}
                          onChange={(e) => updateGrid(index, 'min_people', e.target.value)}
                          required
                          min="1"
                        />
                        <FormField
                          label="Max personnes"
                          type="number"
                          value={grid.max_people || ''}
                          onChange={(e) => updateGrid(index, 'max_people', e.target.value)}
                          min="1"
                        />
                        <FormField
                          label="Prix"
                          type="number"
                          value={grid.price || ''}
                          onChange={(e) => updateGrid(index, 'price', e.target.value)}
                          required
                          min="0"
                        />
                      </div>
                      <FormSelect
                        label="Devise"
                        value={grid.currency || 'CFA'}
                        onChange={(e) => updateGrid(index, 'currency', e.target.value)}
                        options={[
                          { value: 'CFA', label: 'CFA' },
                          { value: 'USD', label: 'USD' },
                          { value: 'EUR', label: 'EUR' }
                        ]}
                        required
                      />
                      <FormTextarea
                        label="Programme"
                        value={grid.programme || ''}
                        onChange={(e) => updateGrid(index, 'programme', e.target.value)}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-secondary">Inclusions</h4>
                  <button
                    type="button"
                    onClick={addInclusion}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-secondary text-white rounded-lg hover:bg-secondary/90 hover:shadow-secondary-lg transition-all duration-200"
                  >
                    <Plus size={16} />
                    Ajouter une inclusion
                  </button>
                </div>
                <div className="space-y-2">
                  {inclusions.map((inclusion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={typeof inclusion === 'string' ? inclusion : inclusion.name}
                        onChange={(e) => updateInclusion(index, e.target.value)}
                        placeholder="Ex: Hébergement, Transport..."
                        className="flex-1 px-4 py-2 border border-secondary/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
                      />
                      <button
                        type="button"
                        onClick={() => removeInclusion(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {inclusions.length === 0 && (
                    <p className="text-sm text-gray-500 italic">Aucune inclusion ajoutée</p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 hover:shadow-primary-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composants de formulaire
const FormField = ({ label, type = 'text', value, onChange, required, placeholder, min, max }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-secondary">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      min={min}
      max={max}
      className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
    />
  </div>
);

const FormSelect = ({ label, value, onChange, options, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-secondary">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
    >
      <option value="">Sélectionner...</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const FormTextarea = ({ label, value, onChange, required, rows = 3 }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-secondary">*</span>}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
    />
  </div>
);

// Utilitaires
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || 'N/A';
};

const getModalTitle = (type) => {
  const titles = {
    'city-tour': 'City Tour',
    'destination': 'Destination Package',
    'ouikenac': 'Ouikenac Package',
    'country': 'Pays',
    'city': 'Ville'
  };
  return titles[type] || '';
};

export default AdminDashboard; 