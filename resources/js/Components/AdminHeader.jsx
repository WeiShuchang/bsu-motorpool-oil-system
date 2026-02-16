import { Link, usePage } from '@inertiajs/react';
import { Car, LogOut, LayoutDashboard, Truck, Users, Droplet } from 'lucide-react';
import { useState } from 'react';

export default function AdminHeader() {
    const { auth } = usePage().props;
    const user = auth.user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard, current: route().current('admin.dashboard') },
        { name: 'Vehicles', href: '#', icon: Truck, current: false },
        { name: 'Drivers', href: '#', icon: Users, current: false },
        { name: 'Service Records', href: '#', icon: Droplet, current: false },
    ];

    return (
        <header className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-3">
                      
                        <div>
                            <h1 className="text-green-700 font-bold text-xl">BSU Motorpool</h1>
                            <p className="text-xs text-gray-500">Admin Dashboard</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    item.current
                                        ? 'bg-green-50 text-green-700'
                                        : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                                }`}
                            >
                                <item.icon className="size-4" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm text-gray-500">Welcome,</p>
                            <p className="font-medium text-green-700">{user.name}</p>
                        </div>
                        
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-700"
                        >
                            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="hidden sm:inline-flex items-center justify-center text-sm font-medium border bg-white text-gray-700 hover:bg-green-50 h-8 rounded-md gap-1.5 px-3 border-green-200 transition-colors"
                        >
                            <LogOut className="size-4" />
                            <span className="hidden lg:inline">Logout</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-green-100">
                        <div className="flex flex-col space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                        item.current
                                            ? 'bg-green-50 text-green-700'
                                            : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <item.icon className="size-4" />
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-4 mt-2 border-t border-green-100">
                                <div className="px-4 py-2">
                                    <p className="text-sm text-gray-500">Logged in as</p>
                                    <p className="font-medium text-green-700">{user.name}</p>
                                </div>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LogOut className="size-4" />
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}