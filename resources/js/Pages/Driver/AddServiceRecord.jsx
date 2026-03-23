import { Head } from '@inertiajs/react';
import DriverHeader from '@/Components/DriverHeader';
import { Calendar, Gauge, Car, Save, X, ChevronDown, Droplet, Wind, SprayCan, Fuel, Wrench } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

export default function AddServiceRecord({ vehicle }) {
    const [formData, setFormData] = useState({
        // Basic fields
        service_date: new Date().toISOString().split('T')[0],
        mileage: vehicle?.total_mileage || '',
        lubrication_type: 'Engine Oil',
        oil_type: '',
        quantity: '',
        cost: '',
        service_provider: '',
        notes: '',
        
        // Additional fields
        coolant: '',
        break_cleaner: false,
        wiper_washer: false,
        engine_flush: false,
        penetrating_oil: false,
    });

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

 const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await axios.post(`/vehicles/${vehicle.id}/service-record`, formData);

        window.location.href = `/driver/vehicle/${vehicle.id}`;

    } catch (error) {
        console.error(error);
        alert('Failed to save service record');
    }
};

    const vehicleData = vehicle || {
        plate_number: 'ABC-1234',
        make: 'Toyota',
        model: 'Hiace',
        year: '2020',
        total_mileage: '45,230'
    };

    return (
        <>
            <Head title="Add Service Record - BSU Motorpool" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
                <DriverHeader />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <button 
                        onClick={() => window.history.back()}
                        className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Vehicle Details
                    </button>

                    {/* Main Content - 3 column layout */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Vehicle Info Card (Sticky) */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-green-100 overflow-hidden sticky top-8 shadow-sm">
                                {/* Vehicle Image */}
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    <img 
                                        src={vehicleData.driver_images 
                                            ? `/storage/${JSON.parse(vehicleData.driver_images)[0]}` 
                                            : 'https://images.unsplash.com/photo-1648197323414-4255ea82d86b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBIaWFjZSUyMHZhbiUyMHdoaXRlfGVufDF8fHx8MTc3MDk3OTAxNHww&ixlib=rb-4.1.0&q=80&w=1080'
                                        } 
                                        alt={`${vehicleData.make} ${vehicleData.model}`} 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="font-bold text-lg">{vehicleData.plate_number}</h3>
                                        <p className="text-sm opacity-90">{vehicleData.make} {vehicleData.model}</p>
                                    </div>
                                </div>

                                {/* Vehicle Info Summary */}
                                <div className="p-6">
                                    <h4 className="font-bold text-green-700 mb-4">Vehicle Information</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-green-50/70 rounded-lg">
                                            <div className="bg-green-100/70 p-2 rounded-lg">
                                                <Car className="w-4 h-4 text-green-700" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">Model & Year</p>
                                                <p className="font-medium">{vehicleData.make} {vehicleData.model} ({vehicleData.year})</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-green-50/70 rounded-lg">
                                            <div className="bg-green-100/70 p-2 rounded-lg">
                                                <Gauge className="w-4 h-4 text-green-700" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">Current Mileage</p>
                                                <p className="font-medium">{vehicleData.total_mileage} km</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-green-50/70 rounded-lg">
                                            <div className="bg-green-100/70 p-2 rounded-lg">
                                                <Calendar className="w-4 h-4 text-green-700" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">Last Service</p>
                                                <p className="font-medium">Jan 15, 2026</p>
                                            </div>
                                        </div>
              
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Service Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-green-100 shadow-sm">
                                <div className="p-6 border-b border-green-100">
                                    <h4 className="text-lg font-bold text-green-700">Add Service Record</h4>
                                    <p className="text-sm text-gray-500">Enter the lubrication and maintenance service information</p>
                                </div>
                                
                                <div className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Basic Fields - 2 columns */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700" htmlFor="service_date">
                                                    Service Date
                                                </label>
                                                <input 
                                                    type="date" 
                                                    id="service_date"
                                                    value={formData.service_date}
                                                    onChange={handleChange}
                                                    className="w-full h-9 px-3 rounded-md border border-green-200 bg-white/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700" htmlFor="mileage">
                                                    Current Mileage (km)
                                                </label>
                                                <input 
                                                    type="number" 
                                                    id="mileage"
                                                    value={formData.mileage}
                                                    onChange={handleChange}
                                                    className="w-full h-9 px-3 rounded-md border border-green-200 bg-white/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                                                    placeholder="e.g., 45230"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700" htmlFor="lubrication_type">
                                                    Lubrication Type
                                                </label>
                                                <select
                                                    id="lubrication_type"
                                                    value={formData.lubrication_type}
                                                    onChange={handleChange}
                                                    className="w-full h-9 px-3 rounded-md border border-green-200 bg-white/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors appearance-none"
                                                >
                                                    <option value="Engine Oil">Engine Oil</option>
                                                    <option value="Transmission Oil">Transmission Oil</option>
                                                    <option value="Brake Fluid">Brake Fluid</option>
                                                    <option value="Power Steering">Power Steering</option>
                                                    <option value="Differential Oil">Differential Oil</option>
                                                    <option value="Grease">Grease</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700" htmlFor="oil_type">
                                                    Oil/Fluid Type
                                                </label>
                                                <input 
                                                    type="text" 
                                                    id="oil_type"
                                                    value={formData.oil_type}
                                                    onChange={handleChange}
                                                    className="w-full h-9 px-3 rounded-md border border-green-200 bg-white/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                                                    placeholder="e.g., 10W-40 Synthetic"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700" htmlFor="quantity">
                                                    Quantity (Liters)
                                                </label>
                                                <input 
                                                    type="number" 
                                                    id="quantity"
                                                    value={formData.quantity}
                                                    onChange={handleChange}
                                                    step="0.1"
                                                    className="w-full h-9 px-3 rounded-md border border-green-200 bg-white/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                                                    placeholder="e.g., 4"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700" htmlFor="cost">
                                                    Cost (₱)
                                                </label>
                                                <input 
                                                    type="number" 
                                                    id="cost"
                                                    value={formData.cost}
                                                    onChange={handleChange}
                                                    step="0.01"
                                                    className="w-full h-9 px-3 rounded-md border border-green-200 bg-white/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                                                    placeholder="e.g., 2500"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-medium text-gray-700" htmlFor="service_provider">
                                                    Service Provider
                                                </label>
                                                <input 
                                                    type="text" 
                                                    id="service_provider"
                                                    value={formData.service_provider}
                                                    onChange={handleChange}
                                                    className="w-full h-9 px-3 rounded-md border border-green-200 bg-white/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                                                    placeholder="e.g., BSU Maintenance, External Shop"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Additional Fields Section */}
                                        <div className="border-t border-green-100 pt-6">
                                            <h5 className="font-bold text-green-700 mb-4">Additional Maintenance Items</h5>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {/* Coolant */}
                                                <div className="flex items-center gap-3 p-3 bg-green-50/70 rounded-lg">
                                                    <div className="bg-blue-100/70 p-2 rounded-lg">
                                                        <Droplet className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-sm font-medium text-gray-700" htmlFor="coolant">
                                                            Coolant
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            id="coolant"
                                                            value={formData.coolant}
                                                            onChange={handleChange}
                                                            className="w-full mt-1 px-2 py-1 text-sm rounded border border-green-200 bg-white/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                                                            placeholder="Type/Brand"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Break Cleaner (Checkbox) */}
                                                <div className="flex items-center gap-3 p-3 bg-green-50/70 rounded-lg">
                                                    <div className="bg-amber-100/70 p-2 rounded-lg">
                                                        <SprayCan className="w-4 h-4 text-amber-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-sm font-medium text-gray-700" htmlFor="break_cleaner">
                                                                Brake Cleaner
                                                            </label>
                                                            <input 
                                                                type="checkbox" 
                                                                id="break_cleaner"
                                                                checked={formData.break_cleaner}
                                                                onChange={handleChange}
                                                                className="w-4 h-4 text-green-600 rounded border-green-300 focus:ring-green-500"
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-500">Applied during service</p>
                                                    </div>
                                                </div>

                                                {/* Wiper Washer */}
                                                <div className="flex items-center gap-3 p-3 bg-green-50/70 rounded-lg">
                                                    <div className="bg-cyan-100/70 p-2 rounded-lg">
                                                        <Wind className="w-4 h-4 text-cyan-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-sm font-medium text-gray-700" htmlFor="wiper_washer">
                                                                Wiper Washer
                                                            </label>
                                                            <input 
                                                                type="checkbox" 
                                                                id="wiper_washer"
                                                                checked={formData.wiper_washer}
                                                                onChange={handleChange}
                                                                className="w-4 h-4 text-green-600 rounded border-green-300 focus:ring-green-500"
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-500">Fluid refilled</p>
                                                    </div>
                                                </div>

                                                {/* Engine Flush */}
                                                <div className="flex items-center gap-3 p-3 bg-green-50/70 rounded-lg">
                                                    <div className="bg-purple-100/70 p-2 rounded-lg">
                                                        <Fuel className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-sm font-medium text-gray-700" htmlFor="engine_flush">
                                                                Engine Flush
                                                            </label>
                                                            <input 
                                                                type="checkbox" 
                                                                id="engine_flush"
                                                                checked={formData.engine_flush}
                                                                onChange={handleChange}
                                                                className="w-4 h-4 text-green-600 rounded border-green-300 focus:ring-green-500"
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-500">Engine cleaning performed</p>
                                                    </div>
                                                </div>

                                                {/* Penetrating Oil */}
                                                <div className="flex items-center gap-3 p-3 bg-green-50/70 rounded-lg md:col-span-1">
                                                    <div className="bg-orange-100/70 p-2 rounded-lg">
                                                        <Wrench className="w-4 h-4 text-orange-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-sm font-medium text-gray-700" htmlFor="penetrating_oil">
                                                                Penetrating Oil
                                                            </label>
                                                            <input 
                                                                type="checkbox" 
                                                                id="penetrating_oil"
                                                                checked={formData.penetrating_oil}
                                                                onChange={handleChange}
                                                                className="w-4 h-4 text-green-600 rounded border-green-300 focus:ring-green-500"
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-500">Applied to bolts and moving parts</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notes Field */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700" htmlFor="notes">
                                                Notes
                                            </label>
                                            <textarea 
                                                id="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                rows="4"
                                                className="w-full px-3 py-2 rounded-md border border-green-200 bg-white/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors resize-none"
                                                placeholder="Additional notes about the service..."
                                            ></textarea>
                                        </div>

                                        {/* Form Actions */}
                                        <div className="flex gap-4 pt-4">
                                            <button 
                                                type="button"
                                                onClick={() => window.history.back()}
                                                className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md border border-green-200 bg-white/50 hover:bg-white text-gray-700 transition-colors text-sm font-medium"
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit"
                                                className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors text-sm font-medium shadow-sm"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save Record
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}