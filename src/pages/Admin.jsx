import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Package, MapPin, Building2, Globe, Calendar, Users, 
  TrendingUp, DollarSign, AlertCircle, CheckCircle, 
  XCircle, Clock, Plus, Edit2, Trash2, Eye, Search,
  Filter, Download, RefreshCw, ChevronDown, Menu, X
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Simulation d'API - À remplacer par de vraies requêtes
  const API_BASE = '/api'; // Ajustez selon votre configuration

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
      // Données de démonstration
      const mockData = [
        { id: 1, full_name: 'Jean Dupont', email: 'jean@example.com', status: 'pending', travelers: 2, created_at: '2025-11-10', reservable_type: 'CityTour' },
        { id: 2, full_name: 'Marie Martin', email: 'marie@example.com', status: 'approved', travelers: 4, created_at: '2025-11-12', reservable_type: 'DestinationPackage' },
        { id: 3, full_name: 'Pierre Durand', email: 'pierre@example.com', status: 'pending', travelers: 3, created_at: '2025-11-14', reservable_type: 'OuikenacPackage' }
      ];
      setReservations(mockData);
      updateStatsFromReservations(mockData);
    }
  };

  const loadCityTours = async () => {
    try {
      const res = await fetch(`${API_BASE}/city-tours`);
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setCityTours(data);
    } catch (err) {
      const mockData = [
        { id: 1, title: 'Tour de Brazzaville', city: { name: 'Brazzaville' }, scheduled_date: '2025-12-01', min_people: 5, max_people: 20, active: true },
        { id: 2, title: 'Découverte de Pointe-Noire', city: { name: 'Pointe-Noire' }, scheduled_date: '2025-12-15', min_people: 3, max_people: 15, active: true }
      ];
      setCityTours(mockData);
    }
  };

  const loadDestinationPackages = async () => {
    try {
      const res = await fetch(`${API_BASE}/destination-packages`);
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setDestinationPackages(data);
    } catch (err) {
      const mockData = [
        { id: 1, title: 'Safari Kenya', departure_country: { name: 'Congo' }, description: 'Safari de 7 jours' },
        { id: 2, title: 'Plages du Sénégal', departure_country: { name: 'Congo' }, description: 'Séjour balnéaire' }
      ];
      setDestinationPackages(mockData);
    }
  };

  const loadOuikenacPackages = async () => {
    try {
      const res = await fetch(`${API_BASE}/ouikenac-packages`);
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setOuikenacPackages(data);
    } catch (err) {
      const mockData = [
        { id: 1, title: 'Circuit Afrique de l\'Ouest', description: 'Multi-pays' },
        { id: 2, title: 'Route des Épices', description: 'Découverte culturelle' }
      ];
      setOuikenacPackages(mockData);
    }
  };

  const loadCountries = async () => {
    try {
      const res = await fetch(`${API_BASE}/countries`);
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setCountries(data);
    } catch (err) {
      const mockData = [
        { id: 1, code: 'CG', name: 'Congo' },
        { id: 2, code: 'KE', name: 'Kenya' },
        { id: 3, code: 'SN', name: 'Sénégal' }
      ];
      setCountries(mockData);
    }
  };

  const loadCities = async () => {
    try {
      const res = await fetch(`${API_BASE}/cities`);
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setCities(data);
    } catch (err) {
      const mockData = [
        { id: 1, name: 'Brazzaville', country: { name: 'Congo' } },
        { id: 2, name: 'Pointe-Noire', country: { name: 'Congo' } },
        { id: 3, name: 'Nairobi', country: { name: 'Kenya' } }
      ];
      setCities(mockData);
    }
  };

  const updateStatsFromReservations = (data) => {
    const pending = data.filter(r => r.status === 'pending').length;
    const approved = data.filter(r => r.status === 'approved').length;
    
    setStats(prev => ({
      ...prev,
      totalReservations: data.length,
      pendingReservations: pending,
      approvedReservations: approved,
      cityTours: cityTours.length,
      destinationPackages: destinationPackages.length,
      ouikenacPackages: ouikenacPackages.length,
      countries: countries.length
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
      
      refreshFunc();
      alert('Élément supprimé avec succès');
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
    setFormData({});
  };

  // Données pour les graphiques
  const monthlyReservations = [
    { month: 'Jan', count: 12 },
    { month: 'Fév', count: 19 },
    { month: 'Mar', count: 15 },
    { month: 'Avr', count: 25 },
    { month: 'Mai', count: 22 },
    { month: 'Juin', count: 30 },
    { month: 'Juil', count: 28 },
    { month: 'Août', count: 35 },
    { month: 'Sep', count: 32 },
    { month: 'Oct', count: 40 },
    { month: 'Nov', count: 15 }
  ];

  const packageDistribution = [
    { name: 'City Tours', value: cityTours.length, color: '#1b5e8e' },
    { name: 'Destination', value: destinationPackages.length, color: '#f18f13' },
    { name: 'Ouikenac', value: ouikenacPackages.length, color: '#007335' }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Fév', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Avr', revenue: 61000 },
    { month: 'Mai', revenue: 55000 },
    { month: 'Juin', revenue: 67000 }
  ];

  // Filtrage des réservations
  const filteredReservations = reservations.filter(r => {
    const matchesSearch = r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
              Dashboard Admin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={loadAllData}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" 
                 style={{ backgroundColor: 'var(--primary)' }}>
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
                      w-64 bg-white border-r transition-transform duration-300 mt-16 lg:mt-0`}
        >
          <nav className="p-4 space-y-2">
            <NavItem 
              icon={<TrendingUp />} 
              label="Dashboard" 
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            />
            <NavItem 
              icon={<Calendar />} 
              label="Réservations" 
              active={activeTab === 'reservations'}
              onClick={() => setActiveTab('reservations')}
              badge={stats.pendingReservations}
            />
            <NavItem 
              icon={<MapPin />} 
              label="City Tours" 
              active={activeTab === 'city-tours'}
              onClick={() => setActiveTab('city-tours')}
            />
            <NavItem 
              icon={<Package />} 
              label="Destination Packages" 
              active={activeTab === 'destination-packages'}
              onClick={() => setActiveTab('destination-packages')}
            />
            <NavItem 
              icon={<Globe />} 
              label="Ouikenac Packages" 
              active={activeTab === 'ouikenac-packages'}
              onClick={() => setActiveTab('ouikenac-packages')}
            />
            <NavItem 
              icon={<Globe />} 
              label="Pays" 
              active={activeTab === 'countries'}
              onClick={() => setActiveTab('countries')}
            />
            <NavItem 
              icon={<Building2 />} 
              label="Villes" 
              active={activeTab === 'cities'}
              onClick={() => setActiveTab('cities')}
            />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {activeTab === 'dashboard' && <DashboardView stats={stats} monthlyReservations={monthlyReservations} packageDistribution={packageDistribution} revenueData={revenueData} />}
          {activeTab === 'reservations' && <ReservationsView reservations={filteredReservations} onUpdateStatus={updateReservationStatus} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />}
          {activeTab === 'city-tours' && <CityToursView tours={cityTours} onEdit={(item) => openModal('city-tour', item)} onDelete={(id) => handleDelete('/city-tours', id, loadCityTours)} onAdd={() => openModal('city-tour')} />}
          {activeTab === 'destination-packages' && <DestinationPackagesView packages={destinationPackages} onEdit={(item) => openModal('destination', item)} onDelete={(id) => handleDelete('/destination-packages', id, loadDestinationPackages)} onAdd={() => openModal('destination')} />}
          {activeTab === 'ouikenac-packages' && <OuikenacPackagesView packages={ouikenacPackages} onEdit={(item) => openModal('ouikenac', item)} onDelete={(id) => handleDelete('/ouikenac-packages', id, loadOuikenacPackages)} onAdd={() => openModal('ouikenac')} />}
          {activeTab === 'countries' && <CountriesView countries={countries} onEdit={(item) => openModal('country', item)} onDelete={(id) => handleDelete('/countries', id, loadCountries)} onAdd={() => openModal('country')} />}
          {activeTab === 'cities' && <CitiesView cities={cities} countries={countries} onEdit={(item) => openModal('city', item)} onDelete={(id) => handleDelete('/cities', id, loadCities)} onAdd={() => openModal('city')} />}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal 
          type={modalType} 
          item={selectedItem} 
          formData={formData}
          setFormData={setFormData}
          onClose={closeModal}
          onSave={() => {
            closeModal();
            loadAllData();
          }}
          countries={countries}
          cities={cities}
        />
      )}
    </div>
  );
};

// Composant NavItem
const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors
                ${active ? 'text-white' : 'text-gray-700 hover:bg-gray-100'}`}
    style={active ? { backgroundColor: 'var(--primary)' } : {}}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    {badge > 0 && (
      <span className="px-2 py-1 text-xs rounded-full bg-red-500 text-white">
        {badge}
      </span>
    )}
  </button>
);

// Vue Dashboard
const DashboardView = ({ stats, monthlyReservations, packageDistribution, revenueData }) => (
  <div className="space-y-6">
    {/* Cards de statistiques */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        icon={<Calendar />} 
        title="Total Réservations" 
        value={stats.totalReservations}
        color="var(--primary)"
        trend="+12%"
      />
      <StatCard 
        icon={<Clock />} 
        title="En Attente" 
        value={stats.pendingReservations}
        color="var(--warning)"
      />
      <StatCard 
        icon={<CheckCircle />} 
        title="Approuvées" 
        value={stats.approvedReservations}
        color="var(--green)"
        trend="+8%"
      />
      <StatCard 
        icon={<DollarSign />} 
        title="Revenu Total" 
        value="2.5M CFA"
        color="var(--secondary)"
        trend="+15%"
      />
    </div>

    {/* Graphiques */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Réservations Mensuelles">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyReservations}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="var(--primary)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Distribution des Packages">
        <ResponsiveContainer width="100%" height={300}>
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

    <ChartCard title="Évolution du Revenu">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="var(--secondary)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>

    {/* Statistiques rapides */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <QuickStat icon={<MapPin />} label="City Tours" value={stats.cityTours} color="var(--primary)" />
      <QuickStat icon={<Package />} label="Destination Packages" value={stats.destinationPackages} color="var(--secondary)" />
      <QuickStat icon={<Globe />} label="Ouikenac Packages" value={stats.ouikenacPackages} color="var(--green)" />
    </div>
  </div>
);

// Vue Réservations
const ReservationsView = ({ reservations, onUpdateStatus, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Réservations</h2>
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white" 
              style={{ backgroundColor: 'var(--primary)' }}>
        <Download size={16} />
        Exporter
      </button>
    </div>

    {/* Filtres */}
    <div className="flex gap-4 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">Tous les statuts</option>
        <option value="pending">En attente</option>
        <option value="approved">Approuvé</option>
        <option value="rejected">Rejeté</option>
        <option value="cancelled">Annulé</option>
      </select>
    </div>

    {/* Table */}
    <div className="bg-white rounded-lg shadow overflow-hidden">
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
              <td className="px-6 py-4 whitespace-nowrap text-sm">{r.reservable_type}</td>
              <td className="px-6 py-4 whitespace-nowrap">{r.travelers || 1}</td>
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
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Approuver"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(r.id, 'rejected')}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Rejeter"
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  )}
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Voir">
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
);

// Vue City Tours
const CityToursView = ({ tours, onEdit, onDelete, onAdd }) => (
  <DataTableView
    title="City Tours"
    data={tours}
    onAdd={onAdd}
    onEdit={onEdit}
    onDelete={onDelete}
    columns={[
      { key: 'title', label: 'Titre' },
      { key: 'city.name', label: 'Ville', render: (tour) => tour.city?.name || 'N/A' },
      { key: 'scheduled_date', label: 'Date' },
      { key: 'min_people', label: 'Min' },
      { key: 'max_people', label: 'Max' },
      { key: 'active', label: 'Actif', render: (tour) => tour.active ? '✓' : '✗' }
    ]}
  />
);

// Vue Destination Packages
const DestinationPackagesView = ({ packages, onEdit, onDelete, onAdd }) => (
  <DataTableView
    title="Destination Packages"
    data={packages}
    onAdd={onAdd}
    onEdit={onEdit}
    onDelete={onDelete}
    columns={[
      { key: 'title', label: 'Titre' },
      { key: 'departure_country.name', label: 'Pays de départ', render: (pkg) => pkg.departure_country?.name || 'N/A' },
      { key: 'description', label: 'Description' }
    ]}
  />
);

// Vue Ouikenac Packages
const OuikenacPackagesView = ({ packages, onEdit, onDelete, onAdd }) => (
  <DataTableView
    title="Ouikenac Packages"
    data={packages}
    onAdd={onAdd}
    onEdit={onEdit}
    onDelete={onDelete}
    columns={[
      { key: 'title', label: 'Titre' },
      { key: 'description', label: 'Description' }
    ]}
  />
);

// Vue Countries
const CountriesView = ({ countries, onEdit, onDelete, onAdd }) => (
  <DataTableView
    title="Pays"
    data={countries}
    onAdd={onAdd}
    onEdit={onEdit}
    onDelete={onDelete}
    columns={[
      { key: 'code', label: 'Code' },
      { key: 'name', label: 'Nom' }
    ]}
  />
);

// Vue Cities
const CitiesView = ({ cities, countries, onEdit, onDelete, onAdd }) => (
  <DataTableView
    title="Villes"
    data={cities}
    onAdd={onAdd}
    onEdit={onEdit}
    onDelete={onDelete}
    columns={[
      { key: 'name', label: 'Nom' },
      { key: 'country.name', label: 'Pays', render: (city) => city.country?.name || 'N/A' }
    ]}
  />
);

// Composant générique pour les tables de données
const DataTableView = ({ title, data, onAdd, onEdit, onDelete, columns }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">{title}</h2>
      <button 
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white" 
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <Plus size={16} />
        Ajouter
      </button>
    </div>

    <div className="bg-white rounded-lg shadow overflow-hidden">
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
            <tr key={item.id} className="hover:bg-gray-50">
              {columns.map((col, idx) => (
                <td key={idx} className="px-6 py-4 whitespace-nowrap">
                  {col.render ? col.render(item) : getNestedValue(item, col.key)}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Modifier"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
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
      {data.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          Aucune donnée disponible
        </div>
      )}
    </div>
  </div>
);

// Composant StatCard
const StatCard = ({ icon, title, value, color, trend }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold" style={{ color }}>{value}</p>
        {trend && (
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp size={14} />
            {trend}
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
           style={{ backgroundColor: color + '20', color }}>
        {icon}
      </div>
    </div>
  </div>
);

// Composant ChartCard
const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

// Composant QuickStat
const QuickStat = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
    <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
         style={{ backgroundColor: color + '20', color }}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
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
      className="px-3 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
};

// Composant Modal
const Modal = ({ type, item, formData, setFormData, onClose, onSave, countries, cities }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = getEndpoint(type);
      const method = item ? 'PUT' : 'POST';
      const url = item ? `${endpoint}/${item.id}` : endpoint;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de la sauvegarde');
      }

      alert(item ? 'Modifié avec succès' : 'Créé avec succès');
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getEndpoint = (type) => {
    const endpoints = {
      'city-tour': '/api/city-tours',
      'destination': '/api/destination-packages',
      'ouikenac': '/api/ouikenac-packages',
      'country': '/api/countries',
      'city': '/api/cities'
    };
    return endpoints[type] || '/api';
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {item ? 'Modifier' : 'Ajouter'} {getModalTitle(type)}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {type === 'country' && (
            <>
              <FormField
                label="Code pays"
                value={formData.code || ''}
                onChange={(e) => handleChange('code', e.target.value)}
                required
                placeholder="Ex: CG"
              />
              <FormField
                label="Nom du pays"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="Ex: Congo"
              />
            </>
          )}

          {type === 'city' && (
            <>
              <FormField
                label="Nom de la ville"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="Ex: Brazzaville"
              />
              <FormSelect
                label="Pays"
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
                options={cities.map(c => ({ value: c.id, label: c.name }))}
                required
              />
              <FormField
                label="Date"
                type="date"
                value={formData.scheduled_date || ''}
                onChange={(e) => handleChange('scheduled_date', e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
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
              <FormTextarea
                label="Description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
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
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg text-white disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary)' }}
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
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      min={min}
      max={max}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const FormSelect = ({ label, value, onChange, options, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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