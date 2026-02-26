import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Filter, Image as ImageIcon, Car } from 'lucide-react';
import AddVehicleModal from '@/Components/Modals/AddVehicleModal';
import EditVehicleModal from '@/Components/Modals/EditVehicleModal';
import DeleteVehicleModal from '@/Components/Modals/DeleteVehicleModal';
import AdminHeader from '@/Components/AdminHeader';

export default function Vehicles() {
    const { auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    // Dummy data for vehicles
    const [vehicles, setVehicles] = useState([
        {
            id: 1,
            make: 'Toyota',
            model: 'Hilux',
            year: 2022,
            plate_number: 'ABC-1234',
            seat_capacity: 5,
            transmission: 'Manual',
            fuel_type: 'Diesel',
            status: 'available',
            images: null,
            last_maintenance: '2024-01-15',
            next_maintenance: '2024-04-15',
            color: 'White',
            engine_number: 'ENG-2022-001',
            chassis_number: 'CHS-2022-001'
        },
        {
            id: 2,
            make: 'Mitsubishi',
            model: 'Xpander',
            year: 2023,
            plate_number: 'XYZ-5678',
            seat_capacity: 7,
            transmission: 'Automatic',
            fuel_type: 'Gasoline',
            status: 'in_use',
            images: null,
            last_maintenance: '2024-02-20',
            next_maintenance: '2024-05-20',
            color: 'Silver',
            engine_number: 'ENG-2023-002',
            chassis_number: 'CHS-2023-002'
        },
        {
            id: 3,
            make: 'Nissan',
            model: 'Urvan',
            year: 2021,
            plate_number: 'DEF-9012',
            seat_capacity: 15,
            transmission: 'Manual',
            fuel_type: 'Diesel',
            status: 'maintenance',
            images: null,
            last_maintenance: '2024-03-01',
            next_maintenance: '2024-03-15',
            color: 'Gray',
            engine_number: 'ENG-2021-003',
            chassis_number: 'CHS-2021-003'
        },
        {
            id: 4,
            make: 'Ford',
            model: 'Ranger',
            year: 2023,
            plate_number: 'GHI-3456',
            seat_capacity: 5,
            transmission: 'Automatic',
            fuel_type: 'Diesel',
            status: 'available',
            images: null,
            last_maintenance: '2024-02-10',
            next_maintenance: '2024-05-10',
            color: 'Red',
            engine_number: 'ENG-2023-004',
            chassis_number: 'CHS-2023-004'
        },
        {
            id: 5,
            make: 'Hyundai',
            model: 'H-100',
            year: 2022,
            plate_number: 'JKL-7890',
            seat_capacity: 12,
            transmission: 'Manual',
            fuel_type: 'Diesel',
            status: 'in_use',
            images: null,
            last_maintenance: '2024-01-25',
            next_maintenance: '2024-04-25',
            color: 'Blue',
            engine_number: 'ENG-2022-005',
            chassis_number: 'CHS-2022-005'
        },
        {
            id: 6,
            make: 'Toyota',
            model: 'Innova',
            year: 2023,
            plate_number: 'MNO-1234',
            seat_capacity: 8,
            transmission: 'Automatic',
            fuel_type: 'Diesel',
            status: 'out_of_service',
            images: null,
            last_maintenance: '2024-02-28',
            next_maintenance: '2024-03-28',
            color: 'Black',
            engine_number: 'ENG-2023-006',
            chassis_number: 'CHS-2023-006'
        }
    ]);

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
        const vehicleWithId = {
            ...newVehicle,
            id: vehicles.length + 1,
            images: null,
            last_maintenance: new Date().toISOString().split('T')[0],
            next_maintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        setVehicles([...vehicles, vehicleWithId]);
        setShowAddModal(false);
    };

    const handleEditVehicle = (updatedVehicle) => {
        setVehicles(vehicles.map(vehicle => 
            vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
        ));
        setShowEditModal(false);
        setSelectedVehicle(null);
    };

    const handleDeleteVehicle = () => {
        setVehicles(vehicles.filter(vehicle => vehicle.id !== selectedVehicle.id));
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
                                    {filteredVehicles.map((vehicle) => (
                                        <tr key={vehicle.id} className="hover:bg-green-50/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center">
                                                    {vehicle.images ? (
                                                        <img 
                                                            src={`/storage/${vehicle.images[0]}`}
                                                            alt={`${vehicle.make} ${vehicle.model}`}
                                                            className="size-10 rounded-lg object-cover"
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
                                <button 
                                    onClick={() => setShowAddModal(true)}
                                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                >
                                    <Plus className="size-4" />
                                    Add Vehicle
                                </button>
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
                vehicle={selectedVehicle}  // Pass the entire vehicle object, not just the name
            />
        </div>
    );
}