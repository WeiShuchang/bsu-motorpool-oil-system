import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminHeader from '@/Components/AdminHeader';
import { Search, Filter, Plus, Eye, Edit2, Trash2, User } from 'lucide-react';
import AddDriverModal from '@/Components/Modals/AddDriverModal';
import EditDriverModal from '@/Components/Modals/EditDriverModal';
import DeleteDriverModal from '@/Components/Modals/DeleteDriverModal';

export default function Drivers() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);

    // Mock data - replace with actual data from backend
    const [drivers, setDrivers] = useState([
        {
            id: 1,
            name: 'John Driver',
            email: 'john.driver@bsumotorpool.edu',
            contact: '+63 912 345 6789',
            vehicles: 2,
            status: 'Active',
            statusColor: 'green',
            image: null,
            licenseNumber: 'D01-23-456789',
            licenseExpiry: '2026-12-31',
            address: '123 Main St, City',
            employeeId: 'EMP-2024-001'
        },
        {
            id: 2,
            name: 'Jane Driver',
            email: 'jane.driver@bsumotorpool.edu',
            contact: '+63 923 456 7890',
            vehicles: 2,
            status: 'Active',
            statusColor: 'green',
            image: null,
            licenseNumber: 'D02-23-456790',
            licenseExpiry: '2026-11-30',
            address: '456 Oak Ave, City',
            employeeId: 'EMP-2024-002'
        },
        {
            id: 3,
            name: 'Mike Driver',
            email: 'mike.driver@bsumotorpool.edu',
            contact: '+63 934 567 8901',
            vehicles: 2,
            status: 'Active',
            statusColor: 'green',
            image: null,
            licenseNumber: 'D03-23-456791',
            licenseExpiry: '2026-10-31',
            address: '789 Pine Rd, City',
            employeeId: 'EMP-2024-003'
        },
        {
            id: 4,
            name: 'Sarah Driver',
            email: 'sarah.driver@bsumotorpool.edu',
            contact: '+63 945 678 9012',
            vehicles: 1,
            status: 'Inactive',
            statusColor: 'red',
            image: null,
            licenseNumber: 'D04-23-456792',
            licenseExpiry: '2026-09-30',
            address: '321 Elm St, City',
            employeeId: 'EMP-2024-004'
        },
    ]);

    const getStatusBadge = (status, color) => {
        const colors = {
            green: 'bg-green-50 text-green-700 border-green-200',
            red: 'bg-red-50 text-red-700 border-red-200',
            yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.green}`}>
                {status}
            </span>
        );
    };

    const handleAddDriver = (newDriver) => {
        // Add logic to save driver to backend
        const driverWithId = {
            ...newDriver,
            id: drivers.length + 1,
            vehicles: 0,
            status: 'Active',
            statusColor: 'green'
        };
        setDrivers([...drivers, driverWithId]);
        setShowAddModal(false);
    };

    const handleEditDriver = (updatedDriver) => {
        // Add logic to update driver in backend
        setDrivers(drivers.map(driver => 
            driver.id === updatedDriver.id ? updatedDriver : driver
        ));
        setShowEditModal(false);
        setSelectedDriver(null);
    };

    const handleDeleteDriver = () => {
        // Add logic to delete driver from backend
        setDrivers(drivers.filter(driver => driver.id !== selectedDriver.id));
        setShowDeleteModal(false);
        setSelectedDriver(null);
    };

    const filteredDrivers = drivers.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.contact?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Head title="Drivers - BSU Motorpool" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
                <AdminHeader />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header with Search and Add Button */}
                    <div className="bg-white rounded-xl border border-green-100 shadow-sm mb-6">
                        <div className="p-4 border-b border-green-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Drivers Management</h2>
                                <p className="text-sm text-gray-600 mt-1">Manage your motorpool drivers</p>
                            </div>
                            
                                
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search drivers..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9 pr-4 py-2 text-sm border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 w-full sm:w-64"
                                        />
                                    </div>
                                    <button className="p-2 border border-green-200 rounded-lg hover:bg-green-50">
                                        <Filter className="size-4 text-gray-600" />
                                    </button>
                                    <button 
                                        onClick={() => setShowAddModal(true)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                                    >
                                        <Plus className="size-4" />
                                        Add Driver
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Drivers Table */}
                        <div className="p-4">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-green-100">
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Vehicles</th>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-green-50">
                                        {filteredDrivers.map((driver) => (
                                            <tr key={driver.id} className="hover:bg-green-50/50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="size-10 rounded-full bg-green-100 flex items-center justify-center">
                                                        {driver.image ? (
                                                            <img src={driver.image} alt={driver.name} className="size-10 rounded-full object-cover" />
                                                        ) : (
                                                            <User className="size-5 text-green-600" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <p className="font-medium text-green-700">{driver.name}</p>
                                                        <p className="text-xs text-gray-500">{driver.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-gray-600">{driver.contact}</td>
                                                <td className="py-3 px-4 text-gray-600">{driver.vehicles}</td>
                                                <td className="py-3 px-4">{getStatusBadge(driver.status, driver.statusColor)}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                  
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedDriver(driver);
                                                                setShowEditModal(true);
                                                            }}
                                                            className="text-gray-400 hover:text-green-600 transition-colors"
                                                            title="Edit Driver"
                                                        >
                                                            <Edit2 className="size-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedDriver(driver);
                                                                setShowDeleteModal(true);
                                                            }}
                                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                                            title="Delete Driver"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Empty State */}
                            {filteredDrivers.length === 0 && (
                                <div className="text-center py-12">
                                    <User className="size-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
                                    <p className="text-gray-500 mb-4">Get started by adding your first driver</p>
                                    <button 
                                        onClick={() => setShowAddModal(true)}
                                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        <Plus className="size-4" />
                                        Add Driver
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <AddDriverModal 
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAddDriver}
            />

            <EditDriverModal 
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedDriver(null);
                }}
                onSave={handleEditDriver}
                driver={selectedDriver}
            />

            <DeleteDriverModal 
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedDriver(null);
                }}
                onConfirm={handleDeleteDriver}
                driverName={selectedDriver?.name}
            />
        </>
    );
}