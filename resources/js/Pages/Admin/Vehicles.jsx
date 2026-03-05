import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Filter, Image as ImageIcon, Car } from 'lucide-react';
import AddVehicleModal from '@/Components/Modals/AddVehicleModal';
import EditVehicleModal from '@/Components/Modals/EditVehicleModal';
import DeleteVehicleModal from '@/Components/Modals/DeleteVehicleModal';
import AdminHeader from '@/Components/AdminHeader';
import axios from 'axios';

export default function Vehicles() {
    const { auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [vehicles, setVehicles] = useState([]);


const fetchVehicles = async () => {
    setIsLoading(true);
    try {
        const response = await axios.get('/admin/vehicles/data'); // Updated URL
        setVehicles(response.data);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
    } finally {
        setIsLoading(false);
    }
};

    useEffect(() => {
        fetchVehicles();
    }, []);

    // Add this skeleton loader component
    const TableSkeleton = () => (
        <>
            {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="animate-pulse">
                    <td className="py-3 px-4">
                        <div className="size-10 rounded-lg bg-gray-200"></div>
                    </td>
                    <td className="py-3 px-4">
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                    </td>
                    <td className="py-3 px-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="py-3 px-4">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="py-3 px-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
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

    const getStatusBadge = (status) => {
        const statusConfig = {
            available: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Available' },
            in_use: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'In Use' },
            maintenance: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Maintenance' },
            out_of_service: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Out of Service' }
        };
        
        const config = statusConfig[status] || statusConfig.available;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
                {config.label}
            </span>
        );
    };

    const handleAddVehicle = (newVehicle) => {
        setVehicles(prev => [newVehicle, ...prev]);
        setShowAddModal(false);
    };

const handleEditVehicle = (updatedVehicle) => {
    setIsLoading(true);
    setVehicles(vehicles.map(vehicle => 
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
    ));
    setShowEditModal(false);
    setSelectedVehicle(null);
    setTimeout(() => setIsLoading(false), 500);
};

const handleDeleteVehicle = (deletedVehicleId) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== deletedVehicleId));
    setShowDeleteModal(false);
    setSelectedVehicle(null);
};

    const filteredVehicles = vehicles.filter(vehicle => 
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.plate_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
            <AdminHeader />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with Search and Add Button */}
                <div className="bg-white rounded-xl border border-green-100 shadow-sm mb-6">
                    <div className="p-4 border-b border-green-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Vehicles Management</h2>
                                <p className="text-sm text-gray-600 mt-1">Manage your motorpool vehicles</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by make, model, or plate..."
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
                                    Add Vehicle
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Vehicles Table */}
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-green-100">
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Seat Capacity</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Transmission</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-green-50">
                                      {isLoading ? (
                                            <TableSkeleton />
                                        ) : filteredVehicles.map((vehicle) => (
                                        <tr key={vehicle.id} className="hover:bg-green-50/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center">
                                                            {vehicle.driver_images ? (
                                                                <img 
                                                                    src={`/storage/${JSON.parse(vehicle.driver_images)[0]}`}
                                                                    alt={`${vehicle.make} ${vehicle.model}`}
                                                                    className="size-10 rounded-lg object-cover"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.parentElement.innerHTML = '<div class="size-5 text-green-600"><Car /></div>';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Car className="size-5 text-green-600" />
                                                            )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-green-700">{vehicle.make} {vehicle.model}</p>
                          
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-mono text-sm text-gray-600">{vehicle.plate_number}</span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">{vehicle.seat_capacity} seats</td>
                                            <td className="py-3 px-4 text-gray-600">{vehicle.transmission}</td>
                                            <td className="py-3 px-4">{getStatusBadge(vehicle.status)}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedVehicle(vehicle);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="text-gray-400 hover:text-green-600 transition-colors"
                                                        title="Edit Vehicle"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedVehicle(vehicle);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                                        title="Delete Vehicle"
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
                        {filteredVehicles.length === 0 && (
                            <div className="text-center py-12">
                                <Car className="size-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                                <p className="text-gray-500 mb-4">Get started by adding your first vehicle</p>
                          
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modals */}
            <AddVehicleModal 
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAddVehicle}
            />
            
         <EditVehicleModal
    isOpen={showEditModal}
    onClose={() => {
        setShowEditModal(false);
        setSelectedVehicle(null);
    }}
    onSave={handleEditVehicle}
    vehicle={selectedVehicle}
/>
            
      <DeleteVehicleModal
    isOpen={showDeleteModal}
    onClose={() => {
        setShowDeleteModal(false);
        setSelectedVehicle(null);
    }}
    onSuccess={handleDeleteVehicle}
    vehicle={selectedVehicle}
/>
        </div>
    );
}