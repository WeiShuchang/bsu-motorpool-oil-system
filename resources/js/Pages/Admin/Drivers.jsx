// Pages/Drivers/Index.jsx
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminHeader from '@/Components/AdminHeader';
import { Search, Plus, Edit2, Trash2, User, Filter } from 'lucide-react';
import AddDriverModal from '@/Components/Modals/AddDriverModal';
import EditDriverModal from '@/Components/Modals/EditDriverModal';
import DeleteConfirmationModal from '@/Components/Modals/DeleteDriverModal';
import { useToast } from '@/Hooks/useToast';

export default function Drivers({ drivers, filters, availableVehicles }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [deletingDriver, setDeletingDriver] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { showToast } = useToast();

    const handleSearch = (value) => {
        setSearchTerm(value);
        router.get(
            '/drivers',
            { search: value },
            { preserveState: true, replace: true }
        );
    };

   const handleAddDriver = (newDriver) => {
    // Optimistically update the UI
    if (newDriver && drivers.data) {
        const updatedDrivers = {
            ...drivers,
            data: [newDriver, ...drivers.data]
        };
        // You'll need to pass this updated data to your table
        // This depends on how you're managing state
    }
    
    // Refresh from server
    setIsLoading(true);
    router.reload({
        only: ['drivers'],
        onFinish: () => setIsLoading(false)
    });
};

// Add this skeleton loader component before your table
const TableSkeleton = () => (
    <>
        {[1, 2, 3, 4, 5].map((item) => (
            <tr key={item} className="animate-pulse">
                <td className="py-3 px-4">
                    <div className="size-10 rounded-full bg-gray-200"></div>
                </td>
                <td className="py-3 px-4">
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                </td>
                <td className="py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                </td>
                <td className="py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                </td>
                <td className="py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                </td>
                <td className="py-3 px-4">
                    <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                </td>
                <td className="py-3 px-4">
                    <div className="flex gap-2">
                        <div className="size-4 bg-gray-200 rounded"></div>
                        <div className="size-4 bg-gray-200 rounded"></div>
                    </div>
                </td>
            </tr>
        ))}
    </>
);

const handleUpdateDriver = (updatedDriver) => {
    // Show skeleton loader
    setIsLoading(true);
    
    // Refresh from server
    router.reload({
        only: ['drivers'],
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
            setIsLoading(false);
            setEditingDriver(null);
            showToast('Driver updated successfully', 'success');
        },
        onError: () => {
            setIsLoading(false);
            showToast('Failed to refresh drivers', 'error');
        }
    });
};

const handleDeleteDriver = (deletedDriverId) => {
    // Show skeleton loader
    setIsLoading(true);
    
    // Refresh from server
    router.reload({
        only: ['drivers'],
        onSuccess: () => {
            setIsLoading(false);
            setDeletingDriver(null);
            // Toast is already shown in the modal
        },
        onError: () => {
            setIsLoading(false);
        }
    });
};

    const getStatusBadge = (status) => {
        const statusConfig = {
            Active: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Active' },
            Inactive: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: 'Inactive' }
        };
        
        const config = statusConfig[status] || statusConfig.Inactive;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
            <Head title="Drivers" />
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
                                        placeholder="Search by name, email, or contact..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
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
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Details</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">License #</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicles</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-green-50">

                                        {isLoading ? (
        <TableSkeleton />
    ) : drivers.data && drivers.data.map((driver) => (
                                        <tr key={driver.id} className="hover:bg-green-50/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="size-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                                                    {driver.driver_image ? (
                                                        <img 
                                                            src={driver.driver_image} 
                                                            alt={driver.driver_full_name}
                                                            className="size-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="size-5 text-green-600" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-green-700">{driver.driver_full_name}</p>
                                                    <p className="text-xs text-gray-500">{driver.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                <span className="text-sm">{driver.contact_number}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-mono text-sm text-gray-600">{driver.license_number}</span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                <span className="text-sm">{driver.vehicles_count || 0} assigned</span>
                                            </td>
                                            <td className="py-3 px-4">{getStatusBadge(driver.status)}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => setEditingDriver(driver)}
                                                        className="text-gray-400 hover:text-green-600 transition-colors"
                                                        title="Edit Driver"
                                                    >
                                                        <Edit2 className="size-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeletingDriver(driver)}
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
                        {(!drivers.data || drivers.data.length === 0) && (
                            <div className="text-center py-12">
                                <User className="size-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
                                <p className="text-gray-500 mb-4">Get started by adding your first driver</p>
                       
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {drivers.links && drivers.links.length > 0 && drivers.data && drivers.data.length > 0 && (
                    <div className="bg-white rounded-xl border border-green-100 shadow-sm p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-gray-600">
                                Showing {drivers.from || 0} to {drivers.to || 0} of {drivers.total || 0} results
                            </p>
                            <div className="flex gap-2">
                                {drivers.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                            link.active 
                                                ? 'bg-green-600 text-white' 
                                                : 'bg-white border border-green-200 text-gray-600 hover:bg-green-50'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        disabled={!link.url}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Modals */}
            <AddDriverModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAddDriver}
                availableVehicles={availableVehicles}
            />

      <EditDriverModal
    isOpen={!!editingDriver}
    onClose={() => setEditingDriver(null)}
    onSave={handleUpdateDriver}  // This will trigger the refresh
    driver={editingDriver}
    availableVehicles={availableVehicles}
/>

<DeleteConfirmationModal
    isOpen={!!deletingDriver}
    onClose={() => setDeletingDriver(null)}
    onSuccess={handleDeleteDriver}  // Changed from onConfirm to onSuccess
    driver={deletingDriver}
/>
        </div>
    );
}