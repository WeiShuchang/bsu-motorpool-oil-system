import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminHeader from '@/Components/AdminHeader';
import { Users } from 'lucide-react';
import {
    Car,
    FileText,
    Clock,
    Eye,
    Search,
    Filter,
    CheckCircle,
    XCircle
} from 'lucide-react';

// ─── Skeleton primitives ──────────────────────────────────────────────────────
const Shimmer = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Card skeleton — mirrors: icon top-left, "Last 30d" top-right, big number, label
const StatCardSkeleton = ({ bgColor, borderColor }) => (
    <div className={`${bgColor} rounded-xl border ${borderColor} p-4`}>
        <div className="flex items-center justify-between mb-2">
            <Shimmer className="size-6 rounded-md" />
            <Shimmer className="h-3 w-14 rounded" />
        </div>
        <div className="space-y-2">
            <Shimmer className="h-8 w-16 rounded" />
            <Shimmer className="h-3 w-24 rounded" />
        </div>
    </div>
);

// Vehicle table row skeleton — mirrors: image+plate, make, model, seat, lastService, status badge, eye icon
const VehicleRowSkeleton = () => (
    <tr className="border-b border-green-50">
        <td className="py-3 px-4 text-center">
            <div className="flex flex-col items-center gap-1.5">
                <Shimmer className="w-16 h-10 rounded-lg" />
                <Shimmer className="h-3 w-16 rounded" />
            </div>
        </td>
        <td className="py-3 px-4"><Shimmer className="h-4 w-20 rounded" /></td>
        <td className="py-3 px-4"><Shimmer className="h-4 w-20 rounded" /></td>
        <td className="py-3 px-4"><Shimmer className="h-4 w-8 rounded" /></td>
        <td className="py-3 px-4"><Shimmer className="h-4 w-24 rounded" /></td>
        <td className="py-3 px-4"><Shimmer className="h-5 w-20 rounded-full" /></td>
        <td className="py-3 px-4"><Shimmer className="size-7 rounded-lg" /></td>
    </tr>
);

// Driver table row skeleton — mirrors: avatar+name, contact, email, vehicles count, status badge, eye icon
const DriverRowSkeleton = () => (
    <tr className="border-b border-green-50">
        <td className="py-3 px-4 text-center">
            <div className="flex flex-col items-center gap-1.5">
                <Shimmer className="size-10 rounded-full" />
                <Shimmer className="h-3 w-24 rounded" />
            </div>
        </td>
        <td className="py-3 px-4"><Shimmer className="h-4 w-28 rounded" /></td>
        <td className="py-3 px-4"><Shimmer className="h-4 w-36 rounded" /></td>
        <td className="py-3 px-4"><Shimmer className="h-4 w-6 rounded" /></td>
        <td className="py-3 px-4"><Shimmer className="h-5 w-16 rounded-full" /></td>
        <td className="py-3 px-4"><Shimmer className="size-7 rounded-lg" /></td>
    </tr>
);

// Record table row skeleton — mirrors: vehicle image+plate, driver avatar+name, date, note (wide, multiline), status badge
const RecordRowSkeleton = () => (
    <tr className="border-b border-green-50">
        <td className="py-3 px-4 text-center">
            <div className="flex flex-col items-center gap-1.5">
                <Shimmer className="w-16 h-10 rounded-lg" />
                <Shimmer className="h-3 w-16 rounded" />
            </div>
        </td>
        <td className="py-3 px-4 text-center">
            <div className="flex flex-col items-center gap-1.5">
                <Shimmer className="size-10 rounded-full" />
                <Shimmer className="h-3 w-20 rounded" />
            </div>
        </td>
        <td className="py-3 px-4"><Shimmer className="h-4 w-24 rounded" /></td>
        <td className="py-3 px-4">
            <div className="space-y-1.5">
                <Shimmer className="h-3 w-full rounded" />
                <Shimmer className="h-3 w-4/5 rounded" />
                <Shimmer className="h-3 w-2/3 rounded" />
            </div>
        </td>
        <td className="py-3 px-4"><Shimmer className="h-5 w-20 rounded-full" /></td>
    </tr>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('vehicles');
    const [searchTerm, setSearchTerm] = useState('');

    // Vehicles state
    const [vehicles, setVehicles] = useState([]);
    const [vehiclesLoading, setVehiclesLoading] = useState(true);
    const [vehiclesError, setVehiclesError] = useState(null);

    useEffect(() => {
        const fetchAdminVehicles = async () => {
            setVehiclesLoading(true);
            setVehiclesError(null);
            try {
                const response = await fetch('/admin/dashboard/vehicles', {
                    headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                });
                if (!response.ok) throw new Error('Failed to fetch vehicles');
                const data = await response.json();
                setVehicles(data.vehicles);
            } catch (err) {
                setVehiclesError(err.message);
            } finally {
                setVehiclesLoading(false);
            }
        };
        fetchAdminVehicles();
    }, []);

    // Drivers state
    const [drivers, setDrivers] = useState([]);
    const [driversLoading, setDriversLoading] = useState(true);
    const [driversError, setDriversError] = useState(null);

    useEffect(() => {
        const fetchAdminDrivers = async () => {
            setDriversLoading(true);
            setDriversError(null);
            try {
                const response = await fetch('/admin/dashboard/drivers', {
                    headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                });
                if (!response.ok) throw new Error('Failed to fetch drivers');
                const data = await response.json();
                setDrivers(data.drivers);
            } catch (err) {
                setDriversError(err.message);
            } finally {
                setDriversLoading(false);
            }
        };
        fetchAdminDrivers();
    }, []);

    // Stats state
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsData, setStatsData] = useState({
        totalVehicles: 0,
        activeDrivers: 0,
        serviceRecords: 0,
        reports: 0,
    });

    useEffect(() => {
        const fetchAdminStats = async () => {
            setStatsLoading(true);
            try {
                const response = await fetch('/admin/dashboard/stats', {
                    headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                });
                if (!response.ok) throw new Error('Failed to fetch stats');
                const data = await response.json();
                setStatsData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setStatsLoading(false);
            }
        };
        fetchAdminStats();
    }, []);

    // Service Records state
    const [records, setRecords] = useState([]);
    const [recordsLoading, setRecordsLoading] = useState(true);
    const [recordsError, setRecordsError] = useState(null);

    useEffect(() => {
        const fetchAdminServiceRecords = async () => {
            setRecordsLoading(true);
            setRecordsError(null);
            try {
                const response = await fetch('/admin/dashboard/records', {
                    headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                });
                if (!response.ok) throw new Error('Failed to fetch service records');
                const data = await response.json();
                setRecords(data.records);
            } catch (err) {
                setRecordsError(err.message);
            } finally {
                setRecordsLoading(false);
            }
        };
        fetchAdminServiceRecords();
    }, []);

    const statCards = [
        { label: 'Total Vehicles',  value: statsData.totalVehicles,  icon: Car,      bgColor: 'bg-green-50',  borderColor: 'border-green-100',  textColor: 'text-green-700',  iconColor: 'text-green-500'  },
        { label: 'Active Drivers',  value: statsData.activeDrivers,  icon: Users,    bgColor: 'bg-blue-50',   borderColor: 'border-blue-100',   textColor: 'text-blue-700',   iconColor: 'text-blue-500'   },
        { label: 'Service Records', value: statsData.serviceRecords, icon: FileText, bgColor: 'bg-purple-50', borderColor: 'border-purple-100', textColor: 'text-purple-700', iconColor: 'text-purple-500' },
        { label: 'Reports',         value: statsData.reports,        icon: Clock,    bgColor: 'bg-yellow-50', borderColor: 'border-yellow-100', textColor: 'text-yellow-700', iconColor: 'text-yellow-500' },
    ];

    const filteredVehicles = vehicles.filter(v =>
        v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDrivers = drivers.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRecords = records.filter(r =>
        r.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.driver.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status, color) => {
        const colors = {
            green:  'bg-green-50 text-green-700 border-green-200',
            yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            red:    'bg-red-50 text-red-700 border-red-200',
            blue:   'bg-blue-50 text-blue-700 border-blue-200',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.green}`}>
                {status === 'Completed' && <CheckCircle className="size-3 mr-1" />}
                {status === 'Overdue'   && <XCircle     className="size-3 mr-1" />}
                {status}
            </span>
        );
    };

    return (
        <>
            <Head title="Admin Dashboard - BSU Motorpool" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
                <AdminHeader />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* ── Stats Grid ── */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                        {statCards.map((stat, index) =>
                            statsLoading ? (
                                <StatCardSkeleton key={index} bgColor={stat.bgColor} borderColor={stat.borderColor} />
                            ) : (
                                <div key={index} className={`${stat.bgColor} rounded-xl border ${stat.borderColor} p-4 hover:shadow-md transition-shadow`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <stat.icon className={`size-6 ${stat.iconColor}`} />
                                        <span className={`text-xs font-medium ${stat.textColor}`}>Last 30d</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-xs text-gray-600">{stat.label}</p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* ── Tabs ── */}
                    <div className="bg-white rounded-xl border border-green-100 shadow-sm mb-6">
                        <div className="border-b border-green-100 px-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <nav className="flex space-x-1" aria-label="Tabs">
                                    {['vehicles', 'drivers', 'records'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                                activeTab === tab
                                                    ? 'border-green-600 text-green-700'
                                                    : 'border-transparent text-gray-500 hover:text-green-600 hover:border-green-200'
                                            }`}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </nav>

                                <div className="flex items-center gap-2 pb-3 sm:pb-0">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={`Search ${activeTab}...`}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9 pr-4 py-2 text-sm border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 w-full sm:w-64"
                                        />
                                    </div>
                                    <button className="p-2 border border-green-200 rounded-lg hover:bg-green-50">
                                        <Filter className="size-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">

                            {/* ── Vehicles Tab ── */}
                            {activeTab === 'vehicles' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-green-100">
                                                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
                                                <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Make</th>
                                                <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                                                <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Seat Capacity</th>
                                                <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Service</th>
                                                <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-green-50">
                                            {vehiclesLoading ? (
                                                Array.from({ length: 5 }).map((_, i) => <VehicleRowSkeleton key={i} />)
                                            ) : vehiclesError ? (
                                                <tr><td colSpan={7} className="py-12 text-center text-sm text-red-400">{vehiclesError}</td></tr>
                                            ) : filteredVehicles.length === 0 ? (
                                                <tr><td colSpan={7} className="py-12 text-center text-sm text-gray-400">No vehicles found.</td></tr>
                                            ) : filteredVehicles.map((vehicle) => (
                                                <tr key={vehicle.id} className="hover:bg-green-50/50 transition-colors">
                                                    <td className="py-3 px-4 text-center">
                                                        <div className="flex flex-col items-center gap-1.5">
                                                            {vehicle.image ? (
                                                                <img src={vehicle.image} alt={vehicle.plate} className="w-16 h-10 rounded-lg object-cover border border-green-100" />
                                                            ) : (
                                                                <div className="w-16 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center">
                                                                    <Car className="size-5 text-green-400" />
                                                                </div>
                                                            )}
                                                            <span className="font-medium text-green-700">{vehicle.plate}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">{vehicle.make}</td>
                                                    <td className="py-3 px-4 text-gray-600">{vehicle.model}</td>
                                                    <td className="py-3 px-4 text-gray-600">{vehicle.seatCapacity}</td>
                                                    <td className="py-3 px-4 text-gray-600">{vehicle.lastService ?? '—'}</td>
                                                    <td className="py-3 px-4">{getStatusBadge(vehicle.status, vehicle.statusColor)}</td>
                                                    <td className="py-3 px-4">
                                                        <Link
                                                            href={`/driver/vehicle/${vehicle.id}`}
                                                            className="p-1.5 rounded-lg text-gray-500 hover:text-green-700 hover:bg-green-50 transition-colors inline-flex"
                                                            title="View Details"
                                                        >
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* ── Drivers Tab ── */}
                            {activeTab === 'drivers' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-green-100">
                                                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                                                <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Vehicles</th>
                                                <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-green-50">
                                            {driversLoading ? (
                                                Array.from({ length: 5 }).map((_, i) => <DriverRowSkeleton key={i} />)
                                            ) : driversError ? (
                                                <tr><td colSpan={6} className="py-12 text-center text-sm text-red-400">{driversError}</td></tr>
                                            ) : filteredDrivers.length === 0 ? (
                                                <tr><td colSpan={6} className="py-12 text-center text-sm text-gray-400">No drivers found.</td></tr>
                                            ) : filteredDrivers.map((driver) => (
                                                <tr key={driver.id} className="hover:bg-green-50/50 transition-colors">
                                                    <td className="py-3 px-4 text-center">
                                                        <div className="flex flex-col items-center gap-1.5">
                                                            {driver.image ? (
                                                                <img src={driver.image} alt={driver.name} className="size-10 rounded-full object-cover border border-green-100" />
                                                            ) : (
                                                                <div className="size-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                                                                    <Users className="size-5 text-green-400" />
                                                                </div>
                                                            )}
                                                            <span className="font-medium text-green-700">{driver.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">{driver.contactNumber ?? '—'}</td>
                                                    <td className="py-3 px-4 text-gray-600">{driver.email}</td>
                                                    <td className="py-3 px-4 text-gray-600">{driver.vehicles}</td>
                                                    <td className="py-3 px-4">{getStatusBadge(driver.status, driver.statusColor)}</td>
                                                    <td className="py-3 px-4">
                                                        <button className="p-1.5 rounded-lg text-gray-500 hover:text-green-700 hover:bg-green-50 transition-colors" title="View Details">
                                                            <Eye className="size-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* ── Records Tab ── */}
                            {activeTab === 'records' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-green-100">
                                                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                                                <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Service Date</th>
                                                <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Note</th>
                                                <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-green-50">
                                            {recordsLoading ? (
                                                Array.from({ length: 5 }).map((_, i) => <RecordRowSkeleton key={i} />)
                                            ) : recordsError ? (
                                                <tr><td colSpan={5} className="py-12 text-center text-sm text-red-400">{recordsError}</td></tr>
                                            ) : filteredRecords.length === 0 ? (
                                                <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400">No service records found.</td></tr>
                                            ) : filteredRecords.map((record) => (
                                                <tr key={record.id} className="hover:bg-green-50/50 transition-colors">
                                                    <td className="py-3 px-4 text-center">
                                                        <div className="flex flex-col items-center gap-1.5">
                                                            {record.image ? (
                                                                <img src={record.image} alt={record.vehicle} className="w-16 h-10 rounded-lg object-cover border border-green-100" />
                                                            ) : (
                                                                <div className="w-16 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center">
                                                                    <Car className="size-5 text-green-400" />
                                                                </div>
                                                            )}
                                                            <span className="font-medium text-green-700 whitespace-nowrap">{record.vehicle}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <div className="flex flex-col items-center gap-1.5">
                                                            {record.driverImage ? (
                                                                <img src={record.driverImage} alt={record.driver} className="size-10 rounded-full object-cover border border-green-100" />
                                                            ) : (
                                                                <div className="size-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                                                                    <Users className="size-5 text-green-400" />
                                                                </div>
                                                            )}
                                                            <span className="text-gray-600 whitespace-nowrap">{record.driver}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{record.serviceDate}</td>
                                                    <td className="py-3 px-4 text-gray-600 text-sm leading-relaxed">{record.note}</td>
                                                    <td className="py-3 px-4 whitespace-nowrap">{getStatusBadge(record.status, 'green')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}