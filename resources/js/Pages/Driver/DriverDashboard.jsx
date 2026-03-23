import { Head, Link } from '@inertiajs/react';
import DriverHeader from '@/Components/DriverHeader';
import { Plus } from 'lucide-react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

// Skeleton Loader Component
const VehicleCardSkeleton = () => {
    return (
        <div className="group bg-white rounded-2xl border border-green-50 overflow-hidden animate-pulse">
            {/* Vehicle Image Skeleton */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-100 to-emerald-50">
                <div className="w-full h-full bg-gray-200"></div>
                {/* Status Badge Skeleton */}
                <div className="absolute top-3 right-3">
                    <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
                </div>
                {/* Vehicle Plate Badge Skeleton */}
                <div className="absolute bottom-3 left-3">
                    <div className="w-24 h-6 bg-gray-300/60 rounded-lg"></div>
                </div>
            </div>

            {/* Card Content Skeleton */}
            <div className="p-5">
                {/* Vehicle Title Skeleton */}
                <div className="mb-4 text-center">
                    <div className="h-6 w-32 bg-gray-200 rounded mx-auto mb-2"></div>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                </div>

                {/* Vehicle Specs Skeleton */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                        <div className="h-3 w-8 bg-gray-200 rounded mx-auto mb-2"></div>
                        <div className="h-4 w-12 bg-gray-200 rounded mx-auto"></div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                        <div className="h-3 w-8 bg-gray-200 rounded mx-auto mb-2"></div>
                        <div className="h-4 w-12 bg-gray-200 rounded mx-auto"></div>
                    </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex gap-2">
                    <div className="flex-1 h-9 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 h-9 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
};

export default function DriverDashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignedVehicles();
    }, []);

    const fetchAssignedVehicles = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/driver/get-assigned-vehicles');
            setVehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

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

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {loading ? (
                            // Show 4 skeleton cards while loading
                            <>
                                <VehicleCardSkeleton />
                                <VehicleCardSkeleton />
                                <VehicleCardSkeleton />
                                <VehicleCardSkeleton />
                            </>
                        ) : (
                            // Show actual vehicles
                            vehicles.map((vehicle) => (
                                <div key={vehicle.id} className="group bg-white rounded-2xl border border-green-50 hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
                                    {/* Vehicle Image with Gradient Overlay */}
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-100 to-emerald-50">
                                        <img 
                                            src={vehicle.image 
                                                ? `/storage/${JSON.parse(vehicle.image)[0]}` 
                                                : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
                                            } 
                                            alt={`${vehicle.make} ${vehicle.model}`} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
                                            }}
                                        />
                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-green-700 shadow-sm border border-green-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                {vehicle.status}
                                            </span>
                                        </div>
                                        {/* Vehicle Plate Badge */}
                                        <div className="absolute bottom-3 left-3">
                                            <span className="inline-flex items-center rounded-lg bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-mono font-medium text-white border border-white/20">
                                                {vehicle.plate_number}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5">
                                        {/* Vehicle Title */}
                                        <div className="mb-4 text-center">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                {vehicle.make} {vehicle.model}
                                            </h3>
                                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                <span>{vehicle.seat_capacity} passengers</span>
                                            </div>
                                        </div>

                                        {/* Vehicle Specs */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="bg-green-50 rounded-xl p-3 text-center">
                                                <span className="text-xs text-gray-500 block mb-1">Make</span>
                                                <span className="font-semibold text-gray-900 text-sm block">{vehicle.make}</span>
                                            </div>
                                            <div className="bg-green-50 rounded-xl p-3 text-center">
                                                <span className="text-xs text-gray-500 block mb-1">Model</span>
                                                <span className="font-semibold text-gray-900 text-sm block">{vehicle.model}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <Link 
                                                href={`/driver/vehicle/${vehicle.id}`}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 border-2 border-green-100 bg-white text-gray-700 hover:bg-green-50 hover:border-green-200 h-9 px-3 rounded-xl text-xs font-medium transition-all duration-200 group"
                                            >
                                                <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Details
                                            </Link>
                                            <Link 
                                            href={`/vehicle/${vehicle.id}/add-service`}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-9 px-3 rounded-xl text-xs font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                                                <Plus className="w-3.5 h-3.5" />
                                                Log Service
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        
                        {/* Show message if no vehicles and not loading */}
                        {!loading && vehicles.length === 0 && (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500">No assigned vehicles found.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}