// Homepage.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Droplet, ArrowRight, Clock, ChartColumn, Shield, CheckCircle } from 'lucide-react';

export default function Homepage() {
    return (
        <>
            <Head title="BSU Motorpool - Fleet Management System" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                           
                                          <img 
                                    src="/storage/icons/bsu_motorpool-removebg-preview.png" 
                                    alt="BSU Motorpool Logo" 
                                    className="w-10 h-10 object-contain"
                                />
                        
                                <div>
                                    <h1 className="text-green-700 font-bold text-xl">BSU Motorpool</h1>
                                    <p className="text-xs text-gray-500">Fleet Management System</p>
                                </div>
                            </div>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 text-white h-9 px-4 py-2 transition-colors"
                            >
                                About
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                </header>

{/* Hero Section */}
<section className="relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                    <img 
                        src="/storage/images/backgrounds/bsu_motorpool.jpg" 
                        alt="Vehicle Maintenance" 
                        className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                
                {/* Floating Cards with Slide-in Animation */}
                <div className="absolute -left-4 top-1/4 bg-white p-4 rounded-xl shadow-lg border border-green-100 animate-[slideInLeft_0.6s_ease-out]">
                    <div className="text-3xl font-bold text-green-600">24/7</div>
                    <div className="text-sm text-gray-500">Monitoring</div>
                </div>
                <div className="absolute -right-4 bottom-1/4 bg-white p-4 rounded-xl shadow-lg border border-green-100 animate-[slideInRight_0.6s_ease-out]">
                    <div className="text-3xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-gray-500">Digital</div>
                </div>
            </div>


            <div className="space-y-6">
                <div className="inline-block">
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                        Professional Fleet Management
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Oil & Lubrication <span className="text-green-600">Tracking System</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600">
                    Keep your motorpool running smoothly with comprehensive maintenance tracking, 
                    automated reminders, and detailed service records for every vehicle.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium h-12 px-8 rounded-md text-lg transition-colors"
                    >
                        Login to System
                        <ArrowRight className="size-5" />
                    </Link>
              
                </div>
            </div>
            
 


            
        </div>
    </div>
    
    {/* Background Blobs */}
    <div className="absolute top-0 right-0 -z-10 opacity-20">
        <div className="size-96 bg-green-600 rounded-full blur-3xl"></div>
    </div>
    <div className="absolute bottom-0 left-0 -z-10 opacity-20">
        <div className="size-96 bg-green-300 rounded-full blur-3xl"></div>
    </div>
</section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Powerful Features for Fleet Management
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Everything you need to keep your motorpool vehicles well-maintained and running efficiently
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-white rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full p-6">
                                <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                                    <Droplet className="size-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-green-700">Track Lubrication</h3>
                                <p className="text-sm text-gray-600">
                                    Monitor oil changes and maintenance schedules for every vehicle in your fleet
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full p-6">
                                <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                                    <Clock className="size-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-green-700">Timely Reminders</h3>
                                <p className="text-sm text-gray-600">
                                    Never miss a service with automatic alerts for due and overdue maintenance
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full p-6">
                                <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                                    <ChartColumn className="size-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-green-700">Detailed Analytics</h3>
                                <p className="text-sm text-gray-600">
                                    Track costs, service history, and maintenance patterns over time
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="bg-white rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full p-6">
                                <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                                    <Shield className="size-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-green-700">Secure Access</h3>
                                <p className="text-sm text-gray-600">
                                    Separate portals for drivers and administrators with role-based permissions
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

     {/* Why Choose Us Section */}
<section className="py-20 bg-gradient-to-br from-green-50 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white max-w-lg mx-auto lg:mx-0">
                    <img 
                        src="https://images.unsplash.com/photo-1763679112092-053a6eadd72f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwZmxlZXQlMjBtYW5hZ2VtZW50fGVufDF8fHx8MTc3MDk3OTAxNnww&ixlib=rb-4.1.0&q=80&w=1080" 
                        alt="Fleet Management" 
                        className="w-full h-80 object-cover"
                        loading="lazy"
                    />
                </div>
            </div>
            
            <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Why Choose Our System?
                </h2>
                <p className="text-lg text-gray-600">
                    Streamline your motorpool operations with our comprehensive tracking solution
                </p>
                
                <div className="space-y-4">
                    {[
                        "Extend vehicle lifespan with regular maintenance",
                        "Reduce unexpected breakdowns and repairs",
                        "Lower overall maintenance costs",
                        "Complete digital record keeping",
                        "Real-time fleet status monitoring",
                        "Easy-to-use mobile-friendly interface"
                    ].map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className="bg-green-100 p-1 rounded-full mt-0.5 flex-shrink-0">
                                <CheckCircle className="size-5 text-green-600" />
                            </div>
                            <span className="text-gray-700">{benefit}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
</section>

                {/* CTA Section */}
                <section className="py-20 bg-green-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Ready to Optimize Your Fleet Management?
                            </h2>
                            <p className="text-lg text-green-100 max-w-2xl mx-auto">
                                Join BSU Motorpool in maintaining a well-serviced, efficient vehicle fleet
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-2 bg-white text-green-600 hover:bg-green-50 font-medium h-12 px-8 rounded-md text-lg transition-colors"
                            >
                                Access the System
                                <ArrowRight className="size-5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-white border-t border-green-100 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-600 p-2 rounded-lg">
                                    <Droplet className="size-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-700">BSU Motorpool</p>
                                    <p className="text-xs text-gray-500">Oil & Lubrication Tracking</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">
                                © {new Date().getFullYear()} BSU Motorpool. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}