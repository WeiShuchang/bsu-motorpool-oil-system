import { Head, Link } from '@inertiajs/react';
import DriverHeader from '@/Components/DriverHeader';
import { Calendar, Droplet, DollarSign, FileText, ChevronLeft, ChevronRight, Plus, Gauge, User, Wrench, Shield } from 'lucide-react';
import { useState } from 'react';

export default function VehicleDetails({ vehicle }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Sample data in case vehicle prop is not passed yet
    const vehicleData = vehicle || {
        id: 1,
        plate_number: 'ABC-1234',
        make: 'Toyota',
        model: 'Hiace',
        year: '2020',
        seat_capacity: 15,
        status: 'active',
        transmission: 'Manual',
        assigned_driver: 'John Driver',
        total_mileage: '45,230',
        total_maintenance_cost: '5,000',
        last_service: 'Jan 15, 2026',
        next_due: 'Apr 15, 2026',
        total_services: 2,
        avg_cost: 2500,
        driver_images: '["vehicles/M9VDsBLqTStmVP1UHRC7Bi3ow8KCiuWIqqXTyRi8.jpg","vehicles/Jxs33FPSISI8BYzDQ8pikf8eNK16U2Vl2A8drZEc.jpg","vehicles/SDg3G5MqFW9S9zrCXu9EcZwqeSVb71ytky6fYJGi.jpg"]'
    };

    // Helper function to display value or dash
    const displayValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return '-';
        }
        return value;
    };

    // Parse images
    const images = vehicleData.driver_images 
        ? (() => {
            try {
                const parsed = JSON.parse(vehicleData.driver_images);
                return Array.isArray(parsed) ? parsed : [vehicleData.driver_images];
            } catch {
                return [vehicleData.driver_images];
            }
        })()
        : [];

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <>
            <Head title={`${vehicleData.plate_number || 'Vehicle'} - Details | BSU Motorpool`} />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
                <DriverHeader />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button and Add Service Button */}
                    <div className="flex justify-between items-center mb-6">
                        <button 
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </button>

                        {/* Add Service Button */}
                        <Link
                            href={`/vehicle/${vehicleData.id}/add-service`}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                            Add Service Record
                        </Link>
                    </div>

                    {/* Vehicle Header with Image Gallery */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                        {/* Image Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center relative h-[340px]">
                            <div className="relative w-full h-full">
                                <img 
                                    src={images.length > 0 
                                        ? `/storage/${images[currentImageIndex]}` 
                                        : 'https://images.unsplash.com/photo-1648197323414-4255ea82d86b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBIaWFjZSUyMHZhbiUyMHdoaXRlfGVufDF8fHx8MTc3MDk3OTAxNHww&ixlib=rb-4.1.0&q=80&w=1080'
                                    } 
                                    alt={`${displayValue(vehicleData.make)} ${displayValue(vehicleData.model)}`} 
                                    className="w-full h-full object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
                                    }}
                                />
                                
                                {/* Image Navigation */}
                                {images.length > 1 && (
                                    <>
                                        <button 
                                            onClick={prevImage}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                                
                                {/* Image Counter */}
                                {images.length > 1 && (
                                    <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-lg text-xs z-10">
                                        {currentImageIndex + 1} / {images.length}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Vehicle Info Section */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayValue(vehicleData.plate_number)}</h1>
                                <p className="text-xl text-gray-600">
                                    {displayValue(vehicleData.make)} {displayValue(vehicleData.model)} 
                                    {vehicleData.year ? `(${vehicleData.year})` : ''}
                                </p>
                            </div>


                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Gauge className="size-5 text-gray-500" />
                                        <p className="text-sm text-gray-600">Total Mileage</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {vehicleData.total_mileage ? `${vehicleData.total_mileage} km` : '-'}
                                    </p>
                                </div>


                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="size-5 text-gray-500" />
                                        <p className="text-sm text-gray-600">Last Service</p>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">{displayValue(vehicleData.last_service)}</p>
                                </div>

                            </div>

                            {/* Thumbnail Strip */}
                            {images.length > 1 && (
                                <div className="flex gap-2 mt-4">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                                currentImageIndex === index 
                                                    ? 'border-green-500 ring-2 ring-green-200' 
                                                    : 'border-gray-200 opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img 
                                                src={`/storage/${img}`}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Cards Grid */}
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        {/* Maintenance Card */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="bg-gray-50 border-b border-gray-200 px-6 pt-6 pb-4">
                                <div className="flex items-center gap-2">
                                    <Wrench className="size-5 text-gray-700" />
                                    <h4 className="text-sm uppercase font-semibold text-gray-700">Maintenance</h4>
                                </div>
                            </div>
                            <div className="px-6 pt-4 pb-6 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Total Services</span>
                                    <span className="font-semibold text-gray-900">{displayValue(vehicleData.total_services)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Last Type</span>
                                    <span className="font-semibold text-gray-900">{vehicleData.total_services ? 'Engine Oil' : '-'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Service Status</span>
                                    <span className="font-semibold text-gray-900">{vehicleData.last_service ? 'Current' : '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Info Card */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="bg-gray-50 border-b border-gray-200 px-6 pt-6 pb-4">
                                <div className="flex items-center gap-2">
                                    <Gauge className="size-5 text-gray-700" />
                                    <h4 className="text-sm uppercase font-semibold text-gray-700">Vehicle Info</h4>
                                </div>
                            </div>
                            <div className="px-6 pt-4 pb-6 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Plate Number</span>
                                    <span className="font-semibold text-gray-900">{displayValue(vehicleData.plate_number)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Model</span>
                                    <span className="font-semibold text-gray-900">
                                        {displayValue(vehicleData.make)} {displayValue(vehicleData.model)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Year</span>
                                    <span className="font-semibold text-gray-900">{displayValue(vehicleData.year)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Cost Analysis Card */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="bg-gray-50 border-b border-gray-200 px-6 pt-6 pb-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="size-5 text-gray-700" />
                                    <h4 className="text-sm uppercase font-semibold text-gray-700">Cost Analysis</h4>
                                </div>
                            </div>
                            <div className="px-6 pt-4 pb-6 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Total Cost</span>
                                    <span className="font-semibold text-gray-900">
                                        {vehicleData.total_maintenance_cost ? `₱${vehicleData.total_maintenance_cost}` : '-'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Average Cost</span>
                                    <span className="font-semibold text-gray-900">
                                        {vehicleData.avg_cost ? `₱${vehicleData.avg_cost.toLocaleString()}` : '-'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Total Records</span>
                                    <span className="font-semibold text-gray-900">{displayValue(vehicleData.total_services)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Performance Card */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="bg-gray-50 border-b border-gray-200 px-6 pt-6 pb-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="size-5 text-gray-700" />
                                    <h4 className="text-sm uppercase font-semibold text-gray-700">Performance</h4>
                                </div>
                            </div>
                            <div className="px-6 pt-4 pb-6 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Driver</span>
                                    <span className="font-semibold text-gray-900">{displayValue(vehicleData.assigned_driver)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Total Mileage</span>
                                    <span className="font-semibold text-gray-900">
                                        {vehicleData.total_mileage ? `${vehicleData.total_mileage} km` : '-'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Status</span>
                                    <span className="font-semibold text-gray-900">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                            vehicleData.status === 'active' 
                                                ? 'bg-green-100 text-green-700' 
                                                : vehicleData.status === 'inactive'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {displayValue(vehicleData.status)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section with Working Functionality */}
                    <div className="w-full">
                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200">
                            <button 
                                onClick={() => setActiveTab('overview')}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'overview' 
                                        ? 'border-green-600 text-green-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                OVERVIEW
                            </button>
                            <button 
                                onClick={() => setActiveTab('history')}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'history' 
                                        ? 'border-green-600 text-green-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                SERVICE HISTORY
                            </button>
                            <button 
                                onClick={() => setActiveTab('details')}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'details' 
                                        ? 'border-green-600 text-green-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                DETAILS
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="mt-6">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="bg-white rounded-xl border border-gray-200">
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Vehicle Overview</h3>
                                            <p className="text-gray-600">
                                                {vehicleData.make || vehicleData.model ? (
                                                    <>This {displayValue(vehicleData.make)} {displayValue(vehicleData.model)} 
                                                    {vehicleData.year ? ` (${vehicleData.year})` : ''} with plate number {displayValue(vehicleData.plate_number)} 
                                                    is currently assigned to {displayValue(vehicleData.assigned_driver)}. 
                                                    {vehicleData.total_mileage ? ` The vehicle has accumulated ${vehicleData.total_mileage} km` : ''} 
                                                    {vehicleData.total_services ? ` and has undergone ${vehicleData.total_services} maintenance services.` : '.'}</>
                                                ) : (
                                                    'No vehicle information available.'
                                                )}
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-4 pt-4">
                                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                                    <h4 className="font-semibold text-green-900 mb-2">Last Service</h4>
                                                    <p className="text-sm text-green-700">{displayValue(vehicleData.last_service)}</p>
                                                </div>
                                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <h4 className="font-semibold text-blue-900 mb-2">Next Service Due</h4>
                                                    <p className="text-sm text-blue-700">{displayValue(vehicleData.next_due)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Service History Tab */}
                            {activeTab === 'history' && (
                                <div className="bg-white rounded-xl border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900">Service History</h4>
                                                <p className="text-sm text-gray-500">Complete lubrication and maintenance records</p>
                                            </div>
                                            <FileText className="w-6 h-6 text-gray-300" />
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {vehicleData.total_services > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="text-left py-3 px-2 font-medium text-gray-600">Date</th>
                                                            <th className="text-left py-3 px-2 font-medium text-gray-600">Type</th>
                                                            <th className="text-left py-3 px-2 font-medium text-gray-600">Oil Type</th>
                                                            <th className="text-left py-3 px-2 font-medium text-gray-600">Quantity</th>
                                                            <th className="text-left py-3 px-2 font-medium text-gray-600">Mileage</th>
                                                            <th className="text-left py-3 px-2 font-medium text-gray-600">Provider</th>
                                                            <th className="text-left py-3 px-2 font-medium text-gray-600">Cost</th>
                                                            <th className="text-left py-3 px-2 font-medium text-gray-600">Notes</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* Sample data - replace with actual service history from database */}
                                                        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                            <td className="py-3 px-2 font-medium">Jan 15, 2026</td>
                                                            <td className="py-3 px-2">
                                                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 border border-green-200">
                                                                    Engine Oil
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-2">10W-40 Synthetic</td>
                                                            <td className="py-3 px-2">4L</td>
                                                            <td className="py-3 px-2">45,230 km</td>
                                                            <td className="py-3 px-2">BSU Maintenance</td>
                                                            <td className="py-3 px-2 font-medium">₱2,500</td>
                                                            <td className="py-3 px-2 text-sm text-gray-500">Regular maintenance</td>
                                                        </tr>
                                                        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                            <td className="py-3 px-2 font-medium">Oct 15, 2025</td>
                                                            <td className="py-3 px-2">
                                                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 border border-green-200">
                                                                    Engine Oil
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-2">10W-40 Synthetic</td>
                                                            <td className="py-3 px-2">4L</td>
                                                            <td className="py-3 px-2">42,100 km</td>
                                                            <td className="py-3 px-2">BSU Maintenance</td>
                                                            <td className="py-3 px-2 font-medium">₱2,500</td>
                                                            <td className="py-3 px-2 text-sm text-gray-500">Scheduled service</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <p className="text-gray-500">No service records found.</p>
                                                <Link
                                                    href={`/vehicle/${vehicleData.id}/add-service`}
                                                    className="inline-flex items-center gap-2 mt-4 text-green-600 hover:text-green-700"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Add your first service record
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Details Tab */}
                            {activeTab === 'details' && (
                                <div className="bg-white rounded-xl border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <h4 className="text-lg font-bold text-gray-900">Vehicle Details</h4>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between py-2 border-b border-gray-100">
                                                    <span className="text-gray-500">Plate Number:</span>
                                                    <span className="font-medium">{displayValue(vehicleData.plate_number)}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-100">
                                                    <span className="text-gray-500">Make:</span>
                                                    <span className="font-medium">{displayValue(vehicleData.make)}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-100">
                                                    <span className="text-gray-500">Model:</span>
                                                    <span className="font-medium">{displayValue(vehicleData.model)}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-100">
                                                    <span className="text-gray-500">Year:</span>
                                                    <span className="font-medium">{displayValue(vehicleData.year)}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between py-2 border-b border-gray-100">
                                                    <span className="text-gray-500">Transmission:</span>
                                                    <span className="font-medium">{displayValue(vehicleData.transmission)}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-100">
                                                    <span className="text-gray-500">Seat Capacity:</span>
                                                    <span className="font-medium">
                                                        {vehicleData.seat_capacity ? `${vehicleData.seat_capacity} passengers` : '-'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-100">
                                                    <span className="text-gray-500">Assigned Driver:</span>
                                                    <span className="font-medium">{displayValue(vehicleData.assigned_driver)}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-100">
                                                    <span className="text-gray-500">Status:</span>
                                                    <span className="font-medium">
                                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                            vehicleData.status === 'active' 
                                                                ? 'bg-green-100 text-green-700' 
                                                                : vehicleData.status === 'inactive'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {displayValue(vehicleData.status)}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}