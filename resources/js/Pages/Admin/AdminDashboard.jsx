import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminHeader from '@/Components/AdminHeader';
import { Users } from 'lucide-react';
import { 
    Car, 
    FileText, 
    AlertCircle, 
    Clock,
    Eye,
    Plus,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    XCircle
} from 'lucide-react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('vehicles');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data - replace with actual data from backend
    const stats = [
        { 
            label: 'Total Vehicles', 
            value: '24', 
            icon: Car, 
            color: 'green',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            iconColor: 'text-green-500'
        },
        { 
            label: 'Active Drivers', 
            value: '18', 
            icon: Users, 
            color: 'blue',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
            iconColor: 'text-blue-500'
        },
        { 
            label: 'Service Records', 
            value: '156', 
            icon: FileText, 
            color: 'purple',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700',
            iconColor: 'text-purple-500'
        },
        { 
            label: 'Due Soon', 
            value: '8', 
            icon: Clock, 
            color: 'yellow',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-700',
            iconColor: 'text-yellow-500'
        },

    ];

    const vehicles = [
        {
            id: 1,
            plate: 'ABC-1234',
            model: 'Toyota Hiace',
            year: 2020,
            driver: 'John Driver',
            mileage: '45,230 km',
            lastService: 'Jan 15, 2026',
            nextDue: 'Apr 15, 2026',
            status: 'On Track',
            statusColor: 'green'
        },
        {
            id: 2,
            plate: 'XYZ-5678',
            model: 'Mitsubishi L300',
            year: 2019,
            driver: 'John Driver',
            mileage: '38,450 km',
            lastService: 'Feb 01, 2026',
            nextDue: 'May 01, 2026',
            status: 'On Track',
            statusColor: 'green'
        },
        {
            id: 3,
            plate: 'DEF-9012',
            model: 'Nissan Urvan',
            year: 2021,
            driver: 'Jane Driver',
            mileage: '52,100 km',
            lastService: 'Jan 20, 2026',
            nextDue: 'Apr 20, 2026',
            status: 'Due Soon',
            statusColor: 'yellow'
        },
        {
            id: 4,
            plate: 'GHI-3456',
            model: 'Isuzu Elf',
            year: 2018,
            driver: 'Jane Driver',
            mileage: '68,900 km',
            lastService: 'Dec 28, 2025',
            nextDue: 'Mar 28, 2026',
            status: 'Overdue',
            statusColor: 'red'
        },
        {
            id: 5,
            plate: 'JKL-7890',
            model: 'Ford Transit',
            year: 2022,
            driver: 'Mike Driver',
            mileage: '22,450 km',
            lastService: 'Mar 01, 2026',
            nextDue: 'Jun 01, 2026',
            status: 'On Track',
            statusColor: 'green'
        },
        {
            id: 6,
            plate: 'MNO-1122',
            model: 'Hyundai H100',
            year: 2020,
            driver: 'Mike Driver',
            mileage: '41,230 km',
            lastService: 'Feb 15, 2026',
            nextDue: 'May 15, 2026',
            status: 'On Track',
            statusColor: 'green'
        },
    ];

    const drivers = [
        {
            id: 1,
            name: 'John Driver',
            email: 'john.driver@bsumotorpool.edu',
            vehicles: 2,
            status: 'Active',
            statusColor: 'green',
            lastActive: 'Today'
        },
        {
            id: 2,
            name: 'Jane Driver',
            email: 'jane.driver@bsumotorpool.edu',
            vehicles: 2,
            status: 'Active',
            statusColor: 'green',
            lastActive: 'Yesterday'
        },
        {
            id: 3,
            name: 'Mike Driver',
            email: 'mike.driver@bsumotorpool.edu',
            vehicles: 2,
            status: 'Active',
            statusColor: 'green',
            lastActive: 'Today'
        },
        {
            id: 4,
            name: 'Sarah Driver',
            email: 'sarah.driver@bsumotorpool.edu',
            vehicles: 1,
            status: 'Inactive',
            statusColor: 'red',
            lastActive: '3 days ago'
        },
    ];

    const recentRecords = [
        {
            id: 1,
            vehicle: 'ABC-1234',
            driver: 'John Driver',
            serviceDate: 'Mar 15, 2026',
            type: 'Oil Change',
            mileage: '45,230 km',
            status: 'Completed'
        },
        {
            id: 2,
            vehicle: 'XYZ-5678',
            driver: 'John Driver',
            serviceDate: 'Mar 14, 2026',
            type: 'Lubrication',
            mileage: '38,450 km',
            status: 'Completed'
        },
        {
            id: 3,
            vehicle: 'DEF-9012',
            driver: 'Jane Driver',
            serviceDate: 'Mar 12, 2026',
            type: 'Oil Change',
            mileage: '52,100 km',
            status: 'Completed'
        },
        {
            id: 4,
            vehicle: 'MNO-1122',
            driver: 'Mike Driver',
            serviceDate: 'Mar 10, 2026',
            type: 'Filter Change',
            mileage: '41,230 km',
            status: 'Completed'
        },
    ];

    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDrivers = drivers.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status, color) => {
        const colors = {
            green: 'bg-green-50 text-green-700 border-green-200',
            yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            red: 'bg-red-50 text-red-700 border-red-200',
            blue: 'bg-blue-50 text-blue-700 border-blue-200',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.green}`}>
                {status === 'Completed' && <CheckCircle className="size-3 mr-1" />}
                {status === 'Overdue' && <XCircle className="size-3 mr-1" />}
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
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`${stat.bgColor} rounded-xl border border-${stat.color}-100 p-4 hover:shadow-md transition-shadow`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <stat.icon className={`size-6 ${stat.iconColor}`} />
                                    <span className={`text-xs font-medium ${stat.textColor}`}>
                                        Last 30d
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs text-gray-600">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tabs and Search */}
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
                                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                                        <Plus className="size-4" />
                                        Add New
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-4">
                            {/* Vehicles Tab */}
                            {activeTab === 'vehicles' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-green-100">
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Driver</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Service</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-green-50">
                                            {filteredVehicles.map((vehicle) => (
                                                <tr key={vehicle.id} className="hover:bg-green-50/50 transition-colors">
                                                    <td className="py-3 px-4 font-medium text-green-700">{vehicle.plate}</td>
                                                    <td className="py-3 px-4 text-gray-600">{vehicle.model} ({vehicle.year})</td>
                                                    <td className="py-3 px-4 text-gray-600">{vehicle.driver}</td>
                                                    <td className="py-3 px-4 text-gray-600">{vehicle.mileage}</td>
                                                    <td className="py-3 px-4 text-gray-600">{vehicle.lastService}</td>
                                                    <td className="py-3 px-4 text-gray-600">{vehicle.nextDue}</td>
                                                    <td className="py-3 px-4">{getStatusBadge(vehicle.status, vehicle.statusColor)}</td>
                                                    <td className="py-3 px-4">
                                                        <button className="text-gray-400 hover:text-green-600">
                                                            <Eye className="size-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Drivers Tab */}
                            {activeTab === 'drivers' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-green-100">
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Vehicles</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-green-50">
                                            {filteredDrivers.map((driver) => (
                                                <tr key={driver.id} className="hover:bg-green-50/50 transition-colors">
                                                    <td className="py-3 px-4 font-medium text-green-700">{driver.name}</td>
                                                    <td className="py-3 px-4 text-gray-600">{driver.email}</td>
                                                    <td className="py-3 px-4 text-gray-600">{driver.vehicles}</td>
                                                    <td className="py-3 px-4">{getStatusBadge(driver.status, driver.statusColor)}</td>
                                                    <td className="py-3 px-4 text-gray-600">{driver.lastActive}</td>
                                                    <td className="py-3 px-4">
                                                        <button className="text-gray-400 hover:text-green-600 mr-2">
                                                            <Eye className="size-4" />
                                                        </button>
                                                        <button className="text-gray-400 hover:text-green-600">
                                                            <MoreVertical className="size-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Records Tab */}
                            {activeTab === 'records' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-green-100">
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Service Date</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-green-50">
                                            {recentRecords.map((record) => (
                                                <tr key={record.id} className="hover:bg-green-50/50 transition-colors">
                                                    <td className="py-3 px-4 font-medium text-green-700">{record.vehicle}</td>
                                                    <td className="py-3 px-4 text-gray-600">{record.driver}</td>
                                                    <td className="py-3 px-4 text-gray-600">{record.serviceDate}</td>
                                                    <td className="py-3 px-4 text-gray-600">{record.type}</td>
                                                    <td className="py-3 px-4 text-gray-600">{record.mileage}</td>
                                                    <td className="py-3 px-4">{getStatusBadge(record.status, 'green')}</td>
                                                    <td className="py-3 px-4">
                                                        <button className="text-gray-400 hover:text-green-600">
                                                            <Eye className="size-4" />
                                                        </button>
                                                    </td>
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