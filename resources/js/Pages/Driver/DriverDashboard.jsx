import React from 'react';
import { Head } from '@inertiajs/react';
import DriverHeader from '@/Components/DriverHeader';
import { Plus } from 'lucide-react';

export default function DriverDashboard() {
    // Mock data - replace with actual data from backend
    const vehicles = [
        {
            id: 1,
            plate: 'ABC-1234',
            model: 'Toyota Hiace',
            year: 2020,
            image: 'https://images.unsplash.com/photo-1648197323414-4255ea82d86b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBIaWFjZSUyMHZhbiUyMHdoaXRlfGVufDF8fHx8MTc3MDk3OTAxNHww&ixlib=rb-4.1.0&q=80&w=1080',
            mileage: '45,230 km',
            lastService: 'Jan 15, 2026',
            nextDue: 'Apr 15, 2026',
            status: 'On Track'
        },
        {
            id: 2,
            plate: 'XYZ-5678',
            model: 'Mitsubishi L300',
            year: 2019,
            image: 'https://images.unsplash.com/photo-1715372028845-f7cd49a7ed99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNaXRzdWJpc2hpJTIwTDMwMCUyMHZhbiUyMHNpbHZlcnxlbnwxfHx8fDE3NzA5NzkwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
            mileage: '38,450 km',
            lastService: 'Feb 01, 2026',
            nextDue: 'May 01, 2026',
            status: 'On Track'
        },
        {
            id: 3,
            plate: 'DEF-9012',
            model: 'Nissan Urvan',
            year: 2021,
            image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YW58ZW58MHx8fHwxNzcwOTc5MDE0&ixlib=rb-4.1.0&q=80&w=1080',
            mileage: '52,180 km',
            lastService: 'Mar 10, 2026',
            nextDue: 'Jun 10, 2026',
            status: 'On Track'
        }
    ];

    return (
        <>
            <Head title="Driver Dashboard - BSU Motorpool" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
                <DriverHeader />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <h2 className="text-green-700 font-bold text-2xl mb-2">My Assigned Vehicles</h2>
                        <p className="text-gray-500">Manage lubrication records for your vehicles</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {vehicles.map((vehicle) => (
                            <div key={vehicle.id} className="bg-white rounded-xl border border-green-100 hover:shadow-lg transition-shadow overflow-hidden">
                                {/* Vehicle Image */}
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    <img 
                                        src={vehicle.image} 
                                        alt={vehicle.model} 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span className="inline-flex items-center justify-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                            {vehicle.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Header */}
                                <div className="px-6 pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-xl font-bold text-green-700">{vehicle.plate}</h4>
                                            <p className="text-sm text-gray-500">{vehicle.model} ({vehicle.year})</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="px-6 pb-6 space-y-4">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between border-b border-green-50 pb-1">
                                            <span className="text-gray-500">Total Mileage:</span>
                                            <span className="font-medium text-gray-900">{vehicle.mileage}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-green-50 pb-1">
                                            <span className="text-gray-500">Last Service:</span>
                                            <span className="font-medium text-gray-900">{vehicle.lastService}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Next Due:</span>
                                            <span className="font-medium text-green-600">{vehicle.nextDue}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        <button className="inline-flex items-center justify-center flex-1 border border-green-200 bg-white text-gray-700 hover:bg-green-50 h-9 px-4 rounded-md text-sm font-medium transition-colors">
                                            View History
                                        </button>
                                        <button className="inline-flex items-center justify-center flex-1 bg-green-600 hover:bg-green-700 text-white h-9 px-4 rounded-md text-sm font-medium transition-colors">
                                            <Plus className="size-4 mr-2" />
                                            Log Service
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}